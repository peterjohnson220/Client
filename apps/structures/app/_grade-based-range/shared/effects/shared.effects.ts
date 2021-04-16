import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { StructureModelingApiService, StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import * as fromDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { generateMockRangeAdvancedSetting, RangeGroupMetadata } from 'libs/models/structures';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import * as fromJobsToGradeActions from 'libs/features/structures/add-jobs-to-range/actions/jobs-to-grade.actions';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';

import * as fromSharedGradeBasedRangeActions from '../actions/shared.actions';
import * as fromSharedGradeBasedReducer from '../reducers';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { UrlService } from '../../../shared/services';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import { Workflow } from '../../../shared/constants/workflow';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';
import { PayfactorsApiModelMapper } from '../../../shared/helpers/payfactors-api-model-mapper';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromGradeBasedSharedActions from '../actions/shared.actions';

@Injectable()
export class SharedEffects {

  @Effect()
  getCurrentRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedGradeBasedRangeActions.GET_GRADE_RANGE_DETAILS),
      switchMap((action: fromSharedGradeBasedRangeActions.GetGradeRangeDetails) => {
        return this.structureRangeGroupApiService.getDetails(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedGradeBasedRangeActions.GetGradeRangeDetailsSuccess(res);
            }),
            catchError((err) => of(new fromSharedGradeBasedRangeActions.GetGradeRangeDetailsError(err)))
          );
      })
    );

  @Effect()
  reloadRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType<fromJobsToGradeActions.SaveGradeJobMapsSuccess>(fromJobsToGradeActions.SAVE_GRADE_JOB_MAPS_SUCCESS),
        withLatestFrom(
          this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
      (action, contextStructureRangeGroupId: number) => {
        return { action, contextStructureRangeGroupId };
      }
      ),
      switchMap((data) => {
        return this.structureRangeGroupApiService.getDetails(data.contextStructureRangeGroupId)
          .pipe(
            map((res) => {
              return new fromSharedGradeBasedRangeActions.GetGradeRangeDetailsSuccess(res);
            }),
            catchError((err) => of(new fromSharedGradeBasedRangeActions.GetGradeRangeDetailsError(err)))
          );
      })
    );

  @Effect()
  createGradeBasedModelSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromModelSettingsModalActions.CreateGradeBasedModelSettings>(fromModelSettingsModalActions.CREATE_GRADE_BASED_MODEL_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult, pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data) => {
        let advancedSetting;
        if (data.action.payload.formValue.RangeAdvancedSetting != null) {
          advancedSetting = PayfactorsApiModelMapper.mapAdvancedSettingModalFormToAdvancedSettingRequest(
            data.action.payload.formValue.RangeAdvancedSetting, data.action.payload.rounding);
        } else {
          advancedSetting = generateMockRangeAdvancedSetting();
        }

        return this.structureModelingApiService.createGradeBasedModelSettings(
          PayfactorsApiModelMapper.mapCreateGradeBasedModelSettingsModalFormToSaveSettingsRequest(
            data.action.payload.rangeGroupId, data.action.payload.formValue, advancedSetting)
        ).pipe(
          mergeMap((r) => {
              const actions = [];

              if (!r.ValidationResult.Pass && r.ValidationResult.FailureReason === 'Model Name Exists') {
                actions.push(new fromModelSettingsModalActions.ModelNameExistsFailure());
              } else {
                actions.push(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
                actions.push(new fromModelSettingsModalActions.CloseModal());
                actions.push(new fromSharedStructuresActions.SetMetadata(
                  PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(r.RangeGroup)));

                if (this.urlService.isInWorkflow(Workflow.NewRange)) {
                  this.router.navigate(['grade/' + r.RangeGroup.CompanyStructuresRangeGroupId]);
                  actions.push(new fromNotificationActions.AddNotification({
                    EnableHtml: true,
                    From: NotificationSource.GenericNotificationMessage,
                    Level: NotificationLevel.Success,
                    NotificationId: '',
                    Payload: { Title: 'Model Created', Message: `Created, ${r.RangeGroup.RangeGroupName}` },
                    Type: NotificationType.Event
                  }));
                } else {
                  // Load data
                  const modelPageViewId =
                    PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
                  actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

                  const modelSummaryPageViewId = PagesHelper.getModelSummaryPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
                  actions.push(new fromDataGridActions.LoadData(modelSummaryPageViewId));
                }

                actions.push(new fromModelSettingsModalActions.CreateGradeBasedModelSettingsSuccess());
                actions.push(new fromGradeBasedSharedActions.GetGradeRangeDetails(r.RangeGroup.CompanyStructuresRangeGroupId));
              }

              this.urlService.removeAllWorkflows();
              actions.push(new fromGradeBasedSharedActions.SetOpenAddJobs(true));
              return actions;
            }
          ),
          catchError(() => of(new fromModelSettingsModalActions.CreateGradeBasedModelSettingsError()))
        );
      })
    );

  @Effect()
  saveGradeBasedModelSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromModelSettingsModalActions.SaveGradeBasedModelSettings>(fromModelSettingsModalActions.SAVE_GRADE_BASED_MODEL_SETTINGS),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult, pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data) => {
        let advancedSetting;
        if (data.action.payload.formValue.RangeAdvancedSetting != null) {
          advancedSetting = PayfactorsApiModelMapper.mapAdvancedSettingModalFormToAdvancedSettingRequest(
            data.action.payload.formValue.RangeAdvancedSetting, data.action.payload.rounding);
        } else {
          advancedSetting = generateMockRangeAdvancedSetting();
        }

        return this.structureModelingApiService.saveGradeBasedModelSettings(
          PayfactorsApiModelMapper.mapSaveGradeBasedModelSettingsModalFormToSaveSettingsRequest(
            data.action.payload.rangeGroupId, data.action.payload.formValue, data.action.payload.rounding, advancedSetting)
        ).pipe(
          mergeMap((r) => {
              const actions = [];

              if (!r.ValidationResult.Pass && r.ValidationResult.FailureReason === 'Model Name Exists') {
                actions.push(new fromModelSettingsModalActions.ModelNameExistsFailure());
              } else {
                actions.push(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
                actions.push(new fromModelSettingsModalActions.CloseModal());
                actions.push(new fromSharedStructuresActions.SetMetadata(
                  PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(r.RangeGroup)
                ));

                // Load data
                const modelPageViewId =
                  PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
                actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

                const modelSummaryPageViewId = PagesHelper.getModelSummaryPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
                actions.push(new fromDataGridActions.LoadData(modelSummaryPageViewId));

                actions.push(new fromModelSettingsModalActions.SaveGradeBasedModelSettingsSuccess());
                actions.push(new fromGradeBasedSharedActions.GetGradeRangeDetails(r.RangeGroup.CompanyStructuresRangeGroupId));
              }

              return actions;
            }
          ),
          catchError(() => of(new fromModelSettingsModalActions.SaveGradeBasedModelSettingsError()))
        );
      })
    );

  @Effect()
  getGradesDetails: Observable<Action> = this.actions$
    .pipe(
      ofType(fromGradeBasedSharedActions.GET_GRADES_DETAILS),
      switchMap((action: fromGradeBasedSharedActions.GetGradesDetails) => {
        return this.structureModelingApiService.getGradesForStructureByRangeGroupId(action.payload)
          .pipe(
            map((res) => {
              return new fromGradeBasedSharedActions.GetGradesDetailsSuccess(res);
            }),
            catchError((err) => of(new fromGradeBasedSharedActions.GetGradesDetailsError(err)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedGradeBasedReducer.State>,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private structureModelingApiService: StructureModelingApiService,
    private router: Router,
    private urlService: UrlService
  ) { }
}
