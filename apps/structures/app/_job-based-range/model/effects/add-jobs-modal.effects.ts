import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';

import { WindowCommunicationService } from 'libs/core/services';
import * as pfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { JobSearchRequestStructuresRangeGroup } from 'libs/models/payfactors-api';

import * as fromSharedReducer from '../../shared/reducers';
import * as fromSharedActions from '../../shared/actions/shared.actions';
import * as fromSharedModelSettingsActions from '../../shared/actions/model-settings-modal.actions';
import { UrlService } from '../../shared/services';
import { Workflow } from '../../shared/constants/workflow';
import { RangeGroupMetadata } from '../../shared/models';
import { PagesHelper } from '../../shared/helpers/pages.helper';

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
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        this.store.select(fromAddJobsReducer.getSelectedPaymarkets),
        this.store.select(fromAddJobsReducer.getSelectedJobIds),
        this.store.select(fromAddJobsReducer.getSelectedPayfactorsJobCodes),
        this.store.select(fromSharedReducer.getMetadata),
        this.store.select(fromSharedReducer.getRoundingSettings),
        (action: fromAddJobsPageActions.AddSelectedJobs,
         contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, roundingSettings) =>
          ({action, contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, roundingSettings})),
      switchMap((contextData) => {
          const companyJobIds = contextData.selectedJobIds.map(j => Number(j));

          return this.structureModelingApiService.addJobsToRangeGroup({
            StructuresRangeGroupId: contextData.contextStructureRangeGroupId,
            JobIds: companyJobIds,
            PaymarketId: contextData.metadata.PaymarketId
          })
            .pipe(
              mergeMap(() => this.getAddJobsSuccessActions(contextData)),
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
          this.store.select(fromSearchReducer.getParentFilters),
          this.store.select(fromSearchReducer.getNumberOfResultsOnServer),
          this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
          this.store.select(fromSharedReducer.getMetadata),
          this.store.select(fromSharedReducer.getRoundingSettings),
          (action: fromAddJobsPageActions.AddAllJobs, filters, numberResults, contextStructureRangeGroupId, metadata, roundingSettings) =>
            ({ action, filters, numberResults, contextStructureRangeGroupId, metadata, roundingSettings })
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

  @Effect({dispatch: false})
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
    } else if (this.hasRequiredSettingsForRecalculation(data.metadata)) {
      actions.push(new fromSharedActions.RecalculateRangesWithoutMid({
        rangeGroupId: data.contextStructureRangeGroupId,
        rounding: data.roundingSettings
      }));
    } else {
      const modelPageViewId = PagesHelper.getModelPageViewIdByRangeDistributionType(data.metadata.RangeDistributionTypeId);
      actions.push(new pfDataGridActions.LoadData(modelPageViewId));
    }

    return actions;
  }

  private hasRequiredSettingsForRecalculation(metaData: RangeGroupMetadata) {
    return !!(metaData.ControlPoint && metaData.Currency && metaData.Rate &&
      (metaData.SpreadMin || metaData.RangeDistributionSetting.MinPercentile) && (metaData.SpreadMax || metaData.RangeDistributionSetting.MaxPercentile));
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
