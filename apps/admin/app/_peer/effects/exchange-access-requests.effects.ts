import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map} from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromExchangeAccessRequestsActions from '../actions/exchange-access-requests.actions';

@Injectable()
export class ExchangeAccessRequestsEffects {

  @Effect()
  loadExchangeAccessRequests$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeAccessRequestsActions.LOAD_EXCHANGE_ACCESS_REQUESTS),
      map((action: fromExchangeAccessRequestsActions.LoadExchangeAccessRequests) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.getPendingExchangeAccessRequests(payload.exchangeId).pipe(
          map((exchangeAccessRequestsResult: GridDataResult) => {
            return new fromExchangeAccessRequestsActions
              .LoadExchangeAccessRequestsSuccess(exchangeAccessRequestsResult);
          }),
          catchError(error => of(new fromExchangeAccessRequestsActions.LoadExchangeAccessRequestsError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
