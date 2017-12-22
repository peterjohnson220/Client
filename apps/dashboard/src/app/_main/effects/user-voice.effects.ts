import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { NavigationApiService } from 'libs/data/payfactors-api';

import * as fromUserVoiceActions from '../actions/user-voice.actions';

@Injectable()
export class UserVoiceEffects {

  @Effect()
  userVoiceLink$ = this.actions$
    .ofType(fromUserVoiceActions.LOADING_USER_VOICE)
    .switchMap(() =>
      this.navigationApiService
        .getUserVoiceLink()
        .map((userVoiceLink: any) => new fromUserVoiceActions.LoadingUserVoiceSuccess(userVoiceLink))
        .catch(error => of (new fromUserVoiceActions.LoadingUserVoiceError(error)))
    );

  constructor(
    private actions$: Actions,
    private navigationApiService: NavigationApiService
  ) {}
}
