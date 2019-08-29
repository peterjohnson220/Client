import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, concatMap } from 'rxjs/operators';

import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { ExchangeScopeItem, PeerMapScopeDetails } from 'libs/models/peer';
import * as fromLibsFeatureSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';

import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';
import * as fromMapActions from '../actions/map.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromExchangeExplorerReducers from '../reducers';
import { ExchangeExplorerContextService } from '../services';

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
        this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextScopeSelection)),
        this.exchangeExplorerContextService.selectFilterContext(),
        (action, scopeSelection, filterContext) => {
            return {...scopeSelection, ...filterContext};
          }),
      switchMap(payload =>
        this.exchangeScopeApiService.getPeerMapScope(payload.exchangeScopeGuid, payload.filterModel).pipe(
          map((peerMapScopeDetails: PeerMapScopeDetails) => new fromExchangeScopeActions
            .LoadExchangeScopeDetailsSuccess(peerMapScopeDetails)),
          catchError(() => of(new fromExchangeScopeActions.LoadExchangeScopeDetailsError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetailsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS)).pipe(
      map((action: fromExchangeScopeActions.LoadExchangeScopeDetailsSuccess) => action.payload),
      concatMap(payload => {
        return [
          new fromMapActions.ApplyScopeCriteria(payload.MapInfo),
          new fromExchangeFilterContextActions.ApplyScopeCriteria(payload.SideBarInfo)
        ];
      })
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
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {}
}
