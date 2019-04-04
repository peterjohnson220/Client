import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { PayMarketApiService } from 'libs/data/payfactors-api';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import * as fromRootState from 'libs/state/state';

import * as fromAddPayMarketFormActions from '../actions/add-paymarket-form.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { MarketsCardHelper, PayfactorsApiModelMapper } from '../helpers';
import * as fromComphubMainReducer from '../reducers';

@Injectable()
export class AddPayMarketFormEffects {

  @Effect()
  savePaymarket$ = this.actions$
  .ofType(fromAddPayMarketFormActions.SAVE_PAYMARKET)
  .pipe(
    switchMap((action: fromAddPayMarketFormActions.SavePaymarket) => {
      return this.payMarketApiService.insert(action.payload)
        .pipe(
          map(response =>
            new fromAddPayMarketFormActions.SavePaymarketSuccess(
              PayfactorsApiModelMapper.mapPaymarketsToPricingPayMarkets([response])[0])
          ),
          catchError(response => {
            return of(response.status === 400
              ? new fromAddPayMarketFormActions.SavePaymarketConflict()
              : new fromAddPayMarketFormActions.SavePaymarketError(),
              new fromComphubPageActions.HandleApiError(response));
          })
        );
    })
  );

  @Effect()
  closeInfoBanner$ = this.actions$
    .ofType(fromAddPayMarketFormActions.CLOSE_INFO_BANNER)
    .pipe(
      map(() =>
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
      map(() =>
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

  @Effect()
  savePayMarketSuccess$ = this.actions$
    .ofType(fromAddPayMarketFormActions.SAVE_PAYMARKET_SUCCESS)
    .pipe(
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromAddPayMarketFormActions.SavePaymarketSuccess, countryDataSet) => ({ action, countryDataSet })
      ),
      mergeMap((data) => {
        return [
          new fromAddPayMarketFormActions.CloseForm(),
          new fromMarketsCardActions.GetPaymarkets({ countryCode: data.countryDataSet.CountryCode }),
          new fromMarketsCardActions.SetSelectedPaymarket(data.action.payload),
          new fromMarketsCardActions.SetPaymarketFilter('')
        ];
      })
    );

  @Effect()
  closeForm$ = this.actions$
    .ofType(fromAddPayMarketFormActions.CLOSE_FORM)
    .pipe(
        map(() => new fromMarketsCardActions.OrderPayMarketsWithSelectedFirst())
    );

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService,
    private store: Store<fromComphubMainReducer.State>,
  ) {}
}
