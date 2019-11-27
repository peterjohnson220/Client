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
      withLatestFrom(this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducers.getAssociatedExchangeJobIds)),
        (action, associatedExchangeJobIds) => associatedExchangeJobIds),
      switchMap((associatedExchangeJobIds: number[]) =>
        this.exchangeScopeApiService.getExchangeScopesByJobs(associatedExchangeJobIds).pipe(
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

  @Effect()
  deleteExchangeScope$: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsExchangeScopeActions.DELETE_EXCHANGE_SCOPE)).pipe(
      map((action: fromLibsExchangeScopeActions.DeleteExchangeScope) => action.payload),
      withLatestFrom(this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducers.getPeerFilterScopeSelection)),
        (action, selectedScope) => {
          return { action, selectedScope };
        }
      ),
      switchMap(payload =>
        this.exchangeScopeApiService.deleteExchangeScope(payload.action).pipe(
          concatMap(() => {
            if (!!payload.selectedScope && payload.selectedScope.Id === payload.action) {
              return [
                new fromLibsExchangeScopeActions.DeleteExchangeScopeSuccess(payload.action),
                new fromLibsFilterSidebarActions.ClearAllSelections(),
                new fromLibsFilterSidebarActions.GetMapData()
              ];
            } else {
              return [
                new fromLibsExchangeScopeActions.DeleteExchangeScopeSuccess(payload.action)
              ];
            }
          }),
          catchError(() => of(new fromLibsExchangeScopeActions.DeleteExchangeScopeError))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private libsPeerMapStore: Store<fromLibsPeerMapReducers.State>,
    private exchangeScopeApiService: ExchangeScopeApiService
  ) {}
}
