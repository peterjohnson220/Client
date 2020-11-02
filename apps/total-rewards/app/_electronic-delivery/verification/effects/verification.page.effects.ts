import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { TotalRewardsEDeliveryApiService } from 'libs/data/payfactors-api/total-rewards';
import { TokenStatusResponse, DeliveryResponse, StatementDownloadResponse } from 'libs/models/payfactors-api/total-rewards/response';

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
          map((response: TokenStatusResponse) => new fromPageActions.RequestTokenSuccess({
            tokenStatus: response.Status,
            resent: action.payload.resend,
            lockedUntil: response.LockedUntil })),
          catchError(error => of(new fromPageActions.RequestTokenError()))
        ))
    );

  @Effect()
  validateToken$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromPageActions.VALIDATE_TOKEN),
      switchMap((action: fromPageActions.ValidateToken) =>
        this.totalRewardsApiService.deliverData({
          Token: action.payload
        }).pipe(
          map((response: DeliveryResponse) => {
            if (response.EmployeeData?.EmployeeDOH) {
              response.EmployeeData.EmployeeDOH = new Date(response.EmployeeData.EmployeeDOH);
            }
            if (response.EmployeeData?.EmployeeDOB) {
              response.EmployeeData.EmployeeDOB = new Date(response.EmployeeData.EmployeeDOB);
            }
            if (response.Statement) {
              response.Statement.EffectiveDate = new Date();
            }
            return new fromPageActions.ValidateTokenSuccess(response);
          }),
          catchError(error => of(new fromPageActions.ValidateTokenError()))
        ))
    );

  @Effect()
  getStatementDownload$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromPageActions.START_DOWNLOAD_PDF),
      switchMap((action: fromPageActions.StartDownloadPdf) =>
        this.totalRewardsApiService.getStatementDownload().pipe(
          map((response: StatementDownloadResponse) => {
            if (!!response.FileDownloadLink) {
              return new fromPageActions.DownloadPdfSuccess(response.FileDownloadLink);
            } else {
              return new fromPageActions.StartDownloadPdfSuccess();
            }
          }),
          catchError(error => of(new fromPageActions.ValidateTokenError()))
        ))
    );

  @Effect({dispatch: false})
  downloadStatementSuccess$: Observable<Action> =
    this.actions$.pipe(
      ofType(fromPageActions.DOWNLOAD_PDF_SUCCESS),
      tap((action: fromPageActions.DownloadPdfSuccess) => {
        window.location.href = action.payload;
      })
    );

  constructor(
    private actions$: Actions,
    private totalRewardsApiService: TotalRewardsEDeliveryApiService
  ) { }
}
