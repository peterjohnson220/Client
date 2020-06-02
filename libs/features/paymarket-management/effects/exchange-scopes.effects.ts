import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { ExchangeScopes } from 'libs/models/peer/exchange-scope';

import * as fromExchangeScopesActions from '../actions/exchange-scopes.actions';


@Injectable()
export class ExchangeScopesEffects {

  @Effect()
  loadCompanyExchangeScopes = this.actions$
    .pipe(
      ofType(fromExchangeScopesActions.LOAD_COMPANY_EXCHANGE_SCOPES),
      switchMap((action: fromExchangeScopesActions.LoadCompanyExchangeScopes) => {
        return this.exchangeScopeApiService.getCompanyExchangeScopes()
          .pipe(
            map((exchangeScopes: ExchangeScopes[]) => {
              return new fromExchangeScopesActions.LoadCompanyExchangeScopesSuccess(exchangeScopes);
            }),
            catchError(() => of(new fromExchangeScopesActions.LoadCompanyExchangeScopesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private exchangeScopeApiService: ExchangeScopeApiService
  ) {}
}
