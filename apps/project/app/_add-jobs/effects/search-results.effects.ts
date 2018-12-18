import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { Actions, Effect } from '@ngrx/effects';
import { switchMap, withLatestFrom, mergeMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';
import { JobSearchRequest, JobSearchResponse } from 'libs/models/payfactors-api/job-search';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';

import * as fromAddJobsReducer from '../reducers';
import * as fromAddJobsSearchResultsActions from '../actions/search-results.actions';
import { PayfactorsAddJobsApiModelMapper } from '../helpers';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  getResults$ = this.searchJobs(this.actions$.ofType(fromSearchResultsActions.GET_RESULTS));

  @Effect()
  getMoreResults$ = this.searchJobs(this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS));

  searchJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromAddJobsReducer.getContext),
        (action: fromSearchResultsActions.GetResults, filters, pagingOptions, context) =>
          ({ action, filters, pagingOptions, context })
      ),
      switchMap(data => {
        const searchRequest: JobSearchRequest = {
          SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
          Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
          FilterOptions: { ReturnFilters: true, AggregateCount: 5 },
          PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.pagingOptions),
          CountryCode: null,
          ProjectId: data.context.ProjectId,
          PayMarketId: data.context.PayMarketId
        };

        return this.jobSearchApiService.getJobResults(searchRequest)
          .pipe(
            mergeMap((searchResponse: JobSearchResponse) => {
              const actions = [];
              const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchResponse.SearchFilters);

              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromAddJobsSearchResultsActions.AddJobResults(
                  PayfactorsAddJobsApiModelMapper.mapJobSearchResultsToJobResults(searchResponse.JobResults)
                ));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess({
                  totalRecordCount: searchResponse.Paging.TotalRecordCount
                }));
                actions.push(new fromAddJobsSearchResultsActions.ReplaceJobResults(
                  PayfactorsAddJobsApiModelMapper.mapJobSearchResultsToJobResults(searchResponse.JobResults)
                ));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: data.action.payload.keepFilteredOutOptions
                }));
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
