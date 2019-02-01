import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { AddPayMarketRequest } from 'libs/models/payfactors-api';
import * as fromRootState from 'libs/state/state';
import { MarketDataScopeApiService } from 'libs/data/payfactors-api';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromComphubMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromAddPayMarketFormActions from '../actions/add-paymarket-form.actions';
import { MarketsCardHelper } from '../helpers';

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
                if (paymarketsResponse.length === 0) {
                  actions.push(new fromAddPayMarketFormActions.Open());
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
      return new fromAddPayMarketFormActions.Save(request);
    })
  );

  @Effect()
  savePayMarketSuccess$ = this.actions$
  .ofType(fromAddPayMarketFormActions.SAVE_PAYMARKET_SUCCESS)
  .pipe(
    mergeMap((data) => {
      return [
        new fromAddPayMarketFormActions.Close(),
        new fromMarketsCardActions.GetPaymarkets()
      ];
    })
  );

  @Effect()
  closeInfoBanner$ = this.actions$
  .ofType(fromAddPayMarketFormActions.CLOSE_INFO_BANNER)
  .pipe(
    map((action: fromAddPayMarketFormActions.CloseInfoBanner) =>
      new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
        FeatureArea: FeatureAreaConstants.CompHub,
        SettingName: UiPersistenceSettingConstants.CompHubAddPayMarketFormDismissInfoBanner,
        SettingValue: 'true'
      })
    )
  );

  @Effect()
  openAddPayMarketForm$ = this.actions$
  .ofType(fromAddPayMarketFormActions.OPEN_FORM)
  .pipe(
    map((action: fromAddPayMarketFormActions.Open) =>
      new fromAddPayMarketFormActions.GetDismissInfoBannerSetting()
    )
  );

  @Effect()
  getDismissInfoBannerSetting$ = this.actions$
  .ofType(fromAddPayMarketFormActions.GET_DISMISS_INFO_BANNER_SETTING)
  .pipe(
    withLatestFrom(
      this.store.select(fromRootState.getUiPersistenceSettings),
      (action, userSettings) => ({ action, userSettings })),
    map((data) => {
      const dismiss = MarketsCardHelper.getDismissInfoBannerSetting(data.userSettings);
      if (dismiss) {
        return new fromAddPayMarketFormActions.CloseInfoBanner();
      }
      return new fromAddPayMarketFormActions.OpenInfoBanner();
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private paymarketApiService: PayMarketApiService,
    private marketDataScopeApiService: MarketDataScopeApiService
  ) {}
}
