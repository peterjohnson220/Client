import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom, map } from 'rxjs/operators';

import { SearchResponse, PricingMatchesRequest, PricingMatchesResponse } from 'libs/models/survey-search';
import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSavedFiltersActions from '../actions/saved-filters.actions';
import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import * as fromSearchReducer from '../reducers';
import * as fromSharedSearchReducer from '../../shared/reducers';
import { PayfactorsApiHelper, PayfactorsApiModelMapper, createPricingMatchesRequest } from '../helpers';

@Injectable()
export class SurveySearchEffectsService {

  searchSurveyJobs(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromSearchReducer.getFilters),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
        this.store.select(fromSearchReducer.getProjectSearchContext),
        this.store.select(fromSharedSearchReducer.getSearchingFilter),
        (action: fromSearchResultsActions.GetResults, filters, pagingOptions, projectSearchContext, searchingFilter) =>
          ({ action, filters, pagingOptions, projectSearchContext, searchingFilter })
      ),

      switchMap(l => {
        const searchRequest = PayfactorsApiHelper.buildSurveySearchRequest({
          Filters: l.filters,
          ProjectSearchContext: l.projectSearchContext,
          PagingOptions: l.pagingOptions
        });

        return this.surveySearchApiService.searchSurveyJobs(searchRequest)
          .pipe(
            mergeMap((searchResponse: SearchResponse) => {
              const actions = [];

              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess(searchResponse));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess(searchResponse));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  searchFilters: PayfactorsApiModelMapper.mapSearchFiltersToFilters(searchResponse.SearchFilters),
                  keepFilteredOutOptions: l.action.payload.keepFilteredOutOptions
                }));
                if (l.searchingFilter) {
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

  loadPricingMatches(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getResults),
        this.store.select(fromSearchReducer.getResultsPagingOptions),
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

  handleFilterRemoval(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchingFilter),
        this.store.select(fromSearchReducer.getSingledFilter),
        (action: any, searchingFilter, singledFilter) => ({ action, searchingFilter, singledFilter })
      ),
      mergeMap(data => {
        const actions = [];

        if (data.searchingFilter && data.singledFilter.Id !== data.action.payload.filterId) {
          actions.push(new fromSingledFilterActions.SearchAggregation());
        }

        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }));
        actions.push(new fromSavedFiltersActions.UnselectSavedFilter());

        return actions;
      })
    );
  }

  constructor(
    private store: Store<fromSearchReducer.State>,
    private surveySearchApiService: SurveySearchApiService
  ) {
  }
}
