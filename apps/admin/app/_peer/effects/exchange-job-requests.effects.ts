import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeRequestActionEnum } from 'libs/models/peer';

import { GridHelperService } from '../services';
import * as fromExchangeJobRequestsActions from '../actions/exchange-job-requests.actions';
import * as fromPeerAdminReducer from '../reducers';

@Injectable()
export class ExchangeJobRequestsEffects {

  @Effect()
  loadExchangeJobRequests$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobRequestsActions.LOAD_EXCHANGE_JOB_REQUESTS),
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
  approveExchangeJobRequest$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobRequestsActions.APPROVE_EXCHANGE_JOB_REQUEST),
      map((action: fromExchangeJobRequestsActions.ApproveExchangeJobRequest) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.exchangeJobRequestAction(payload, '', ExchangeRequestActionEnum.Approve).pipe(
          map(() => {
            this.gridHelperService.loadExchangeJobRequests(payload.ExchangeId);
            this.gridHelperService.loadExchangeJobs(payload.ExchangeId);
            return new fromExchangeJobRequestsActions.ApproveExchangeJobRequestSuccess();
          }),
          catchError( error => of(new fromExchangeJobRequestsActions.ApproveExchangeJobRequestError()))
        );
      })
    );

  @Effect()
  denyExchangeJobRequest$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeJobRequestsActions.DENY_EXCHANGE_JOB_REQUEST),
      map((action: fromExchangeJobRequestsActions.DenyExchangeJobRequest) => action.payload),
      withLatestFrom(this.store.pipe(select(fromPeerAdminReducer.getSelectedExchangeJobRequest)),
        (actionPayload, storePayload) => {
            return { actionPayload, storePayload };
          }
        ),
      switchMap(payload => {
        return this.exchangeApiService.exchangeJobRequestAction(payload.storePayload, payload.actionPayload, ExchangeRequestActionEnum.Deny)
          .pipe(map(() => {
            this.gridHelperService.loadExchangeJobRequests(payload.storePayload.ExchangeId);
            return new fromExchangeJobRequestsActions.DenyExchangeJobRequestSuccess();
          }),
          catchError( error => of(new fromExchangeJobRequestsActions.DenyExchangeJobRequestError))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService,
    private store: Store<fromPeerAdminReducer.State>
  ) {}
}
