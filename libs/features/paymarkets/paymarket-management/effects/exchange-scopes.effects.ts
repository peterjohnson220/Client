import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ExchangeScopeApiService, PayMarketApiService } from 'libs/data/payfactors-api';
import { ExchangeScopes } from 'libs/models/peer/exchange-scope';

import * as fromPayMarketManagementReducer from '../reducers';
import * as fromExchangeScopesActions from '../actions/exchange-scopes.actions';
import { Store } from '@ngrx/store';
import { ExchangeScopesHelper } from '../helpers';

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

  @Effect()
  loadExchangeScopeSelections$ = this.actions$
    .pipe(
      ofType(fromExchangeScopesActions.LOAD_EXCHANGE_SCOPE_SELECTIONS),
      withLatestFrom(
        this.store.select(fromPayMarketManagementReducer.getCompanyExchangeScopes),
        (action: fromExchangeScopesActions.LoadExchangeScopeSelections, allExchangeScopes) =>
          ({ action, allExchangeScopes })
      ),
      switchMap((data) => {
        return this.payMarketApiService.getExchangeScopeSelections(data.action.payload.payMarketId)
          .pipe(
            map((response) => new fromExchangeScopesActions.LoadExchangeScopeSelectionsSuccess(
              ExchangeScopesHelper.mapGenericKeyValuesToExchangeScopes(response, data.allExchangeScopes.obj)
            )),
            catchError(() => of(new fromExchangeScopesActions.LoadExchangeScopeSelectionsError()))
          );
      })
    );

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private actions$: Actions,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private payMarketApiService: PayMarketApiService
  ) {}
}
