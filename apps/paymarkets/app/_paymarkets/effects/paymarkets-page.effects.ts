import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api/index';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPayMarketModalActions from 'libs/features/paymarket-management/actions/paymarket-modal.actions';

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
      map(() =>
        new fromPfDataGridActions.LoadData(PayMarketsPageViewId)
      )
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

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
