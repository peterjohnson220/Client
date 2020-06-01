import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { PayMarketApiService } from 'libs/data/payfactors-api';

import * as fromPayMarketModalActions from '../actions/paymarket-modal.actions';

@Injectable()
export class PayMarketModalEffects {

  @Effect()
  loadPayMarket$ = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.LOAD_PAY_MARKET),
      switchMap((action: fromPayMarketModalActions.LoadPayMarket) => {
        return this.payMarketApiService.getPayMarketWithMdScope(action.payload.payMarketId)
          .pipe(
            map((response) => new fromPayMarketModalActions.LoadPayMarketSuccess(response)),
            catchError(() => of(new fromPayMarketModalActions.LoadPayMarketError()))
          );
      })
    );

  @Effect()
  getDefaultPayMarket$ = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.LOAD_USER_DEFAULT_PAY_MARKET),
      switchMap((action: fromPayMarketModalActions.LoadUserDefaultPayMarket) => {
        return this.payMarketApiService.getDefaultUserPayMarket()
          .pipe(
            map((response) => new fromPayMarketModalActions.LoadPayMarketSuccess(response)),
            catchError(() => of(new fromPayMarketModalActions.LoadPayMarketError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
