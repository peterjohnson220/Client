import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromExchangeJobRequestsActions from '../actions/exchange-job-requests.actions';

@Injectable()
export class ExchangeJobRequestsEffects {

  @Effect()
  loadExchangeJobRequests$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobRequestsActions.LOAD_EXCHANGE_JOB_REQUESTS).pipe(
      map((action: fromExchangeJobRequestsActions.LoadExchangeJobRequests) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.getPendingExchangeJobRequests(payload.exchangeId).pipe(
          map((exchangeJobRequestsResult: GridDataResult) => {
            return new fromExchangeJobRequestsActions.LoadExchangeJobRequestsSuccess(exchangeJobRequestsResult);
          }),
          catchError(error => of(new fromExchangeJobRequestsActions.LoadExchangeJobRequestsError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
