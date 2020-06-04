import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CaptchaApiService } from 'libs/data/payfactors-api/captcha';

import * as fromCaptchaActions from '../actions/captcha.actions';

@Injectable()
export class CaptchaEffects {

  @Effect()
  getSiteKey$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromCaptchaActions.GetSiteKey>(fromCaptchaActions.GET_SITE_KEY),
      switchMap(action =>
        this.captchaApiService.getRecaptchaSiteKey()
          .pipe(
            map((response) => {
              return new fromCaptchaActions.GetSiteKeySuccess({
                siteKey: response
              });
            }),
            catchError(error => of(new fromCaptchaActions.GetSiteKeyError()))
          )
      )
    );

  constructor(
    private actions$: Actions,
    private captchaApiService: CaptchaApiService
  ) {
  }
}
