import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, concatMap, mergeMap } from 'rxjs/operators';

import { ExchangeScopeApiService, ExchangeDataFilterApiService } from 'libs/data/payfactors-api/peer';
import {
  ExchangeExplorerContextInfo,
  ExchangeScopeItem,
  UpsertExchangeExplorerScopeRequest
} from 'libs/models/peer';
import {
  ExchangeExplorerDataCutResponse,
  ExchangeExplorerScopeResponse,
  ExchangeExplorerScopeResponseContext
} from 'libs/models/payfactors-api/peer/exchange-data-filter/response';
import { Filter } from 'libs/features/search/models';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { ExchangeExplorerContextService } from '../services';
import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromMapActions from '../actions/map.actions';
import * as fromExchangeDataCutActions from '../actions/exchange-data-cut.actions';
import * as fromExchangeExplorerReducers from '../reducers';
import * as fromExchangeExplorerContextInfoActions from '../actions/exchange-explorer-context-info.actions';
import * as fromExchangeExplorerMapActions from '../actions/map.actions';

@Injectable()
export class ExchangeScopeEffects {

  @Effect()
  loadExchangeScopesByJobs: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS)).pipe(
      withLatestFrom(this.store.pipe(select(fromExchangeExplorerReducers.getAssociatedExchangeJobIds)),
        (action, systemFilterExchangeJobIds) => systemFilterExchangeJobIds),
      switchMap((systemFilterExchangeJobIds: number[]) =>
        this.exchangeScopeApiService.getExchangeScopesByJobs(systemFilterExchangeJobIds).pipe(
          map((exchangeScopeItems: ExchangeScopeItem[]) => new fromExchangeScopeActions
            .LoadExchangeScopesByJobsSuccess(exchangeScopeItems)),
          catchError(() => of(new fromExchangeScopeActions.LoadExchangeScopesByJobsError))
        )
      )
    );

  @Effect()
  loadExchangeScopesByExchange: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE)).pipe(
    map((action: fromExchangeScopeActions.LoadExchangeScopesByExchange) => action.payload),
    switchMap((payload) =>
        this.exchangeScopeApiService.getExchangeScopesByExchange(payload).pipe(
          map((exchangeScopeItems: ExchangeScopeItem[]) => new fromExchangeScopeActions
            .LoadExchangeScopesByExchangeSuccess(exchangeScopeItems)),
          catchError(() => of(new fromExchangeScopeActions.LoadExchangeScopesByExchangeError))
        )
      )
    );

  @Effect()
  loadExchangeDataCut: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT)).pipe(
    map((action: fromExchangeDataCutActions.LoadExchangeDataCut) => action.payload),
    switchMap(payload =>
      this.exchangeDataFilterApiService.getExchangeDataCutFilterContext(payload).pipe(
        mergeMap((response: ExchangeExplorerDataCutResponse) => {
          const exchangeExplorerContextInfo: ExchangeExplorerContextInfo = response.ExchangeExplorerContextInfo;
          const scopeContext: ExchangeExplorerScopeResponse = { ScopeContext: response.ScopeContext,
            FilterContext: exchangeExplorerContextInfo.FilterContext};
          return [
            new fromExchangeExplorerContextInfoActions.LoadContextInfoSuccess({
              payMarket: exchangeExplorerContextInfo.PayMarketContext.PayMarket,
              payMarketGeoData: exchangeExplorerContextInfo.PayMarketContext.PayMarketGeoData,
              exchangeJobFilterOptions: exchangeExplorerContextInfo.AssociatedExchangeJobFilterOptions,
              searchFilterMappingDataObj: exchangeExplorerContextInfo.SearchFilterMappingData
            }),
            new fromExchangeExplorerMapActions.SetPeerMapBounds(exchangeExplorerContextInfo.FilterContext),
            new fromExchangeFilterContextActions.SetFilterContext(exchangeExplorerContextInfo.FilterContext),
            new fromExchangeDataCutActions.LoadExchangeDataCutSuccess(scopeContext)
          ];
        }),
        catchError(() => of(new fromExchangeDataCutActions.LoadExchangeDataCutError))
      )
    )
  );

  @Effect()
  loadExchangeScopeDetails: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS)).pipe(
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, filterContext) => filterContext),
      switchMap(payload =>
        this.exchangeDataFilterApiService.getExchangeScopeFilterContext(payload).pipe(
          mergeMap((peerMapScopeDetails: ExchangeExplorerScopeResponse) => {
            return [
              new fromExchangeFilterContextActions.SetFilterContext(peerMapScopeDetails.FilterContext),
              new fromExchangeScopeActions.LoadExchangeScopeDetailsSuccess(peerMapScopeDetails)
            ];
          }),
          catchError(() => of(new fromExchangeScopeActions.LoadExchangeScopeDetailsError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetailsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS, fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT_SUCCESS)).pipe(
      withLatestFrom(
        this.store.pipe(select(fromSearchReducer.getSearchingFilter)),
        this.store.pipe(select(fromSearchReducer.getSingledFilter)),
        this.store.pipe(select(fromExchangeExplorerReducers.getSearchFilterMappingDataObj)),
        (
          action: fromExchangeScopeActions.LoadExchangeScopeDetailsSuccess|fromExchangeDataCutActions.LoadExchangeDataCutSuccess,
          searchingFilter,
          singledFilter,
          searchFilterMappingDataObj
        ) => ({
          response: (action.payload),
          searchingFilter,
          singledFilter,
          searchFilterMappingDataObj,
          isDataCut: action.type === fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT_SUCCESS
        })
      ),
      mergeMap((payload: any) => {
        const actions = [];

        const scopeResponse: ExchangeExplorerScopeResponse = payload.response;
        const scopeContext: ExchangeExplorerScopeResponseContext = scopeResponse.ScopeContext;
        const searchResponse = scopeContext.ExchangeDataSearchResponse;
        const filters: Filter[] = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(
          searchResponse.SearchFilters,
          payload.searchFilterMappingDataObj
        ) as Filter[];

        const savedFilters = this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(
          [scopeContext.SelectedFilterOptions],
          payload.searchFilterMappingDataObj
        );
        const selections = savedFilters[0].Filters;
        actions.push(new fromSearchFiltersActions.ApplySavedFilters(selections));

        actions.push(new fromSearchFiltersActions.RefreshFilters({
          filters: filters,
          keepFilteredOutOptions: false
        }));
        actions.push(new fromSearchResultsActions.GetResultsSuccess({
          totalRecordCount: searchResponse.Paging.TotalRecordCount
        }));

        if (payload.searchingFilter) {
          actions.push(new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER}));
        }

        const applyAction = payload.isDataCut ?
          new fromMapActions.ApplyCutCriteria(scopeResponse) :
          new fromMapActions.ApplyScopeCriteria(scopeResponse);
        actions.push(applyAction);

        return actions;
      })
    );

  @Effect()
  applyScopeCriteriaSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromMapActions.APPLY_CUT_CRITERIA, fromMapActions.APPLY_SCOPE_CRITERIA),
    map(() => new fromMapActions.ApplyScopeCriteriaSuccess())
  );

  @Effect()
  upsertExchangeScope$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE),
    map((action: fromExchangeScopeActions.UpsertExchangeScope) => action.payload),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      (actionPayload, filterContext) => {
        return {
          ExchangeScopeDetails: actionPayload,
          ExchangeDataSearchRequest: filterContext
        };
      }
    ),
    switchMap((request: UpsertExchangeExplorerScopeRequest) => this.exchangeScopeApiService.upsertExchangeExplorerScope(request).pipe(
      concatMap((exchangeScopeItem: ExchangeScopeItem) => {
        return [
          new fromExchangeScopeActions.UpsertExchangeScopeSuccess(),
          new fromExchangeScopeActions.LoadExchangeScopesByExchange(
            request.ExchangeDataSearchRequest.FilterContext.ExchangeId
          ),
          new fromExchangeFilterContextActions.SetExchangeScopeSelection(exchangeScopeItem)
        ];
      }),
      catchError(() => of(new fromExchangeScopeActions.UpsertExchangeScopeError()))
    ))
  );

  @Effect()
  deleteExchangeScope$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.DELETE_EXCHANGE_SCOPE)).pipe(
      map((action: fromExchangeScopeActions.DeleteExchangeScope) => action.payload),
      withLatestFrom(this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextScopeSelection)),
        (action, selectedScope) => {
          return { action, selectedScope };
        }
      ),
      switchMap(payload =>
        this.exchangeScopeApiService.deleteExchangeScope(payload.action).pipe(
          concatMap(() => {
            return [
              new fromExchangeScopeActions.DeleteExchangeScopeSuccess(payload.action)
            ];
          }),
          catchError(() => of(new fromExchangeScopeActions.DeleteExchangeScopeError))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private exchangeDataFilterApiService: ExchangeDataFilterApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper
  ) {}
}
