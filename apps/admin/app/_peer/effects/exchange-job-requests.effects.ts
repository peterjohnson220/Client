import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import { GridHelperService } from '../services';
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

  @Effect()
  approveExchangeJobRequest$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobRequestsActions.APPROVE_EXCHANGE_JOB_REQUEST).pipe(
      map((action: fromExchangeJobRequestsActions.ApproveExchangeJobRequest) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.approveExchangeJobRequest(payload).pipe(
          map(() => {
            this.gridHelperService.loadExchangeJobRequests(payload.ExchangeId);
            return new fromExchangeJobRequestsActions.ApproveExchangeJobRequestSuccess();
          }),
          catchError( error => of(new fromExchangeJobRequestsActions.ApproveExchangeJobRequestError()))
        );
      })
    );

  @Effect()
  denyExchangeJobRequest$: Observable<Action> = this.actions$
    .ofType(fromExchangeJobRequestsActions.DENY_EXCHANGE_JOB_REQUEST).pipe(
      map((action: fromExchangeJobRequestsActions.DenyExchangeJobRequest) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.denyExchangeJobRequest(payload).pipe(
          map(() => {
            this.gridHelperService.loadExchangeJobRequests(payload.ExchangeId);
            return new fromExchangeJobRequestsActions.DenyExchangeJobRequestSuccess();
          }),
          catchError( error => of(new fromExchangeJobRequestsActions.DenyExchangeJobRequestError))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}
