import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';

import * as fromPaymarketActions from '../actions/paymarkets.actions';
import * as fromAddJobsReducers from '../reducers';
import { PayfactorsAddJobsApiModelMapper } from '../helpers';


@Injectable()
export class PaymarketEffects {

  @Effect()
  loadPaymarkets$ = this.actions$
    .ofType(fromPaymarketActions.LOAD_PAYMARKETS)
    .pipe(
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
        }
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromAddJobsReducers.State>,
    private paymarketApiService: PayMarketApiService
  ) {}
}
