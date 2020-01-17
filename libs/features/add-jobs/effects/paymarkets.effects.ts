import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';

import { PayfactorsAddJobsApiModelMapper } from '../helpers';
import * as fromPaymarketActions from '../actions/paymarkets.actions';
import * as fromPaymarketReducer from '../reducers';

@Injectable()
export class PaymarketEffects {

  @Effect()
  loadPaymarkets$ = this.actions$
    .pipe(
      ofType(fromPaymarketActions.LOAD_PAYMARKETS),
      switchMap(() => {
        return this.paymarketApiService.getAll()
          .pipe(
            map((paymarketsResponse: PayMarket[]) =>
              new fromPaymarketActions.LoadPaymarketsSuccess(
                PayfactorsAddJobsApiModelMapper.mapPaymarketsToJobPayMarkets(paymarketsResponse)
              )
            ),
            catchError(() => of(new fromPaymarketActions.LoadPaymarketsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromPaymarketReducer.State>,
    private paymarketApiService: PayMarketApiService
  ) {}
}
