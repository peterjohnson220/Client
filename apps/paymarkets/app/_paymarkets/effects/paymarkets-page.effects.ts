import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api/index';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

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

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
