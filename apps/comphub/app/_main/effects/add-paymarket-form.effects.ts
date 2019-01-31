import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { PayMarketApiService } from 'libs/data/payfactors-api';

import * as fromAddPayMarketFormActions from '../actions/add-paymarket-form.actions';

@Injectable()
export class AddPayMarketFormEffects {

  @Effect()
  save$ = this.actions$
  .ofType(fromAddPayMarketFormActions.SAVE_PAYMARKET)
  .pipe(
    switchMap((action: fromAddPayMarketFormActions.Save) => {
      return this.payMarketApiService.insert(action.payload)
        .pipe(
          map(response =>
            new fromAddPayMarketFormActions.SaveSuccess({ companyPayMarketId: response.CompanyPayMarketId })
          ),
          catchError(response => {
            return of(response.status === 400
              ? new fromAddPayMarketFormActions.SaveConflict()
              : new fromAddPayMarketFormActions.SaveError());
          })
        );
    })
  );

  constructor(
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
