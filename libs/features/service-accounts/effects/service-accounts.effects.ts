import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ServiceAccountApiService } from 'libs/data/payfactors-api/service-accounts';
import * as fromServiceAccountsActions from '../actions';

@Injectable()
export class ServiceAccountsEffects {
  @Effect()
  createAccount$: Observable<Action> = this.actions$.pipe(
    ofType<fromServiceAccountsActions.CreateServiceAccount>(fromServiceAccountsActions.CREATE_SERVICE_ACCOUNT),
    mergeMap(action =>
      this.serviceAccountApi.createAccount(action.payload).pipe(
        map(serviceAccount => new fromServiceAccountsActions.CreateServiceAccountSuccess(serviceAccount)),
        catchError(error => of(new fromServiceAccountsActions.CreateServiceAccountError()))
      )
    )
  );

  @Effect()
  getAccountStatus$: Observable<Action> = this.actions$.pipe(
    ofType<fromServiceAccountsActions.GetAccountStatus>(fromServiceAccountsActions.GET_ACCOUNT_STATUS),
    mergeMap(action =>
      this.serviceAccountApi.getAccountStatus(action.payload).pipe(
        map(accountStatus => new fromServiceAccountsActions.GetAccountStatusSuccess(accountStatus)),
        catchError(error => of(new fromServiceAccountsActions.GetAccountStatusError()))
      )
    )
  );

  @Effect()
  resetAccount$: Observable<Action> = this.actions$.pipe(
    ofType<fromServiceAccountsActions.ResetServiceAccount>(fromServiceAccountsActions.RESET_SERVICE_ACCOUNT),
    mergeMap(action =>
      this.serviceAccountApi.resetAccount(action.payload).pipe(
        map(serviceAccount => new fromServiceAccountsActions.ResetServiceAccountSuccess(serviceAccount)),
        catchError(error => of(new fromServiceAccountsActions.ResetServiceAccountError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private serviceAccountApi: ServiceAccountApiService
  ) { }
}
