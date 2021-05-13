import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { generateMockRangeAdvancedSetting, JobBasedPageViewIds, RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import * as fromDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

import * as fromSharedJobBasedRangeActions from '../actions/shared.actions';
import * as fromSharedJobBasedReducer from '../reducers';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';
import { PayfactorsApiModelMapper } from '../../../shared/helpers/payfactors-api-model-mapper';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import { UrlService } from '../../../shared/services';

@Injectable()
export class SharedEffects {

  @Effect()
  recalculateRangesWithoutMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.RECALCULATE_RANGES_WITHOUT_MID),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedStructuresActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
         pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data) => {
          return this.structureModelingApiService.recalculateRangesWithoutMid(data.action.payload)
            .pipe(
              mergeMap(() => {
                const actions = [];
                const modelPageViewId =
                  PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

                actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

                actions.push(new fromSharedStructuresActions.GetOverriddenRanges({
                  pageViewId: modelPageViewId,
                  rangeGroupId: data.action.payload
                }));

                return actions;
              }),
            );
        }
      ));

  @Effect()
  removeRange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedJobBasedRangeActions.REMOVING_RANGE),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedStructuresActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
         pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data: any) => {
        return this.structureModelingApiService.removeRange(data.action.payload).pipe(
          mergeMap(() => {
            const actions = [];
            const modelPageViewId =
              PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

            actions.push(new fromSharedJobBasedRangeActions.RemovingRangeSuccess());
            actions.push(new pfDataGridActions.ClearSelections(modelPageViewId, [data.action.payload]));
            actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

            return actions;
          }),
          catchError(error => of(new fromSharedJobBasedRangeActions.RemovingRangeError(error)))
        );
      })
    );

  @Effect()
  structureHasSettings: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedJobBasedRangeActions.GET_STRUCTURE_HAS_SETTINGS),
      switchMap((action: fromSharedJobBasedRangeActions.GetStructureHasSettings) => {
        return this.structureModelingApiService.getStructureHasSettings(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedJobBasedRangeActions.GetStructureHasSettingsSuccess(res);
            }),
            catchError((err) => of(new fromSharedJobBasedRangeActions.GetStructureHasSettingsError(err)))
          );
      })
    );

  @Effect()
  saveJobBasedModelSettings$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromModelSettingsModalActions.SaveJobBasedModelSettings>(fromModelSettingsModalActions.SAVE_JOB_BASED_MODEL_SETTINGS),
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

        return this.structureModelingApiService.saveJobBasedModelSettings(
          PayfactorsApiModelMapper.mapJobBasedModelSettingsModalFormToSaveSettingsRequest(data.action.payload.rangeGroupId, data.action.payload.formValue,
            data.action.payload.rounding, advancedSetting, data.action.payload.formValue.RangeDistributionSetting)
        ).pipe(
          mergeMap((r) => {
              const actions = [];
              const modelPageViewId =
                PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

              // TODO: Move this out into a helper class, too much complexity for here [BC]
              if (!r.ValidationResult.Pass && r.ValidationResult.FailureReason === 'Model Name Exists') {
                actions.push(new fromModelSettingsModalActions.ModelNameExistsFailure());
              } else {
                actions.push(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
                actions.push(new fromModelSettingsModalActions.CloseModal());

                if (data.metadata.IsCurrent) {
                  this.router.navigate(['job/' + r.RangeGroup.CompanyStructuresRangeGroupId]);

                  actions.push(new fromNotificationActions.AddNotification({
                    EnableHtml: true,
                    From: NotificationSource.GenericNotificationMessage,
                    Level: NotificationLevel.Success,
                    NotificationId: '',
                    Payload: { Title: 'Model Created', Message: `Created, ${r.RangeGroup.RangeGroupName}` },
                    Type: NotificationType.Event
                  }));

                } else {
                  actions.push(new fromSharedStructuresActions.SetMetadata(
                    PayfactorsApiModelMapper.mapStructuresRangeGroupResponseToRangeGroupMetadata(r.RangeGroup)
                  ));

                  // Load data
                  actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));
                  if (this.isLoadDataRequired(data.action.payload.fromPageViewId)) {
                    actions.push(new fromDataGridActions.LoadData(data.action.payload.fromPageViewId));
                  }
                }

                actions.push(new fromSharedStructuresActions.GetOverriddenRanges(
                  {
                    pageViewId: modelPageViewId,
                    rangeGroupId: r.RangeGroup.CompanyStructuresRangeGroupId
                  }));

                actions.push(new fromSharedStructuresActions.GetCurrentRangeGroup({
                  RangeGroupId: r.RangeGroup.CompanyStructuresRangeGroupId,
                  PaymarketId: r.RangeGroup.CompanyPayMarketId,
                  PayType: r.RangeGroup.PayType
                }));

                actions.push(new fromModelSettingsModalActions.SaveJobBasedModelSettingsSuccess());
              }

              this.urlService.removeAllWorkflows();

              return actions;
            }
          ),
          catchError(() => of(new fromModelSettingsModalActions.SaveJobBasedModelSettingsError()))
        );
      })
    );

  // We want to remove filterQuery param otherwise Saved filter won't be applied
  @Effect({ dispatch: false })
  handleSavedViewClicked$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.HANDLE_SAVED_VIEW_CLICKED),
      tap((action: fromPfDataGridActions.HandleSavedViewClicked) => {
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: { },
            queryParamsHandling: ''
          });
      })
    );

  private isLoadDataRequired(fromPageViewId: string) {
    return fromPageViewId === JobBasedPageViewIds.EmployeesMinMidMax
      || fromPageViewId === JobBasedPageViewIds.EmployeesTertile
      || fromPageViewId === JobBasedPageViewIds.EmployeesQuartile
      || fromPageViewId === JobBasedPageViewIds.EmployeesQuintile
      || fromPageViewId === JobBasedPageViewIds.Pricings;
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedJobBasedReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private router: Router,
    private urlService: UrlService,
    private route: ActivatedRoute
  ) { }
}
