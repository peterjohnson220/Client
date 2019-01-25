import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { PayMarketApiService } from 'libs/data/payfactors-api';

import * as fromAddPayMarketModalActions from '../actions/add-paymarket-modal.actions';

@Injectable()
export class AddPayMarketModalEffects {

  @Effect()
  save$ = this.actions$
  .ofType(fromAddPayMarketModalActions.SAVE_PAYMARKET)
  .pipe(
    switchMap((action: fromAddPayMarketModalActions.Save) => {
      return this.payMarketApiService.insert(action.payload)
        .pipe(
          map(response =>
            new fromAddPayMarketModalActions.SaveSuccess({ companyPayMarketId: response.CompanyPayMarketId })
          ),
          catchError(response => {
            return of(response.status === 400
              ? new fromAddPayMarketModalActions.SaveConflict()
              : new fromAddPayMarketModalActions.SaveError());
          })
        );
    })
  );

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
