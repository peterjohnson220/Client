import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map} from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromPendingExchangeAccessRequestsActions from '../actions/pending-exchange-access-requests.actions';

@Injectable()
export class PendingExchangeAccessRequestsEffects {

  @Effect()
  loadPendingExchangeAccessRequests$: Observable<Action> = this.actions$
    .ofType(fromPendingExchangeAccessRequestsActions.LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS).pipe(
      map((action: fromPendingExchangeAccessRequestsActions.LoadPendingExchangeAccessRequests) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.getPendingExchangeAccessRequests(payload.exchangeId).pipe(
          map((pendingExchangeAccessRequestsResult: GridDataResult) => {
            return new fromPendingExchangeAccessRequestsActions
              .LoadPendingExchangeAccessRequestsSuccess(pendingExchangeAccessRequestsResult);
          }),
          catchError(error => of(new fromPendingExchangeAccessRequestsActions.LoadPendingExchangeAccessRequestsError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
