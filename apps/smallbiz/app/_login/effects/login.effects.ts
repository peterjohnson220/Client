import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as fromLoginAction from '../actions/login.actions';
import * as fromUserContextAction from '../../shared/actions/user-context.actions';

@Injectable()
export class LoginEffects {
  @Effect()
  login: Observable<Action> = this.actions$
    .pipe(
      ofType(fromLoginAction.LOGIN),
      switchMap((action: fromLoginAction.Login) => {
        // TODO: Call out to authentication service to validate login
        return of(new fromLoginAction.LoginSuccess({ emailAddress: action.payload.emailAddress, name: action.payload.emailAddress }));
      })
    );

  // @Effect()
  // loginSuccess: Observable<Action> = this.actions$
  //   .ofType(fromLoginAction.LOGIN_SUCCESS).pipe(
  //     switchMap((action: fromLoginAction.LoginSuccess) => {
  //       return of(new fromUserContextAction.Set({ emailAddress: action.payload.emailAddress, name: action.payload.emailAddress }));
  //     })
  //   );

  @Effect({ dispatch: false })
  loginSuccessRouteToHome = this.actions$
    .pipe(
      ofType(fromLoginAction.LOGIN_SUCCESS),
      map((action: fromLoginAction.LoginSuccess) => {
        this.router.navigate(['/job-search']);
      })
    );

  constructor(private actions$: Actions, private router: Router) {}
}
