import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { PricingMatchesRequest, PricingMatchesResponse, SearchResponse } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';

import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import {
  createPricingMatchesRequest,
  PayfactorsSurveySearchApiHelper,
  PayfactorsSurveySearchApiModelMapper
} from '../helpers';
import * as fromSurveySearchReducer from '../reducers';

@Injectable()
export class SurveySearchEffectsService {

  searchSurveyJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        this.store.select(fromSearchReducer.getSearchFilterMappingData),
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (action: fromSearchResultsActions.GetResults, filters, pagingOptions, searchContext, selectedDataCuts, searchFilterMappingDataObj, searchFeatureId) =>
          ({ action, filters, pagingOptions, searchContext, selectedDataCuts, searchFilterMappingDataObj, searchFeatureId })
      ),
      filter((data) => data.searchFeatureId === SearchFeatureIds.MultiMatch || data.searchFeatureId === SearchFeatureIds.AddSurveyData),
      switchMap(l => {
        const searchRequest = this.payfactorsSurveySearchApiHelper.buildSurveySearchRequest({
          Filters: l.filters,
          PagingOptions: l.pagingOptions,
          PricingMatchDataSearchContext: l.searchContext
        });

        return this.surveySearchApiService.searchSurveyJobs(searchRequest)
          .pipe(
            mergeMap((searchResponse: SearchResponse) => {
              const actions = [];

              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromSurveySearchResultsActions.AddJobResults(
                  PayfactorsSurveySearchApiModelMapper.mapSurveyJobsToJobResults(searchResponse.SurveyJobs, l.selectedDataCuts)
                ));
              } else {
                // Map filters and add currency code to base50th display name
                const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchResponse.SearchFilters, l.searchFilterMappingDataObj);
                const base50thFilter = filters.find(f => f.Id === 'base50th');
                base50thFilter.DisplayName += ` ${l.searchContext.CurrencyCode}`;

                actions.push(new fromSearchResultsActions.GetResultsSuccess({
                  totalRecordCount: searchResponse.Paging.TotalRecordCount
                }));
                actions.push(new fromSurveySearchResultsActions.ReplaceJobResults(
                  PayfactorsSurveySearchApiModelMapper.mapSurveyJobsToJobResults(searchResponse.SurveyJobs, l.selectedDataCuts)
                ));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: l.action.payload.keepFilteredOutOptions
                }));
                if (l.action.payload && l.action.payload.searchAggregation) {
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

  loadPricingMatches(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getResults),
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action, jobResults, filters, pagingOptions, projectSearchContext) => ({
          jobResults,
          filters,
          pagingOptions,
          projectSearchContext
        })),
      switchMap(({ jobResults, filters, pagingOptions, projectSearchContext }) => {
        const lastJobResultIndex = (pagingOptions.page - 1) * pagingOptions.pageSize;
        const selectedFilters = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(filters);
        const pricingMatchesRequest: PricingMatchesRequest = createPricingMatchesRequest(jobResults, lastJobResultIndex, projectSearchContext, selectedFilters);

        return this.surveySearchApiService.getPricingMatches(pricingMatchesRequest)
          .pipe(
            map((pricingMatchesResponse: PricingMatchesResponse) =>
              new fromSurveySearchResultsActions.UpdateResultsMatchesCount(pricingMatchesResponse))
          );
      })
    );
  }

  constructor(
    private store: Store<fromSurveySearchReducer.State>,
    private surveySearchApiService: SurveySearchApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private payfactorsSurveySearchApiHelper: PayfactorsSurveySearchApiHelper
  ) {
  }
}
