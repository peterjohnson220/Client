import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { ExchangeDataSearchResponse } from 'libs/models/payfactors-api/peer/exchange-data-search/response';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { ExchangeMapResponse } from 'libs/models/peer';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { ExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { OperatorEnum } from 'libs/constants';

import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeExplorerReducer from '../reducers';

import * as fromSearchResultsActions from '../../../search/actions/search-results.actions';
import * as fromSearchFiltersActions from '../../../search/actions/search-filters.actions';
import * as fromSingledFilterActions from '../../../search/actions/singled-filter.actions';
import * as fromMapActions from '../actions/map.actions';
import { ExchangeExplorerContextService } from '../services';

@Injectable()
export class ExchangeSearchEffects {

  @Effect()
  getResults$ = this.searchExchangeData(fromSearchResultsActions.GET_RESULTS);

  @Effect()
  getExchangeDataSearchResults$ = this.searchExchangeData(fromExchangeSearchResultsActions.GET_EXCHANGE_DATA_RESULTS);

  @Effect()
  getExchangeDataSearchResultsSuccess$ = this.actions$.pipe(
    ofType(fromExchangeSearchResultsActions.GET_EXCHANGE_DATA_RESULTS_SUCCESS),
    withLatestFrom(
      this.store.pipe(select(fromSearchReducer.getSearchingFilter)),
      this.store.pipe(select(fromSearchReducer.getSingledFilter)),
      this.store.pipe(select(fromExchangeExplorerReducer.getSearchFilterMappingDataObj)),
      (
        action: fromExchangeSearchResultsActions.GetExchangeDataResultsSuccess,
        searchingFilter,
        singledFilter,
        searchFilterMappingDataObj
      ) => ({payload: action.payload, searchingFilter, singledFilter, searchFilterMappingDataObj})
    ),
    mergeMap((searchResponseContext) => {

      const searchResponse: ExchangeDataSearchResponse = searchResponseContext.payload.response;
      const actions: Action[] = [
        new fromSearchResultsActions.GetResultsSuccess({
          totalRecordCount: searchResponse.Paging.TotalRecordCount
        })
      ];

      const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(
        searchResponse.SearchFilters,
        searchResponseContext.searchFilterMappingDataObj
      );

      actions.push(new fromSearchFiltersActions.RefreshFilters({
        filters: filters,
        keepFilteredOutOptions: searchResponse.KeepFilteredOutOptions
      }));

      if (searchResponseContext.searchingFilter &&
         (searchResponseContext.payload.getSingledFilteredAggregates || searchResponseContext.singledFilter.Operator === OperatorEnum.And)) {
        actions.push(new fromSingledFilterActions.SearchAggregation());
      }

      const exchangeMapResponse: ExchangeMapResponse = {
        FeatureCollection: searchResponse.FeatureCollection,
        MapSummary: searchResponse.MapSummary
      };

      actions.push(new fromMapActions.LoadPeerMapDataSuccess(exchangeMapResponse));

      if (searchResponseContext.payload.resetInitialBounds) {
        actions.push(new fromMapActions.SetPeerMapBounds(exchangeMapResponse.MapSummary));
      }

      return actions;
    })
  );

  searchExchangeData(subscribedAction: string): Observable<Action> {
    return this.actions$.pipe(
      ofType(subscribedAction),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, filterContext) => ({action, filterContext})
      ),
      switchMap((data: any) => {
          const exchangeRequest: ExchangeDataSearchRequest = {
            ...data.filterContext
          };
          return this.exchangeDataSearchApiService.searchExchangeData(exchangeRequest).pipe(
              map(response => {
                let successPayload = {
                  response: response
                };

                if (data.action.payload) {
                  response.KeepFilteredOutOptions = data.action.payload.keepFilteredOutOptions;
                  successPayload = {
                    ...successPayload,
                    ...{
                      getSingledFilteredAggregates: data.action.payload.getSingledFilteredAggregates,
                      resetInitialBounds: data.action.payload.resetInitialBounds
                    }
                  };
                }

                return new fromExchangeSearchResultsActions.GetExchangeDataResultsSuccess(successPayload);
              }),
              catchError(() => of(new fromExchangeSearchResultsActions.GetExchangeDataResultsError(0)))
            );
        }
      )
    );
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducer.State>,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {}
}
