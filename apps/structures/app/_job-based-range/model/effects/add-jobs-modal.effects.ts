import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import { PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { JobSearchRequestStructuresRangeGroup } from 'libs/models/payfactors-api';
import { GridDataHelper } from 'libs/features/pf-data-grid/helpers';

import * as fromSharedReducer from '../../shared/reducers';
import * as fromSharedActions from '../../shared/actions/shared.actions';
import * as fromSharedModelSettingsActions from '../../shared/actions/model-settings-modal.actions';
import { UrlService } from '../../shared/services';
import { Workflow } from '../../shared/constants/workflow';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import * as fromJobBasedRangeReducer from '../../shared/reducers';

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
        this.store.pipe(select(fromSharedReducer.getMetadata)),
        this.store.pipe(select(fromSharedReducer.getRoundingSettings)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        this.store.pipe(select(fromJobBasedRangeReducer.getFormulaValid)),
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
        this.store.pipe(select(fromSharedReducer.getMetadata)),
        this.store.pipe(select(fromSharedReducer.getRoundingSettings)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        this.store.pipe(select(fromJobBasedRangeReducer.getFormulaValid)),
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

  private getAddJobsSuccessActions(data: any): Action[] {
    const actions = [];

    actions.push(new fromAddJobsPageActions.AddJobsSuccess());
    actions.push(new fromSearchPageActions.CloseSearchPage());

    if (this.urlService.isInWorkflow(Workflow.NewJobBasedRange)) {
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
      (metaData.SpreadMin || metaData.RangeDistributionSetting.Min_Percentile) && (metaData.SpreadMax || metaData.RangeDistributionSetting.Max_Percentile));
  }

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private structureModelingApiService: StructureModelingApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private urlService: UrlService,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
