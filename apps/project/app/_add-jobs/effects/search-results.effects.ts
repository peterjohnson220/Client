import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, mergeMap, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';
import { JobSearchPricingDataResponse, JobSearchRequest, JobSearchResponse } from 'libs/models/payfactors-api/job-search';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';

import * as fromAddJobsReducer from '../reducers';
import * as fromAddJobsSearchResultsActions from '../actions/search-results.actions';
import { PayfactorsAddJobsApiModelMapper } from '../helpers';


@Injectable()
export class SearchResultsEffects {

  @Effect()
  getResults$ = this.searchJobs(this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS)));

  @Effect()
  getMoreResults$ = this.searchJobs(this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS)));

  @Effect()
  loadPricingData$ = this.actions$
    .pipe(
      ofType(fromAddJobsSearchResultsActions.LOAD_JOB_PRICING_DATA),
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getContext),
        (action: fromAddJobsSearchResultsActions.GetJobPricingData, context) => (
          { action, context }
        )),
      mergeMap((data) => {
        let jobCode = null;
        let companyJobId = null;
        const jobResult = data.action.payload;

        if (jobResult.IsPayfactorsJob) {
          jobCode = jobResult.Code;
        } else {
          companyJobId = jobResult.Id;
        }
        return this.jobSearchApiService.getJobPricingData({
          ProjectId: data.context.ProjectId,
          CompanyJobId: companyJobId,
          PayfactorsJobCode: jobCode
        })
          .pipe(
            map((pricingDataResponse: JobSearchPricingDataResponse) =>
              new fromAddJobsSearchResultsActions.GetJobPricingDataSuccess(
                {
                  jobId: jobResult.Id,
                  data: pricingDataResponse
                }
              )
            ),
            catchError(() => of(new fromAddJobsSearchResultsActions.GetJobPricingDataError(jobResult.Id)))
          );
      }
      ));

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
                if (data.action.payload && data.action.payload.searchAggregation) {
                  actions.push(new fromSingledFilterActions.SearchAggregation());
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
