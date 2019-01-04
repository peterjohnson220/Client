import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, tap, concatMap } from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeListItem } from 'libs/models';
import * as fromExchangeListActions from '../actions/exchange-list.actions';


@Injectable()
export class ExchangeListEffects {

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.LOAD_EXCHANGES).pipe(
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
    .ofType(fromExchangeListActions.UPSERT_EXCHANGE).pipe(
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
    .ofType(fromExchangeListActions.DELETE_EXCHANGE).pipe(
      map((action: fromExchangeListActions.DeleteExchange) => action.payload),
      switchMap(payload =>
        this.exchangeApiService.deleteExchange(payload).pipe(
          concatMap(() => {
            return [
              new fromExchangeListActions.LoadExchanges(''),
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
    .ofType(fromExchangeListActions.UPSERT_EXCHANGE_SUCCESS).pipe(
      tap((action: fromExchangeListActions.UpsertExchangeSuccess) => {
        this.router.navigate(['/peer/exchange', action.payload.ExchangeId]);
      })
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) { }
}


