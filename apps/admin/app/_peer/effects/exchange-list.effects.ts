import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, tap, concatMap, withLatestFrom } from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeListItem } from 'libs/models';
import * as fromPeerAdminReducer from '../reducers';
import * as fromExchangeListActions from '../actions/exchange-list.actions';


@Injectable()
export class ExchangeListEffects {

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeListActions.LOAD_EXCHANGES),
      switchMap((action: fromExchangeListActions.LoadExchanges) =>
        this.exchangeApiService.getAllExchanges(action.payload).pipe(
          map((exchangeListItems: ExchangeListItem[]) => {
            return new fromExchangeListActions.LoadExchangesSuccess(exchangeListItems);
          }),
          catchError(error => of(new fromExchangeListActions.LoadExchangesError()))
        )
      )
    );

  @Effect()
  upsertExchange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeListActions.UPSERT_EXCHANGE),
      switchMap((action: fromExchangeListActions.UpsertExchange) =>
        this.exchangeApiService.upsertExchange(action.payload).pipe(
          map((exchangeListItem: ExchangeListItem) => {
            return new fromExchangeListActions.UpsertExchangeSuccess(exchangeListItem);
          }),
          catchError(error => of(new fromExchangeListActions.UpsertExchangeError(error)))
        )
      )
    );

  @Effect()
  deleteExchange$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeListActions.DELETE_EXCHANGE),
      map((action: fromExchangeListActions.DeleteExchange) => action.payload),
      withLatestFrom(
        this.store.pipe(select(fromPeerAdminReducer.getExchangeListSearchQuery)),
        (payload, searchQuery) => {
          return {exchangeId: payload, searchQuery: searchQuery};
        }
      ),
      switchMap(payload =>
        this.exchangeApiService.deleteExchange(payload.exchangeId).pipe(
          concatMap(() => {
            return [
              new fromExchangeListActions.LoadExchanges(payload.searchQuery),
              new fromExchangeListActions.DeleteExchangeSuccess()
            ];
          }),
          catchError(error => of(new fromExchangeListActions.DeleteExchangeError,
            new fromExchangeListActions.LoadExchanges('')))
        )
      )
    );

  @Effect({ dispatch: false })
  navigateToManagePage: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeListActions.UPSERT_EXCHANGE_SUCCESS),
      tap((action: fromExchangeListActions.UpsertExchangeSuccess) => {
        this.router.navigate(['/peer/exchange', action.payload.ExchangeId]);
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerAdminReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) { }
}
