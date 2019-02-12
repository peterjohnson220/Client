import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { MarketDataScopeApiService, PayMarketApiService } from 'libs/data/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';
import { AddPayMarketRequest } from 'libs/models/payfactors-api';
import * as fromRootState from 'libs/state/state';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../reducers';
import { MarketsCardHelper, PayfactorsApiModelMapper } from '../helpers';
import * as fromAddPayMarketFormActions from '../actions/add-paymarket-form.actions';
import { ComphubPages } from '../data';

@Injectable()
export class MarketsCardEffects {

  @Effect()
  getPaymarkets$ = this.actions$
    .ofType(fromMarketsCardActions.GET_PAYMARKETS)
    .pipe(
        switchMap(() => {
          return this.paymarketApiService.getAll()
            .pipe(
              mergeMap((paymarketsResponse: PayMarket[]) => {
                const actions = [];
                actions.push(new fromMarketsCardActions.GetPaymarketsSuccess(
                  PayfactorsApiModelMapper.mapPaymarketsToPricingPayMarkets(paymarketsResponse)
                ));
                actions.push(new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst());
                if (paymarketsResponse.length === 0) {
                  actions.push(new fromAddPayMarketFormActions.OpenForm({ showSkipButton: true }));
                }
                return actions;
              }),
              catchError(() => of(new fromMarketsCardActions.GetPaymarketsError()))
            );
        }
      )
    );

  @Effect()
  getMarketDataScope$ = this.actions$
  .ofType(fromMarketsCardActions.GET_MD_SCOPE)
  .pipe(
    switchMap((action: fromMarketsCardActions.GetMarketDataScope) => {
      return this.marketDataScopeApiService.getMDScope(action.payload.countryCode)
        .pipe(
          map((response) =>
            new fromMarketsCardActions.GetMarketDataScopeSuccess(response)
          ),
          catchError(() => {
            return of(new fromMarketsCardActions.GetMarketDataScopeError());
          })
        );
    })
  );

  @Effect()
  savePayMarket$ = this.actions$
  .ofType(fromMarketsCardActions.SAVE_PAYMARKET)
  .pipe(
    withLatestFrom(
      this.store.select(fromRootState.getUserContext),
      (action: fromMarketsCardActions.SavePayMarket, userContext) => ({ action, userContext })
    ),
    map((data) => {
      const request: AddPayMarketRequest = MarketsCardHelper.buildAddPayMarketRequest(
        data.userContext.CompanyId, data.action.payload);
      return new fromAddPayMarketFormActions.SavePaymarket(request);
    })
  );

  @Effect()
  setSelectedPaymarket$ = this.actions$
    .ofType(fromMarketsCardActions.SET_SELECTED_PAYMARKET)
    .pipe(
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        (action: fromMarketsCardActions.SetSelectedPaymarket, selectedPayMarket) => ({ action, selectedPayMarket })),
      mergeMap((data) => [
          new fromDataCardActions.ClearSelectedJobData(),
          new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Markets, subTitle: data.selectedPayMarket.PayMarketName})
        ]
      )
    );

  @Effect()
  setPayMarketFilter$ = this.actions$
    .ofType(fromMarketsCardActions.SET_PAYMARKET_FILTER)
    .pipe(
      map((action: fromMarketsCardActions.SetPaymarketFilter) =>
        !action.payload
          ? new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst()
          : { type: 'NO_ACTION' }
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private paymarketApiService: PayMarketApiService,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) {}
}
