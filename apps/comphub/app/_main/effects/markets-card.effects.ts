import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { ComphubApiService, MarketDataScopeApiService } from 'libs/data/payfactors-api';
import { AddPayMarketRequest, PayMarketDataResponse, MDLocationsRequest } from 'libs/models/payfactors-api';
import * as fromRootState from 'libs/state/state';
import { QuickPriceType } from 'libs/constants';

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
  initMarketsCard$ = this.actions$
  .pipe(
    ofType(fromMarketsCardActions.INIT_MARKETS_CARD),
    withLatestFrom(
      this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
      this.store.select(fromComphubMainReducer.getWorkflowContext),
      (action: fromMarketsCardActions.InitMarketsCard, countryDataSet, workflowContext ) =>
        ({ action, countryDataSet, workflowContext })
    ),
    mergeMap((data) => {
      const actions = [];
      if (!data.countryDataSet && data.workflowContext.quickPriceType === QuickPriceType.ENTERPRISE) {
        return actions;
      }
      if (data.workflowContext.quickPriceType === QuickPriceType.PEER) {
        actions.push(new fromMarketsCardActions.GetPaymarkets({ countryCode: 'All' }));
      } else {
        actions.push(new fromMarketsCardActions.GetPaymarkets({ countryCode: data.countryDataSet.CountryCode }));
      }
      return actions;
    })
  );

  @Effect()
  getPaymarkets$ = this.actions$
    .pipe(
      ofType(fromMarketsCardActions.GET_PAYMARKETS),
      switchMap((action: fromMarketsCardActions.GetPaymarkets) => {
          return this.comphubApiService.getPaymarketData(action.payload.countryCode)
            .pipe(
              mergeMap((paymarketsResponse: PayMarketDataResponse) => {
                const actions = [];
                let payMarkets = PayfactorsApiModelMapper.mapPaymarketsToPricingPayMarkets(paymarketsResponse.AccessiblePayMarkets);
                if (paymarketsResponse.HasPaymarketRestrictions) {
                  actions.push(new fromMarketsCardActions.HideAddNewPaymarketButton());
                  if (!payMarkets.length) {
                    // display national payMarket as a card
                    payMarkets = [MarketsCardHelper.buildDefaultPricingPayMarket()];
                    actions.push(new fromMarketsCardActions.DisplayNationalAsCard(true));
                  } else {
                    actions.push(new fromMarketsCardActions.DisplayNationalAsCard(false));
                  }
                }
                actions.push(new fromMarketsCardActions.GetPaymarketsSuccess(payMarkets));
                actions.push(new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst());

                if (!payMarkets.length) {
                  actions.push(new fromAddPayMarketFormActions.OpenForm({ showSkipButton: true }));
                } else {
                  actions.push(new fromAddPayMarketFormActions.CloseForm());
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
    .pipe(
      ofType(fromMarketsCardActions.GET_MD_SCOPE),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromMarketsCardActions.GetMarketDataScope, countryDataSet) => ({ action, countryDataSet })
      ),
      switchMap((data) => {
        return this.marketDataScopeApiService.getMDScope()
          .pipe(
            map((response) =>
              new fromMarketsCardActions.GetMarketDataScopeSuccess({ response: response, countryDataSet: data.countryDataSet } )
            ),
            catchError((error) => {
              return of(new fromMarketsCardActions.GetMarketDataScopeError(),
                new fromComphubPageActions.HandleApiError(error));
            })
          );
      })
    );

  @Effect()
  getMarketDataLocations$ = this.actions$
    .pipe(
      ofType(fromMarketsCardActions.GET_MD_LOCATIONS),
      debounceTime(200),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromMarketsCardActions.GetMarketDataLocations, countryDataSet) => ({ action, countryDataSet })
      ),
      switchMap((data) => {
        const request: MDLocationsRequest = {
          CountryCode: data.countryDataSet.CountryCode,
          Query: data.action.payload
        };
        return this.marketDataScopeApiService.getMdLocations(request)
          .pipe(
            map((response) =>
              new fromMarketsCardActions.GetMarketDataLocationsSuccess(
                PayfactorsApiModelMapper.mapMdLocationsResponseToMarketDataLocations(response))
            ),
            catchError((error) => {
              return of(new fromMarketsCardActions.GetMarketDataLocationsError(),
                new fromComphubPageActions.HandleApiError(error));
            })
          );
      })
    );

  @Effect()
  savePayMarket$ = this.actions$
    .pipe(
      ofType(fromMarketsCardActions.SAVE_PAYMARKET),
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
    .pipe(
      ofType(fromMarketsCardActions.SET_SELECTED_PAYMARKET),
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
  clearSelectedPayMarket$ = this.actions$
    .pipe(
      ofType(fromMarketsCardActions.SET_TO_DEFAULT_PAYMARKET),
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

  @Effect()
  openPaymarketForm$ = this.actions$
    .pipe(
      ofType(fromAddPayMarketFormActions.OPEN_FORM),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        this.store.select(fromComphubMainReducer.getMarketDataScope),
        (action: fromAddPayMarketFormActions.OpenForm, countryDataSet, marketDataScopes) => ({ countryDataSet, marketDataScopes })
      ),
      mergeMap((data) => {
        const actions = [];
        if (data.marketDataScopes || !data.countryDataSet) {
          return actions;
        }
        actions.push(new fromMarketsCardActions.GetMarketDataScope());
        return actions;
      })
    );

  @Effect()
  closeAddPayMarketForm$ = this.actions$
    .pipe(
      ofType(fromAddPayMarketFormActions.CLOSE_FORM),
      map(() =>
        new fromMarketsCardActions.ClearMarketDataLocations()
      )
    );

  @Effect()
  setDefaultPaymarketAsSelected$ = this.actions$
    .pipe(
      ofType(fromMarketsCardActions.SET_DEFAULT_PAYMARKET_AS_SELECTED),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        (action: fromMarketsCardActions.SetDefaultPaymarketAsSelected, selectedPayMarket) => ({ action, selectedPayMarket })),
        map((data) =>
          new fromComphubPageActions.UpdateCardSubtitle({
            cardId: ComphubPages.Markets,
            subTitle: data.selectedPayMarket.PayMarketName
          })
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) { }
}
