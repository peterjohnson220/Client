import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { NavigationApiService } from 'libs/data/payfactors-api';

import * as fromUserVoiceActions from '../actions/user-voice.actions';

@Injectable()
export class UserVoiceEffects {

  @Effect()
  userVoiceLink$ = this.actions$
    .pipe(
      ofType(fromUserVoiceActions.LOADING_USER_VOICE),
      switchMap(() =>
        this.navigationApiService.getUserVoiceLink().pipe(
          map((userVoiceLink: any) => new fromUserVoiceActions.LoadingUserVoiceSuccess(userVoiceLink)),
          catchError(error => of (new fromUserVoiceActions.LoadingUserVoiceError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService
  ) {}
}
