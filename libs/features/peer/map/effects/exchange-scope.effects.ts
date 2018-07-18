import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
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
  loadExchangeScopes: Observable<Action> = this.actions$
    .ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPES).pipe(
      withLatestFrom(this.libsPeerMapStore.select(fromLibsPeerMapReducers.getSystemFilterExchangeJobIds),
        (action, systemFilterExchangeJobIds) => systemFilterExchangeJobIds),
      switchMap((systemFilterExchangeJobIds: number[]) =>
        this.exchangeScopeApiService.getExchangeScopes(systemFilterExchangeJobIds).pipe(
          map((exchangeScopeItems: ExchangeScopeItem[]) => new fromLibsExchangeScopeActions
            .LoadExchangeScopesSuccess(exchangeScopeItems)),
          catchError(() => of(new fromLibsExchangeScopeActions.LoadExchangeScopesError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetails: Observable<Action> = this.actions$
    .ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS).pipe(
      withLatestFrom(this.libsPeerMapStore.select(fromLibsPeerMapReducers.getPeerMapScopeRequestPayload),
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
  loadExchangeScopeDetailsSuccess$: Observable<Action> = this.actions$
    .ofType(fromLibsExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS).pipe(
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
