import { Injectable } from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import {Observable, of} from 'rxjs/index';

import {PagingOptions} from 'libs/models/payfactors-api';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { ExchangeDataSearchResponse } from 'libs/models/payfactors-api/peer-exchange-explorer-search/response';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';

import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeExplorerReducer from '../reducers';

import * as fromSearchResultsActions from '../../../search/actions/search-results.actions';
import * as fromSearchFiltersActions from '../../../search/actions/search-filters.actions';
import * as fromSingledFilterActions from '../../../search/actions/singled-filter.actions';
import * as fromMapActions from '../actions/map.actions';

import { ExchangeMapResponse } from '../../../../models/peer';
import { ExchangeExplorerContextService } from '../services';

@Injectable()
export class ExchangeSearchEffects {

  @Effect()
  getResults$ = this.searchExchangeData(fromSearchResultsActions.GET_RESULTS);

  @Effect()
  updateFilterBounds$ = this.searchExchangeData(fromMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS);

  @Effect()
  getExchangeDataSearchResults$ = this.searchExchangeData(fromExchangeSearchResultsActions.GET_EXCHANGE_DATA_RESULTS);

  @Effect()
  initialMapMoveComplete$ = this.searchExchangeData(fromMapActions.INITIAL_MAP_MOVE_COMPLETE);

  @Effect()
  getExchangeDataSearchResultsSuccess$ = this.actions$.pipe(
    ofType(fromExchangeSearchResultsActions.GET_EXCHANGE_DATA_RESULTS_SUCCESS),
    withLatestFrom(
      this.store.pipe(select(fromSearchReducer.getSearchingFilter)),
      this.store.pipe(select(fromSearchReducer.getSingledFilter)),
      (
        action: fromExchangeSearchResultsActions.GetExchangeDataResultsSuccess,
        searchingFilter,
        singledFilter
      ) => ({payload: action.payload, searchingFilter, singledFilter})
    ),
    mergeMap((searchResponseContext) => {
      const actions = [];

      const searchResponse: ExchangeDataSearchResponse = searchResponseContext.payload;
      const filters = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(
        searchResponse.SearchFilters,
        searchResponse.SearchFilterMappingDataObj
      );

      actions.push(new fromSearchResultsActions.GetResultsSuccess({
        totalRecordCount: searchResponse.Paging.TotalRecordCount
      }));
      actions.push(new fromSearchFiltersActions.RefreshFilters({
        filters: filters,
        keepFilteredOutOptions: true
      }));

      if (searchResponseContext.searchingFilter) {
        actions.push(new fromSingledFilterActions.SearchAggregation());
      }

      const exchangeMapResponse: ExchangeMapResponse = {
        MapChunks: [],
        FeatureCollection: searchResponse.FeatureCollection,
        MapSummary: searchResponse.MapSummary
      };

      actions.push(new fromMapActions.LoadPeerMapDataSuccess(exchangeMapResponse));

      return actions;
    })
  );

  searchExchangeData(subscribedAction: string): Observable<Action> {
    return this.actions$.pipe(
      ofType(subscribedAction),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, filterContext) => { return filterContext; }),
      mergeMap((data: any) => {

        const searchFieldsRequestObj = this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.searchFilters);
        const filtersRequestObj = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.searchFilters);
        const pagingOptions: PagingOptions = {
          From: 0,
          Count: 5
        };
        return this.exchangeDataSearchApiService.searchExchangeData({
          ...data.filterContext,
          ...data.mapFilter,
          SearchFields: searchFieldsRequestObj,
          Filters: filtersRequestObj,
          PagingOptions: pagingOptions
        })
          .pipe(
            map(response => new fromExchangeSearchResultsActions.GetExchangeDataResultsSuccess(response)),
            catchError(() => of(new fromExchangeSearchResultsActions.GetExchangeDataResultsError(0)))
          );
      }
    )
    )
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
