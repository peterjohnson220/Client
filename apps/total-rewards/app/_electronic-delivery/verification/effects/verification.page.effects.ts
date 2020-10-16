import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map,  catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { TotalRewardsEDeliveryApiService } from 'libs/data/payfactors-api/total-rewards';
import { TokenValidationResponse } from 'libs/models/payfactors-api/total-rewards/response';

import * as fromPageActions from '../actions/verification.page.actions';

@Injectable()
export class VerificationPageEffects {

  @Effect()
  requestDeliveryToken$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromPageActions.REQUEST_TOKEN),
      switchMap((action: fromPageActions.RequestToken) =>
        this.totalRewardsApiService.requestDeliveryToken({
          Resend: action.payload.resend,
          SuppressEmail: action.payload.suppressEmail
        }).pipe(
          map(() => new fromPageActions.RequestTokenSuccess()),
          catchError(error => of(new fromPageActions.RequestTokenError()))
        ))
    );

  @Effect()
  validateToken$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromPageActions.VALIDATE_TOKEN),
      switchMap((action: fromPageActions.ValidateToken) =>
        this.totalRewardsApiService.validateToken({
          Token: action.payload
        }).pipe(
          map((response: TokenValidationResponse) => new fromPageActions.ValidateTokenSuccess(response)),
          catchError(error => of(new fromPageActions.ValidateTokenError()))
        ))
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsEDeliveryApiService
  ) { }
}
