import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, withLatestFrom, mergeMap, catchError, map, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';
import {
  JobBasedRangeJobSearchResponse,
  JobSearchRequestStructuresRangeGroup,
  JobSearchPricingDataResponse,
  JobSearchContext,
  StructuresJobSearchPricingDataRequest
} from 'libs/models/payfactors-api/job-search';
import { StructureMappingApiService } from 'libs/data/payfactors-api';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { PayfactorsAddJobsApiModelMapper } from 'libs/features/jobs/add-jobs/helpers';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromAddJobsSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';
import * as fromInfiniteScrollActions from 'libs/features/search/infinite-scroll/actions/infinite-scroll.actions';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';

import * as fromSharedStructuresReducer from '../reducers';


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
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        this.store.select(fromSharedStructuresReducer.getMetadata),
        (action: fromAddJobsSearchResultsActions.GetJobPricingData, contextStructureRangeGroupId, metadata) => (
          { action, contextStructureRangeGroupId, metadata }
        )),
      mergeMap((data) => {
        let jobCode = null;
        let companyJobId = null;
        const jobResult = data.action.payload.job;

        if (jobResult.IsPayfactorsJob) {
          jobCode = jobResult.Code;
        } else {
          companyJobId = jobResult.Id;
        }
        if (!data.action.payload.loadSingleMrp) {
          const jobPriceRequest: StructuresJobSearchPricingDataRequest = {
              CompanyJobId: companyJobId,
              PayfactorsJobCode: jobCode,
              StructureRangeGroupId: data.contextStructureRangeGroupId,
              Type: JobSearchContext.StructuresJobSearch
            };

          // We want to display Annual Rate when model doesn't exist
          if (data.metadata.Rate == null) {
            jobPriceRequest.Rate = 'Annual';
          }

          return this.jobSearchApiService.getStructureJobPricingData(jobPriceRequest)
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
        } else {
          return this.structureMappingApiService.getFormattedJobMrpByPayType({
            CompanyJobId: companyJobId,
            CompanyStructuresRangeGroupId: data.contextStructureRangeGroupId
          })
            .pipe(
              map((pricingDataResponse: string) =>
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
      }
      ));

  searchJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        this.store.select(fromSharedStructuresReducer.getMetadata),
        this.store.select(fromSearchReducer.getSearchFilterMappingData),
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (action: fromSearchResultsActions.GetResults,
         filters, pagingOptions, contextStructureRangeGroupId, metadata, searchFilterMappingDataObj, searchFeatureId) =>
          ({ action, filters, pagingOptions, contextStructureRangeGroupId, metadata, searchFilterMappingDataObj, searchFeatureId })
      ),
      filter((data) => data.searchFeatureId === SearchFeatureIds.AddJobs),
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
              const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchResponse.SearchFilters, data.searchFilterMappingDataObj);
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
    private structureMappingApiService: StructureMappingApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private actions$: Actions
  ) {}
}
