import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom, map } from 'rxjs/operators';

import { SearchResponse, PricingMatchesRequest, PricingMatchesResponse, SearchRequest } from 'libs/models/survey-search';
import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import {
  mapFiltersToSearchFilters, mapResultsPagingOptionsToPagingOptions, mapFiltersToSearchFields,
  createPricingMatchesRequest, mapSearchFiltersToMultiSelectFilters
} from '../helpers';
import * as fromAddDataReducer from '../reducers';

@Injectable()
export class AddDataEffectsService {

  private static buildSearchRequestObject(filtersPagingAndJobContext: any): SearchRequest {
    const searchFieldsRequestObj = mapFiltersToSearchFields(filtersPagingAndJobContext.filters);
    const filtersRequestObj = mapFiltersToSearchFilters(filtersPagingAndJobContext.filters);
    const pagingOptionsRequestObj = mapResultsPagingOptionsToPagingOptions(filtersPagingAndJobContext.pagingOptions);
    const filterOptionsRequestObj = { ReturnFilters: pagingOptionsRequestObj.From === 0, AggregateCount: 5 };

    return {
      SearchFields: searchFieldsRequestObj,
      Filters: filtersRequestObj,
      FilterOptions: filterOptionsRequestObj,
      PagingOptions: pagingOptionsRequestObj,
      CurrencyCode: filtersPagingAndJobContext.jobContext.CurrencyCode,
      CountryCode: filtersPagingAndJobContext.jobContext.CountryCode
    };
  }

  searchSurveyJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromAddDataReducer.getFilters),
        this.store.select(fromAddDataReducer.getResultsPagingOptions),
        this.store.select(fromAddDataReducer.getJobContext),
        (action: fromSearchResultsActions.GetResults, filters, pagingOptions, jobContext) =>
          ({ action, filters, pagingOptions, jobContext })
      ),

      switchMap(l => {
        const searchRequest = AddDataEffectsService.buildSearchRequestObject(l);

        return this.surveySearchApiService.searchSurveyJobs(searchRequest)
          .pipe(
            mergeMap((searchResponse: SearchResponse) => {
              const actions = [];

              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess(searchResponse));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess(searchResponse));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  searchFilters: mapSearchFiltersToMultiSelectFilters(searchResponse.SearchFilters),
                  keepFilteredOutOptions: l.action.payload.keepFilteredOutOptions
                }));
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
        this.store.select(fromAddDataReducer.getResults),
        this.store.select(fromAddDataReducer.getResultsPagingOptions),
        (action, jobResults, pagingOptions) => ({ jobResults, pagingOptions })),
      switchMap(({ jobResults, pagingOptions }) => {
        const lastJobResultIndex = (pagingOptions.page - 1) * pagingOptions.pageSize;
        const pricingMatchesRequest: PricingMatchesRequest = createPricingMatchesRequest(jobResults, lastJobResultIndex);
        return this.surveySearchApiService.getPricingMatches(pricingMatchesRequest)
          .pipe(
            map((pricingMatchesResponse: PricingMatchesResponse) =>
              new fromSearchResultsActions.UpdateResultsMatchesCount(pricingMatchesResponse))
          );
      })
    );
  }

  constructor(
    private store: Store<fromAddDataReducer.State>,
    private surveySearchApiService: SurveySearchApiService
  ) {
  }
}
