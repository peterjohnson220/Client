import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { UserApiService } from 'libs/data/payfactors-api/user/user-api.service';

import * as fromChangePasswordActions from '../actions/change-password.actions';

@Injectable()
export class ChangePasswordEffects {
  @Effect()
  ChangePassword$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromChangePasswordActions.CHANGE_PASSWORD),
      switchMap((action: fromChangePasswordActions.ChangePassword) =>
        this.userApiService.changePassword(action.payload.CurrentPassword, action.payload.NewPassword).pipe(
          map(() => new fromChangePasswordActions.ChangePasswordSuccess()),
          catchError(error => of(new fromChangePasswordActions.ChangePasswordError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userApiService: UserApiService
  ) {
  }
}
