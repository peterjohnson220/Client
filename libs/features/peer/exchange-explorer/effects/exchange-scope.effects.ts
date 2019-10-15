import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, concatMap, mergeMap } from 'rxjs/operators';

import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { ExchangeScopeItem, UpsertExchangeExplorerScopeRequest } from 'libs/models/peer';
import { MultiSelectFilter } from 'libs/features/search/models';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer-exchange-explorer-search/response';
import * as fromLibsFeatureSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import * as fromSingledFilterActions from 'libs/features/search/actions/singled-filter.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';

import { ExchangeExplorerContextService } from '../services';
import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromMapActions from '../actions/map.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeExplorerReducers from '../reducers';

@Injectable()
export class ExchangeScopeEffects {

  @Effect()
  loadExchangeScopesByJobs: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS)).pipe(
      withLatestFrom(this.store.pipe(select(fromExchangeExplorerReducers.getSystemFilterExchangeJobIds)),
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
  loadExchangeScopeDetails: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS)).pipe(
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, filterContext) => filterContext),
      switchMap(payload =>
        this.exchangeScopeApiService.getExchangeScopeFilterContext(payload).pipe(
          map((peerMapScopeDetails: ExchangeExplorerScopeResponse) => new fromExchangeScopeActions
            .LoadExchangeScopeDetailsSuccess(peerMapScopeDetails)),
          catchError(() => of(new fromExchangeScopeActions.LoadExchangeScopeDetailsError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetailsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS)).pipe(
      withLatestFrom(
        this.store.pipe(select(fromSearchReducer.getSearchingFilter)),
        this.store.pipe(select(fromSearchReducer.getSingledFilter)),
        this.store.pipe(select(fromExchangeExplorerReducers.getSearchFilterMappingDataObj)),
        (
          action: fromExchangeScopeActions.LoadExchangeScopeDetailsSuccess,
          searchingFilter,
          singledFilter,
          searchFilterMappingDataObj
        ) => ({response: (action.payload), searchingFilter, singledFilter, searchFilterMappingDataObj})
      ),
      mergeMap((payload: any) => {
        const actions = [];

        const scopeResponse: ExchangeExplorerScopeResponse = payload.response;
        const searchResponse = scopeResponse.ExchangeDataSearchResponse;
        const filters: MultiSelectFilter[] = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(
          searchResponse.SearchFilters,
          payload.searchFilterMappingDataObj
        ) as MultiSelectFilter[];

        const savedFilters = this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(
          [scopeResponse.SelectedFilterOptions]
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
          actions.push(new fromSingledFilterActions.SearchAggregation());
        }

        actions.push(new fromMapActions.ApplyScopeCriteria(scopeResponse));

        return actions;
      })
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
            if (!!payload.selectedScope && payload.selectedScope.Id === payload.action) {
              return [
                new fromExchangeScopeActions.DeleteExchangeScopeSuccess(payload.action),
                new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
                new fromExchangeSearchResultsActions.GetExchangeDataResults()
              ];
            } else {
              return [
                new fromExchangeScopeActions.DeleteExchangeScopeSuccess(payload.action)
              ];
            }
          }),
          catchError(() => of(new fromExchangeScopeActions.DeleteExchangeScopeError))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper
  ) {}
}
