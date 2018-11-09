import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, concatMap } from 'rxjs/operators';

import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { ExchangeScopeItem, PeerMapScopeDetails } from 'libs/models/peer';

import * as fromLibsExchangeScopeActions from '../actions/exchange-scope.actions';
import * as fromLibsPeerMapActions from '../actions/map.actions';
import * as fromLibsFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromLibsPeerMapReducers from '../reducers';

@Injectable()
export class ExchangeScopeEffects {
  @Effect()
  loadExchangeScopesByJobs: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS)).pipe(
      withLatestFrom(this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducers.getSystemFilterExchangeJobIds)),
        (action, systemFilterExchangeJobIds) => systemFilterExchangeJobIds),
      switchMap((systemFilterExchangeJobIds: number[]) =>
        this.exchangeScopeApiService.getExchangeScopesByJobs(systemFilterExchangeJobIds).pipe(
          map((exchangeScopeItems: ExchangeScopeItem[]) => new fromLibsExchangeScopeActions
            .LoadExchangeScopesByJobsSuccess(exchangeScopeItems)),
          catchError(() => of(new fromLibsExchangeScopeActions.LoadExchangeScopesByJobsError))
        )
      )
    );

  @Effect()
  loadExchangeScopesByExchange: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE)).pipe(
    map((action: fromLibsExchangeScopeActions.LoadExchangeScopesByExchange) => action.payload),
    switchMap((payload) =>
        this.exchangeScopeApiService.getExchangeScopesByExchange(payload).pipe(
          map((exchangeScopeItems: ExchangeScopeItem[]) => new fromLibsExchangeScopeActions
            .LoadExchangeScopesByExchangeSuccess(exchangeScopeItems)),
          catchError(() => of(new fromLibsExchangeScopeActions.LoadExchangeScopesByExchangeError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetails: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS)).pipe(
      withLatestFrom(this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducers.getPeerMapScopeRequestPayload)),
        (action, peerMapScopeRequestPayload) => peerMapScopeRequestPayload),
      switchMap(payload =>
        this.exchangeScopeApiService.getPeerMapScope(payload.exchangeScopeGuid, payload.filterModel).pipe(
          map((peerMapScopeDetails: PeerMapScopeDetails) => new fromLibsExchangeScopeActions
            .LoadExchangeScopeDetailsSuccess(peerMapScopeDetails)),
          catchError(() => of(new fromLibsExchangeScopeActions.LoadExchangeScopeDetailsError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetailsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS)).pipe(
      map((action: fromLibsExchangeScopeActions.LoadExchangeScopeDetailsSuccess) => action.payload),
      concatMap(payload => {
        return [
          new fromLibsPeerMapActions.ApplyScopeCriteria(payload.MapInfo),
          new fromLibsFilterSidebarActions.ApplyScopeCriteria(payload.SideBarInfo)
        ];
      })
    );

  constructor(
    private actions$: Actions,
    private libsPeerMapStore: Store<fromLibsPeerMapReducers.State>,
    private exchangeScopeApiService: ExchangeScopeApiService
  ) {}
}
