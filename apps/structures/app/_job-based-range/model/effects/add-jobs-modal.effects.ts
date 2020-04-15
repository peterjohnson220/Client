import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WindowCommunicationService } from 'libs/core/services';
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
        this.store.select(fromSharedReducer.getIsNewModelAddJobs),
        // tslint:disable-next-line:max-line-length
        (action: fromAddJobsPageActions.AddSelectedJobs, contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, isNewModelAddJobs) =>
          ({action, contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, isNewModelAddJobs})
      ),
      switchMap((contextData) => {
          const companyJobIds = contextData.selectedJobIds.map(j => Number(j));
        // tslint:disable-next-line:max-line-length
          return this.structureModelingApiService.addJobsToRangeGroup({ StructuresRangeGroupId: contextData.contextStructureRangeGroupId, JobIds: companyJobIds, PaymarketId: contextData.metadata.PaymarketId })
            .pipe(
              mergeMap(() => contextData.isNewModelAddJobs ? [
                  new fromAddJobsPageActions.AddJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage(),
                  new fromSharedActions.SetIsNewModelModelSettings(true),
                  new fromSharedModelSettingsActions.OpenModal(),
                ] : [
                  new fromAddJobsPageActions.AddJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage(),
                  new fromSharedActions.RecalculateRangesWithoutMid({rangeGroupId: contextData.contextStructureRangeGroupId}),
                ]
              ),
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
          this.store.select(fromSharedReducer.getIsNewModelAddJobs),
          (action: fromAddJobsPageActions.AddAllJobs, filters, numberResults, contextStructureRangeGroupId, metadata, isNewModelAddJobs) =>
            ({ action, filters, numberResults, contextStructureRangeGroupId, metadata, isNewModelAddJobs })
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
              mergeMap(() => data.isNewModelAddJobs ? [
                  new fromAddJobsPageActions.AddJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage(),
                  new fromSharedActions.SetIsNewModelModelSettings(true),
                  new fromSharedModelSettingsActions.OpenModal(),
                ] : [
                  new fromAddJobsPageActions.AddJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage(),
                  new fromSharedActions.RecalculateRangesWithoutMid({rangeGroupId: data.contextStructureRangeGroupId}),
                ]
              ),
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

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private structureModelingApiService: StructureModelingApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
