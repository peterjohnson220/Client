import { Action } from '@ngrx/store';

export const LOGIN = '[Auth/Login] Login';
export const LOGIN_SUCCESS = '[Auth/Login] Validate Login Success';
export const LOGIN_ERROR = '[Auth/Login] Validate Login Error';
export const LOGIN_SUCCESS_ROUTE_TO_HOME = '[Auth/Login] Validate Login Success Route To Home Page';
export const LOGIN_SUCCESS_ROUTE_TO_NEXT_PAGE = '[Auth/Login] Validate Login Success Route To Next Page Error';
export const LOGIN_401_ERROR = '[Auth/Login] Validate Login 401 Error';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload: any) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public nextPage: string) {}
}

export class LoginError implements Action {
  readonly type = LOGIN_ERROR;
  constructor(public error: any) {}
}

export class LoginSuccessRouteToHome implements Action {
  readonly type = LOGIN_SUCCESS_ROUTE_TO_HOME;
  constructor() {}
}

export class LoginSuccessRouteToNextPage implements Action {
  readonly type = LOGIN_SUCCESS_ROUTE_TO_NEXT_PAGE;
  constructor(public nextPage: string) {}
}

export class Login401Error implements Action {
  readonly type = LOGIN_401_ERROR;
  constructor() { }
}
export type Actions
  = Login
  | LoginSuccess
  | LoginError
  | LoginSuccessRouteToHome
  | LoginSuccessRouteToNextPage
  | Login401Error;
