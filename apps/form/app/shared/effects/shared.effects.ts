import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromSharedActions from '../actions/shared.actions';

@Injectable()
export class SharedEffects {

  @Effect({ dispatch: false })
  redirectFormSubmissionSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromSharedActions.SubmitFormSuccess>(fromSharedActions.SUBMIT_FORM_SUCCESS),
      map(action => {
        if (!!action.payload.formSubmissionResponse.RedirectUrl) {
          window.location.href = action.payload.formSubmissionResponse.RedirectUrl;
        } else {
          this.router.navigateByUrl(`${this.router.url}/success`);
        }
        return null;
      })
    );

  constructor(private actions$: Actions, private router: Router) { }
}
