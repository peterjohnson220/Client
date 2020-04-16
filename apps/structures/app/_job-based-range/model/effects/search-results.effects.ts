import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, mergeMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';
import { JobBasedRangeJobSearchResponse, JobSearchRequestStructuresRangeGroup } from 'libs/models/payfactors-api/job-search';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { PayfactorsAddJobsApiModelMapper } from 'libs/features/add-jobs/helpers';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromAddJobsSearchResultsActions from 'libs/features/add-jobs/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';

import * as fromSharedReducer from '../../shared/reducers';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  getResults$ = this.searchJobs(this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS)));

  @Effect()
  getMoreResults$ = this.searchJobs(this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS)));

  searchJobs(action$: Actions): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        this.store.select(fromSharedReducer.getMetadata),
        (action: fromSearchResultsActions.GetResults, filters, pagingOptions, contextStructureRangeGroupId, metadata) =>
          ({ action, filters, pagingOptions, contextStructureRangeGroupId, metadata })
      ),
      switchMap(data => {
        const searchRequest: JobSearchRequestStructuresRangeGroup = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          FilterOptions: { ReturnFilters: true, AggregateCount: 5 },
          PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.pagingOptions),
          StructureRangeGroupId: data.contextStructureRangeGroupId,
          PayMarketId: data.metadata.PaymarketId
        };

        return this.jobSearchApiService.getModelBasedJobResults(searchRequest)
          .pipe(
            mergeMap((searchResponse: JobBasedRangeJobSearchResponse) => {
              const actions = [];
              const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchResponse.SearchFilters);
              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromAddJobsSearchResultsActions.AddJobResults(
                  PayfactorsAddJobsApiModelMapper.mapJobBasedRangeJobSearchResultsToJobResults(searchResponse.JobResults)
                ));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess({
                  totalRecordCount: searchResponse.Paging.TotalRecordCount
                }));
                actions.push(new fromAddJobsSearchResultsActions.ReplaceJobResults(
                  PayfactorsAddJobsApiModelMapper.mapJobBasedRangeJobSearchResultsToJobResults(searchResponse.JobResults)
                ));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: data.action.payload.keepFilteredOutOptions
                }));
                if (data.action.payload && data.action.payload.searchAggregation) {
                  // TODO: Should this be load more?
                  const scrollPayload = {
                    scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER
                  };
                  actions.push(new fromInfiniteScrollActions.Load(scrollPayload));
                }
              }

              return actions;
            }),
            catchError(() => of(new fromSearchResultsActions.GetResultsError()))
          );
      })
    );
  }

  constructor(
    private store: Store<fromAddJobsReducer.State>,
    private jobSearchApiService: JobSearchApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private actions$: Actions
  ) {}
}
