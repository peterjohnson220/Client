import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, filter, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromInfiniteScrollActions from 'libs/features/search/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { ExchangeJobSearchApiService } from 'libs/data/payfactors-api/search/peer/exchange-job-search-api.service';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { MDJobExchangeJobSearchResponse } from 'libs/models/payfactors-api/exchange-job-search';

import * as fromExchangeJobSearchActions from '../actions/exchange-job-search.actions';
import * as fromExchangeJobSearchReducer from '../reducers';

@Injectable()
export class ExchangeJobSearchResultsEffects {

  @Effect()
  getResults$ = this.searchExchangeJobs(this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS)));

  @Effect()
  getMoreResults$ = this.searchExchangeJobs(this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS)));

  searchExchangeJobs(action$: Actions): Observable<Action> {
    return action$
      .pipe(
        withLatestFrom(
          this.store.select(fromSearchReducer.getResultsPagingOptions),
          this.store.select(fromSearchReducer.getParentFilters),
          this.store.select(fromSearchReducer.getSearchFilterMappingData),
          this.store.select(fromSearchReducer.getSearchFeatureId),
          this.store.select(fromExchangeJobSearchReducer.getExchangeId),
          (action: fromSearchResultsActions.GetResults, pagingOptions, filters, searchFilterMappingDataObj, searchFeatureId, exchangeId) =>
            ({action, pagingOptions, filters, searchFilterMappingDataObj, searchFeatureId, exchangeId})
        ),
        filter((data) => data.searchFeatureId === SearchFeatureIds.PeerExchangeJob),
        switchMap((data) => {
          const searchRequest = {
            ExchangeId: data.exchangeId,
            FilterOptions: {
              ReturnFilters: true,
              AggregateCount: 10
            },
            Filters: this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters),
            SearchFields: this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters),
            PagingOptions: this.payfactorsSearchApiModelMapper.mapResultsPagingOptionsToPagingOptions(data.pagingOptions)
          };

          return this.exchangeJobSearchApiService.getMDJobExchangeJobSearchResults(searchRequest).pipe(
            mergeMap((response: MDJobExchangeJobSearchResponse) => {
              const actions = [];
              const searchFilters = this.payfactorsSearchApiHelper.sliceSearchFiltersOptions(response.SearchFilters, searchRequest.Filters, 5);
              const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(searchFilters, data.searchFilterMappingDataObj);

              const exchangeJobResults = !!response?.ExchangeJobResults?.length ? response.ExchangeJobResults.map(ejr => ({...ejr, ExchangeJobId: ejr.JobId})) : [];
              if (searchRequest.PagingOptions.From > 0) {
                actions.push(new fromSearchResultsActions.GetMoreResultsSuccess());
                actions.push(new fromExchangeJobSearchActions.AddExchangeJobResults({
                  exchangeJobResults: exchangeJobResults, noResultsMessage: response.NoResultsMessage
                }));
              } else {
                actions.push(new fromSearchResultsActions.GetResultsSuccess({totalRecordCount: response.Paging.TotalRecordCount}));

                actions.push(new fromExchangeJobSearchActions.ReplaceExchangeJobResults({
                  exchangeJobResults: exchangeJobResults, noResultsMessage: response.NoResultsMessage
                }));
                actions.push(new fromSearchFiltersActions.RefreshFilters({
                  filters: filters,
                  keepFilteredOutOptions: data.action.payload.keepFilteredOutOptions
                }));
                if (data.action.payload && data.action.payload.searchAggregation) {
                  actions.push(new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER}));
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
    private store: Store<fromSearchReducer.State>,
    private exchangeJobSearchApiService: ExchangeJobSearchApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private actions$: Actions
  ) {}
}
