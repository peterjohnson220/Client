import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api/index';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPayMarketModalActions from 'libs/features/paymarkets/paymarket-management/actions/paymarket-modal.actions';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { PagingOptions } from 'libs/models/payfactors-api';

import * as fromPayMarketsPageActions from '../actions/paymarkets-page.actions';
import { PayMarketsPageViewId } from '../models';

@Injectable()
export class PayMarketsPageEffects {

  @Effect()
  setDefaultPayMarket$ = this.actions$
    .pipe(
      ofType(fromPayMarketsPageActions.SET_DEFAULT_PAYMARKET),
      switchMap((action: fromPayMarketsPageActions.SetDefaultPayMarket) => {
        return this.payMarketApiService.setDefaultPayMarket(action.payload)
          .pipe(
            map(() => new fromPayMarketsPageActions.SetDefaultPayMarketSuccess()),
            catchError(() => of(new fromPayMarketsPageActions.SetDefaultPayMarketError()))
          );
      })
    );

  @Effect()
  setDefaultPayMarketSuccess$ = this.actions$
    .pipe(
      ofType(fromPayMarketsPageActions.SET_DEFAULT_PAYMARKET_SUCCESS),
      mergeMap(() => {
        const pagingOptions: PagingOptions = {
          From: 0,
          Count: 40
        };
        return [
          new fromPfDataGridActions.ResetGridScrolled(PayMarketsPageViewId),
          new fromPfDataGridActions.UpdatePagingOptions(PayMarketsPageViewId, pagingOptions)
        ];
      })
    );

  @Effect()
  savePayMarketSuccess = this.actions$
    .pipe(
      ofType(
        fromPayMarketModalActions.ADD_PAY_MARKET_SUCCESS,
        fromPayMarketModalActions.UPDATE_PAY_MARKET_SUCCESS),
      mergeMap(() => {
        const actions = [];
        actions.push(new fromPayMarketModalActions.ClosePayMarketModal());
        actions.push(new fromPfDataGridActions.LoadData(PayMarketsPageViewId));
        return actions;
      })
    );

  @Effect()
  deletePayMarketSuccess$ = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.DELETE_PAY_MARKET_SUCCESS),
      mergeMap(() => {
        const actions = [];
        actions.push(new fromPayMarketModalActions.CloseDeletePayMarketModal());
        actions.push(new fromPfDataGridActions.LoadData(PayMarketsPageViewId));
        return actions;
      })
    );

  @Effect()
  savePageViewStyle$ = this.actions$.pipe(
    ofType(fromPayMarketsPageActions.SAVE_PAGE_VIEW_STYLE),
    map((action: fromPayMarketsPageActions.SavePageViewStyle) => {
      return new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
        FeatureArea: FeatureAreaConstants.PayMarkets,
        SettingName: UiPersistenceSettingConstants.PayMarketsPageViewStyleSelection,
        SettingValue: action.viewName
      });
    })
  );

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
