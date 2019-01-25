import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { PayMarketApiService } from 'libs/data/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';

import * as fromMarketsPageActions from '../actions/markets-page.actions';
import * as fromComphubReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';


@Injectable()
export class PaymarketPageEffects {

  @Effect()
  getPaymarkets$ = this.actions$
    .ofType(fromMarketsPageActions.GET_PAYMARKETS)
    .pipe(
        switchMap(() => {
          return this.paymarketApiService.getAll()
            .pipe(
              map((paymarketsResponse: PayMarket[]) =>
                new fromMarketsPageActions.GetPaymarketsSuccess(
                  PayfactorsApiModelMapper.mapPaymarketsToPricingPayMarkets(paymarketsResponse)
                )
              ),
              catchError(() => of(new fromMarketsPageActions.GetPaymarketsError()))
            );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubReducer.State>,
    private paymarketApiService: PayMarketApiService
  ) {}
}
