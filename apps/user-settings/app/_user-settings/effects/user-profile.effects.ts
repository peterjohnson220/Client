import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';

import * as fromUserProfileActions from '../actions/user-profile.actions';

@Injectable()
export class UserProfileEffects {

  @Effect()
  saveUserProfile$ = this.actions$
    .pipe(
      ofType(fromUserProfileActions.SAVE_USER_PROFILE),
      switchMap((action: fromUserProfileActions.SaveUserProfile) => {
        return this.userProfileApiService.saveUserProfile(action.payload)
          .pipe(
            map(() => new fromUserProfileActions.SaveUserProfileSuccess(action.payload)),
            catchError(() => of(new fromUserProfileActions.SaveUserProfileError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService
  ) {}
}
