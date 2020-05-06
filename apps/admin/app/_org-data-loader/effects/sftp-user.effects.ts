import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';

import { SftpUserApiService } from 'libs/data/payfactors-api/data-loads';
import { SftpUserModel } from 'libs/models/Sftp';

import * as fromSftpUserActions from '../actions/sftp-user.actions';

@Injectable()
export class SftpUserEffects {

  @Effect()
  loadSftpUser$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSftpUserActions.GET_SFTP_USER),
      switchMap((action: fromSftpUserActions.GetSftpUser) =>
        this.sftpUserApiService.getSftpUser(action.payload).pipe(
          map((sftpUser: SftpUserModel) => {
            return new fromSftpUserActions.GetSftpUserSuccess(sftpUser);
          }),
          catchError(error => of(new fromSftpUserActions.GetSftpUserError()))
        )
      )
    );

  @Effect()
  validateUsername$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSftpUserActions.VALIDATE_USERNAME),
      switchMap((action: fromSftpUserActions.ValidateUsername) =>
        this.sftpUserApiService.validateUserName(action.payload).pipe(
          map((isValid: boolean) => {
            return new fromSftpUserActions.ValidateUsernameSuccess(isValid);
          }),
          catchError(error => of(new fromSftpUserActions.ValidateUsernameError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private sftpUserApiService: SftpUserApiService
  ) {}
}
