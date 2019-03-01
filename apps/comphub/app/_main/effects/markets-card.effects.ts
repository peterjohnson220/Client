import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { ComphubApiService, MarketDataScopeApiService } from 'libs/data/payfactors-api';
import { AddPayMarketRequest, PayMarketDataResponse } from 'libs/models/payfactors-api';
import * as fromRootState from 'libs/state/state';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../reducers';
import { MarketsCardHelper, PayfactorsApiModelMapper } from '../helpers';
import * as fromAddPayMarketFormActions from '../actions/add-paymarket-form.actions';
import { ComphubPages } from '../data';
import * as fromSummaryCardActions from '../actions/summary-card.actions';

@Injectable()
export class MarketsCardEffects {

  @Effect()
  getPaymarkets$ = this.actions$
    .ofType(fromMarketsCardActions.GET_PAYMARKETS)
    .pipe(
      switchMap(() => {
          return this.comphubApiService.getPaymarketData('USA')
            .pipe(
              mergeMap((paymarketsResponse: PayMarketDataResponse) => {
                const actions = [];
                let payMarkets = PayfactorsApiModelMapper.mapPaymarketsToPricingPayMarkets(paymarketsResponse.AccessiblePayMarkets);
                if (paymarketsResponse.HasPaymarketRestrictions) {
                  actions.push(new fromMarketsCardActions.HideAddNewPaymarketButton());
                  if (!payMarkets.length) {
                    // display national payMarket as a card
                    payMarkets = [MarketsCardHelper.buildDefaultPricingPayMarket()];
                    actions.push(new fromMarketsCardActions.DisplayNationalAsCard());
                  }
                }
                actions.push(new fromMarketsCardActions.GetPaymarketsSuccess(payMarkets));
                actions.push(new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst());

                if (!payMarkets.length) {
                  actions.push(new fromAddPayMarketFormActions.OpenForm({ showSkipButton: true }));
                }
                return actions;
              }),
              catchError((error) => of(new fromMarketsCardActions.GetPaymarketsError(),
                new fromComphubPageActions.HandleApiError(error)))
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
            catchError((error) => {
              return of(new fromMarketsCardActions.GetMarketDataScopeError(),
                new fromComphubPageActions.HandleApiError(error));
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
          new fromComphubPageActions.UpdateCardSubtitle({
            cardId: ComphubPages.Markets,
            subTitle: data.selectedPayMarket.PayMarketName
          }),
        new fromSummaryCardActions.ResetCreateProjectStatus()
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

  @Effect()
  clearSelectedPayMarket$ = this.actions$
    .ofType(fromMarketsCardActions.SET_TO_DEFAULT_PAYMARKET)
    .pipe(
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        (action: fromMarketsCardActions.SetToDefaultPaymarket, selectedPayMarket) => ({ action, selectedPayMarket })),
      mergeMap((data) => [
          new fromComphubPageActions.UpdateCardSubtitle({
            cardId: ComphubPages.Markets,
            subTitle: data.selectedPayMarket.PayMarketName
          }),
        new fromSummaryCardActions.ResetCreateProjectStatus()
        ]
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) { }
}
