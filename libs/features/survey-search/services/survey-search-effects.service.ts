import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom, map } from 'rxjs/operators';

import { SearchResponse, PricingMatchesRequest, PricingMatchesResponse } from 'libs/models/payfactors-api';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import { PayfactorsSurveySearchApiHelper, createPricingMatchesRequest, PayfactorsSurveySearchApiModelMapper } from '../helpers';
import * as fromSurveySearchReducer from '../reducers';

@Injectable()
export class SurveySearchEffectsService {

  searchSurveyJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromSearchResultsActions.GetResults, filters, pagingOptions, projectSearchContext, selectedDataCuts) =>
          ({ action, filters, pagingOptions, projectSearchContext, selectedDataCuts })
      ),

      switchMap(l => {
        const searchRequest = this.payfactorsSurveySearchApiHelper.buildSurveySearchRequest({
          Filters: l.filters,
          ProjectSearchContext: l.projectSearchContext,
          PagingOptions: l.pagingOptions
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
                const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchResponse.SearchFilters);
                const base50thFilter = filters.find(f => f.Id === 'base50th');
                base50thFilter.DisplayName += ` (${l.projectSearchContext.CurrencyCode})`;

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
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        (action, jobResults, pagingOptions) => ({ jobResults, pagingOptions })),
      switchMap(({ jobResults, pagingOptions }) => {
        const lastJobResultIndex = (pagingOptions.page - 1) * pagingOptions.pageSize;
        const pricingMatchesRequest: PricingMatchesRequest = createPricingMatchesRequest(jobResults, lastJobResultIndex);

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
    private payfactorsSurveySearchApiHelper: PayfactorsSurveySearchApiHelper
  ) {
  }
}
