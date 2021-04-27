import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromJobsToGradeActions from 'libs/features/structures/add-jobs-to-range/actions/jobs-to-grade.actions';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions/pf-data-grid.actions';
import { PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { AutoGradeJobsRequestModel, JobSearchRequestStructuresRangeGroup } from 'libs/models/payfactors-api';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { PayfactorsApiModelMapper } from 'libs/features/structures/add-jobs-to-range/helpers';
import { StructureMappingApiService } from 'libs/data/payfactors-api/structures/structure-mapping-api.service';
import * as fromAddJobsSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';

import * as fromSharedStructuresReducer from '../reducers';
import * as fromSharedActions from '../actions/shared.actions';
import * as fromSharedModelSettingsActions from '../actions/model-settings-modal.actions';
import { UrlService } from '../services';
import { Workflow } from '../constants/workflow';
import { PagesHelper } from '../helpers/pages.helper';

@Injectable()
export class AddJobsModalEffects {
  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.SET_CONTEXT_STRUCTURES_RANGE_GROUP_ID),
      mergeMap(() =>
        [new fromUserFilterActions.Init()]
      ));

  @Effect()
  addJobs$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS),
      withLatestFrom(
        this.store.pipe(select(fromAddJobsReducer.getContextStructureRangeGroupId)),
        this.store.pipe(select(fromAddJobsReducer.getSelectedPaymarkets)),
        this.store.pipe(select(fromAddJobsReducer.getSelectedJobIds)),
        this.store.pipe(select(fromAddJobsReducer.getSelectedPayfactorsJobCodes)),
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        this.store.pipe(select(fromSharedStructuresReducer.getFormulaValid)),
        (action: fromAddJobsPageActions.AddSelectedJobs,
         contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, roundingSettings, gridConfig, gridData, pagingOptions,
         formulaValid) =>
          ({
            action, contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, roundingSettings, gridConfig, gridData,
            pagingOptions, formulaValid
          })),
      switchMap((data) => {
          const companyJobIds = data.selectedJobIds.map(j => Number(j));

          return this.structureModelingApiService.addJobsToRangeGroup({
            StructuresRangeGroupId: data.contextStructureRangeGroupId,
            JobIds: companyJobIds,
            PaymarketId: data.metadata.PaymarketId
          })
            .pipe(
              mergeMap(() => this.getAddJobsSuccessActions(data)),
              catchError(error => of(new fromAddJobsPageActions.AddJobsError(error.error.Message)))
            );
        }
      )
    );

  @Effect()
  addAllJobs$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_ALL_JOBS),
      withLatestFrom(
        this.store.pipe(select(fromSearchReducer.getParentFilters)),
        this.store.pipe(select(fromSearchReducer.getNumberOfResultsOnServer)),
        this.store.pipe(select(fromAddJobsReducer.getContextStructureRangeGroupId)),
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        this.store.pipe(select(fromSharedStructuresReducer.getFormulaValid)),
        (action: fromAddJobsPageActions.AddAllJobs, filters, numberResults, contextStructureRangeGroupId, metadata, roundingSettings, gridConfig, gridData,
         pagingOptions, formulaValid) =>
          ({ action, filters, numberResults, contextStructureRangeGroupId, metadata, roundingSettings, gridConfig, gridData, pagingOptions, formulaValid })
      ),
      switchMap((data) => {
          const searchRequest: JobSearchRequestStructuresRangeGroup = {
            SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
            Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
            FilterOptions: { ReturnFilters: true, AggregateCount: 5 },
            PagingOptions: { From: 0, Count: data.numberResults },
            StructureRangeGroupId: data.contextStructureRangeGroupId,
            PayMarketId: data.metadata.PaymarketId
          };
          return this.structureModelingApiService.addJobsFromSearchToRangeGroup(searchRequest)
            .pipe(
              mergeMap(() => this.getAddJobsSuccessActions(data)),
              catchError(error => of(new fromAddJobsPageActions.AddJobsError(error.error.Message)))
            );
        }
      )
    );

  @Effect({ dispatch: false })
  addJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_JOBS_SUCCESS),
      tap((action: fromAddJobsPageActions.AddJobsSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      }),
      map(() => new fromCompanySettingsActions.LoadCompanySettings())
    );

  @Effect()
  saveGradesWithJobs$ = this.actions$
    .pipe(
      ofType(fromJobsToGradeActions.SAVE_GRADE_JOB_MAPS),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        this.store.pipe(select(fromSharedStructuresReducer.getFormulaValid)),
        (action: fromJobsToGradeActions.SaveGradeJobMaps, metadata, gridConfig, gridData, pagingOptions) =>
          ({ action, metadata, gridConfig, gridData, pagingOptions })
      ),
      switchMap((data) => {
          return this.structureMappingApiService.saveStructureGradeMappings(
            PayfactorsApiModelMapper.mapGradesToSaveCompanyJobStructureMapsRequest(data.action.payload)).pipe(
            mergeMap(() => this.getSaveGradesWithJobsActions(data)),
            catchError(() => of(new fromJobsToGradeActions.SaveGradeJobMapsError()))
          );
        }
      )
    );

  @Effect()
  autoGradeJobs$ = this.actions$
    .pipe(
      ofType(fromJobsToGradeActions.AUTO_GRADE_JOBS),
      withLatestFrom(
        this.store.pipe(select(fromAddJobsReducer.getSelectedJobIds)),
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromAddJobsReducer.getJobs)),
        (action: fromJobsToGradeActions.AutoGradeJobs, selectedJobIds, metadata, jobs) =>
          ({ action, selectedJobIds, metadata, jobs })
      ),
      switchMap(data => {
        const companyJobIds = data.selectedJobIds.map(j => Number(j));
        const autoGradeJobsRequestModel: AutoGradeJobsRequestModel = {
          RangeGroupId: data.action.gradeRangeGroupDetails.RangeGroupId,
          CompanyJobIds: companyJobIds
        };

        return this.structureMappingApiService.autoGradeJobs(autoGradeJobsRequestModel)
          .pipe(
            mergeMap((r) => {
                const actions = [];
                actions.push(new fromJobsToGradeActions.AutoGradeJobsSuccess());
                actions.push(new fromAddJobsSearchResultsActions.ClearSelectedJobs());
                actions.push(new fromJobsToGradeActions.GetGrades(data.action.gradeRangeGroupDetails));

                // Show a warning if API returns any Ids
                if (r.length > 0) {
                  const jobs = [];
                  r.forEach((item: string) => {
                    const job = data.jobs.find(x => x.Id === String(item));
                    jobs.push(job.Title);
                  });

                  actions.push(new fromNotificationActions.AddNotification({
                    EnableHtml: true,
                    From: NotificationSource.GenericNotificationMessage,
                    Level: NotificationLevel.Error,
                    NotificationId: '',
                    Payload: {
                      Title: 'Error',
                      Message: `The following jobs exist in two or more grades in this structure and cannot be regraded automatically: ${jobs.join(', ')} `
                    },
                    Type: NotificationType.Event
                  }));
                }

                return actions;
              }
            ),
            catchError((err) => of(new fromJobsToGradeActions.AutoGradeJobsError()))
          );
      })
    );

  private getSaveGradesWithJobsActions(data: any): Action[] {
    const actions = [];
    actions.push(new fromJobsToGradeActions.SaveGradeJobMapsSuccess());
    actions.push(new fromSearchPageActions.CloseSearchPage());
    const modelPageViewId =
      PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
    actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));
    const summaryPageViewId = PagesHelper.getModelSummaryPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
    actions.push(new fromPfDataGridActions.LoadData(summaryPageViewId));
    return actions;
  }

  private getAddJobsSuccessActions(data: any): Action[] {
    const actions = [];

    actions.push(new fromAddJobsPageActions.AddJobsSuccess());
    actions.push(new fromSearchPageActions.CloseSearchPage());

    if (this.urlService.isInWorkflow(Workflow.NewRange)) {
      actions.push(new fromSharedModelSettingsActions.OpenModal());
    } else if (this.hasRequiredSettingsForRecalculation(data.metadata, data.formulaValid)) {
      actions.push(new fromSharedActions.RecalculateRangesWithoutMid({
        rangeGroupId: data.contextStructureRangeGroupId,
        rounding: data.roundingSettings
      }));
    } else {
      const modelPageViewId =
        PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
      actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));
    }

    return actions;
  }

  private hasRequiredSettingsForRecalculation(metaData: RangeGroupMetadata, formulaValid: boolean) {
    return !!((metaData.ControlPoint || formulaValid) && metaData.Currency && metaData.Rate &&
      (metaData.SpreadMin || metaData.RangeDistributionSetting.Min_Percentile || metaData.RangeDistributionSetting.Min_Formula) &&
      (metaData.SpreadMax || metaData.RangeDistributionSetting.Max_Percentile || metaData.RangeDistributionSetting.Max_Formula));
  }

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private structureModelingApiService: StructureModelingApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private structureMappingApiService: StructureMappingApiService,
    private urlService: UrlService,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
