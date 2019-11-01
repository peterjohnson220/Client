import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { ExchangeDataSearchResponse } from 'libs/models/payfactors-api/peer/exchange-data-search/response';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { ExchangeMapResponse } from 'libs/models/peer';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeExplorerReducer from '../reducers';

import * as fromSearchResultsActions from '../../../search/actions/search-results.actions';
import * as fromSearchFiltersActions from '../../../search/actions/search-filters.actions';
import * as fromSingledFilterActions from '../../../search/actions/singled-filter.actions';
import * as fromMapActions from '../actions/map.actions';

import { ExchangeExplorerContextService } from '../services';
import {
  BaseExchangeDataSearchRequest,
  ExchangeDataSearchRequest
} from '../../../../models/payfactors-api/peer/exchange-data-search/request';
import { OperatorEnum } from '../../../../constants';

@Injectable()
export class ExchangeSearchEffects {

  @Effect()
  getResults$ = this.searchExchangeData(fromSearchResultsActions.GET_RESULTS);

  @Effect()
  updateFilterBounds$ = this.searchExchangeData(fromMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS, true, false);

  @Effect()
  getExchangeDataSearchResults$ = this.searchExchangeData(fromExchangeSearchResultsActions.GET_EXCHANGE_DATA_RESULTS, true);

  @Effect()
  initialMapMoveComplete$ = this.searchExchangeData(fromMapActions.INITIAL_MAP_MOVE_COMPLETE, true);

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
         (searchResponseContext.payload.getSingledFilterAggregates || searchResponseContext.singledFilter.Operator === OperatorEnum.And)) {
        actions.push(new fromSingledFilterActions.SearchAggregation());
      }

      const exchangeMapResponse: ExchangeMapResponse = {
        FeatureCollection: searchResponse.FeatureCollection,
        MapSummary: searchResponse.MapSummary
      };

      actions.push(new fromMapActions.LoadPeerMapDataSuccess(exchangeMapResponse));

      return actions;
    })
  );

  searchExchangeData(subscribedAction: string, getSingledFilterAggregates = false, keepFilteredOutOptions = true): Observable<Action> {
    return this.actions$.pipe(
      ofType(subscribedAction),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, filterContext) => filterContext
      ),
      mergeMap((data: BaseExchangeDataSearchRequest) => {
          const exchangeRequest: ExchangeDataSearchRequest = {
            ...data
          };
          return this.exchangeDataSearchApiService.searchExchangeData(exchangeRequest).pipe(
              map(response => {
                response.KeepFilteredOutOptions = keepFilteredOutOptions;
                return new fromExchangeSearchResultsActions.GetExchangeDataResultsSuccess({response, getSingledFilterAggregates});
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
