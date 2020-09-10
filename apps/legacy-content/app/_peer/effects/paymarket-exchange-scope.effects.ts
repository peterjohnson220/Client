import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import * as fromPaymarketExchangeScopeActions from '../actions/paymarket-exchange-scope.actions';

import { ExchangeScopeApiService } from 'libs/data/payfactors-api/peer';
import { ExchangeScopes } from 'libs/models/peer/exchange-scope';
import { PayMarketApiService } from 'libs/data/payfactors-api/paymarket';
import { WindowCommunicationService } from 'libs/core/services';

@Injectable()
export class PaymarketExchangeScopeEffects {
  @Effect()
  loadExchangeScopes: Observable<Action> = this.actions$.pipe(
    ofType(fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES),
    switchMap(() =>
      this.exchangeScopeApiService.getCompanyExchangeScopes().pipe(
        map((exchangeScopes: ExchangeScopes[]) =>
          new fromPaymarketExchangeScopeActions.LoadExchangeScopesSuccess(exchangeScopes)
        ),
        catchError(() => of(new fromPaymarketExchangeScopeActions.LoadExchangeScopesError()))
      )
    )
  );

  @Effect()
  loadExchangeScopeSelections: Observable<Action> = this.actions$.pipe(
    ofType(fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS),
    map((action: fromPaymarketExchangeScopeActions.LoadExchangeScopeSelections) => action.payload),
    switchMap(payload =>
      this.paymarketApiService.getExchangeScopeSelections(payload).pipe(
        map((exchangeScopes: ExchangeScopes[]) =>
            new fromPaymarketExchangeScopeActions.LoadExchangeScopeSelectionsSuccess(exchangeScopes)
        ),
        catchError(() => of(new fromPaymarketExchangeScopeActions.LoadExchangeScopeSelectionsError()))
      )
    )
  );

  // Window Communication
  @Effect({ dispatch: false })
  publishExchangeScopeSelections$ = this.actions$.pipe(
    ofType(fromPaymarketExchangeScopeActions.PUBLISH_EXCHANGE_SCOPE_SELECTIONS),
    tap((action: fromPaymarketExchangeScopeActions.PublishExchangeScopeSelections) => {
      const scopeIds: number[] = [];
      if (action.payload) {
        action.payload.map(keyValuePair => {
          if (keyValuePair && keyValuePair.Value) {
            scopeIds.push(keyValuePair.Value);
          }
        });
      }
      this.windowCommunicationService.postMessage(action.type, scopeIds);
    })
  );

  @Effect({dispatch: false})
  loadExchangeScopesSuccess$ = this.actions$.pipe(
    ofType(fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES_SUCCESS),
    tap((action: fromPaymarketExchangeScopeActions.LoadExchangeScopesSuccess) => {
      this.windowCommunicationService.postMessage(action.type);
    })
  );

  constructor(
    private actions$: Actions,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private paymarketApiService: PayMarketApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
