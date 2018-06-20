import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeListItem } from 'libs/models';
import * as fromExchangeListActions from 'libs/features/peer/list/actions/exchange-list.actions';


@Injectable()
export class ExchangeListEffects {

  @Effect()
  loadExchanges$: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.LOADING_EXCHANGES).pipe(
      switchMap(() =>
        this.exchangeApiService.getAllExchanges().pipe(
          map((exchangeListItems: ExchangeListItem[]) => {
            return new fromExchangeListActions.LoadingExchangesSuccess(exchangeListItems);
          }),
          catchError(error => of(new fromExchangeListActions.LoadingExchangesError()))
        )
      )
    );

  @Effect()
  upsertExchange$: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.UPSERTING_EXCHANGE).pipe(
      switchMap((action: fromExchangeListActions.UpsertingExchange) =>
        this.exchangeApiService.upsertExchange(action.payload).pipe(
          map((exchangeListItem: ExchangeListItem) => {
            return new fromExchangeListActions.UpsertingExchangeSuccess(exchangeListItem);
          }),
          catchError(error => of(new fromExchangeListActions.UpsertingExchangeError(error)))
        )
      )
    );

  @Effect({ dispatch: false })
  navigateToManagePage: Observable<Action> = this.actions$
    .ofType(fromExchangeListActions.UPSERTING_EXCHANGE_SUCCESS).pipe(
      tap((action: fromExchangeListActions.UpsertingExchangeSuccess) => {
        this.router.navigate(['/peer/exchange', action.payload.ExchangeId]);
      })
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) {}
}


