import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';
import { AddPayMarketRequest } from 'libs/models/payfactors-api';
import * as fromRootState from 'libs/state/state';
import { MarketDataScopeApiService } from 'libs/data/payfactors-api';

import * as fromMarketsPageActions from '../actions/markets-page.actions';
import * as fromComphubMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromAddPayMarketModalActions from '../actions/add-paymarket-modal.actions';
import { MarketsPageHelper } from '../helpers';

@Injectable()
export class MarketsPageEffects {

  @Effect()
  getPaymarkets$ = this.actions$
    .ofType(fromMarketsPageActions.GET_PAYMARKETS)
    .pipe(
        switchMap(() => {
          return this.paymarketApiService.getAll()
            .pipe(
              mergeMap((paymarketsResponse: PayMarket[]) => {
                const actions = [];
                actions.push(new fromMarketsPageActions.GetPaymarketsSuccess(
                  PayfactorsApiModelMapper.mapPaymarketsToPricingPayMarkets(paymarketsResponse)
                ));
                if (paymarketsResponse.length === 0) {
                  actions.push(new fromAddPayMarketModalActions.Open());
                }
                return actions;
              }),
              catchError(() => of(new fromMarketsPageActions.GetPaymarketsError()))
            );
        }
      )
    );

  @Effect()
  getMarketDataScope$ = this.actions$
  .ofType(fromMarketsPageActions.GET_MD_SCOPE)
  .pipe(
    switchMap((action: fromMarketsPageActions.GetMarketDataScope) => {
      return this.marketDataScopeApiService.getMDScope(action.payload.countryCode)
        .pipe(
          map((response) =>
            new fromMarketsPageActions.GetMarketDataScopeSuccess(response)
          ),
          catchError(() => {
            return of(new fromMarketsPageActions.GetMarketDataScopeError());
          })
        );
    })
  );

  @Effect()
  savePayMarket$ = this.actions$
  .ofType(fromMarketsPageActions.SAVE_PAYMARKET)
  .pipe(
    withLatestFrom(
      this.store.select(fromRootState.getUserContext),
      (action: fromMarketsPageActions.SavePayMarket, userContext) => ({ action, userContext })
    ),
    map((data) => {
      const request: AddPayMarketRequest = MarketsPageHelper.buildAddPayMarketRequest(
        data.userContext.CompanyId, data.action.payload);
      return new fromAddPayMarketModalActions.Save(request);
    })
  );

  @Effect()
  savePayMarketSuccess$ = this.actions$
  .ofType(fromAddPayMarketModalActions.SAVE_PAYMARKET_SUCCESS)
  .pipe(
    mergeMap((data) => {
      return [
        new fromAddPayMarketModalActions.Close(),
        new fromMarketsPageActions.GetPaymarkets()
      ];
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private paymarketApiService: PayMarketApiService,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) {}
}
