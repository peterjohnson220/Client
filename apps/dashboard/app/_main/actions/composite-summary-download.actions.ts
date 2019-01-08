import { Action } from '@ngrx/store';
import { Params } from '@angular/router';

export const AUTH_REDIRECT_ATTEMPTED = '[Dashboard/Composite Summary Download] Auth Redirect Attempted';

export class AuthRedirectAttempted implements Action {
  readonly type = AUTH_REDIRECT_ATTEMPTED;

  constructor(public payload: Params) {}
}

