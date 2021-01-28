import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { PayMarketApiService } from 'libs/data/payfactors-api';

import * as fromPayMarketAssociationsActions from '../actions/paymarket-association.actions';
import * as fromPayMarketManagementReducer from '../reducers';

@Injectable()
export class PaymarketAssociationsEffects {

  @Effect()
  loadPayMarket$ = this.actions$
    .pipe(
      ofType(fromPayMarketAssociationsActions.LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY),
      switchMap((action: fromPayMarketAssociationsActions.LoadPaymarketAssociationsSummary) => {
        return this.payMarketApiService.getPayMarketAssociationsSummary(action.payload)
          .pipe(
            map((response) => new fromPayMarketAssociationsActions.LoadPaymarketAssociationsSummarySuccess(response)),
            catchError(() => of(new fromPayMarketAssociationsActions.LoadPaymarketAssociationsSummaryError()))
          );
      })
    );

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
