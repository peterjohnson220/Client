import { Action } from '@ngrx/store';

export const LOGIN = '[Auth/Login] Login';
export const LOGIN_SUCCESS = '[Auth/Login] Validate Login Success';
export const LOGIN_ERROR = '[Auth/Login] Validate Login Error';
export const LOGIN_SUCCESS_ROUTE_TO_HOME = '[Auth/Login] Validate Login Success Route To Home Page';
export const LOGIN_SUCCESS_ROUTE_TO_NEXT_PAGE = '[Auth/Login] Validate Login Success Route To Next Page';
export const LOGIN_SUCCESS_ROUTE_TO_USER_VOICE = '[Auth/Login] Validate Login Success Route To User Voice';
export const LOGIN_401_ERROR = '[Auth/Login] Validate Login 401 Error';
export const PASSWORD_EXPIRED = '[Auth/Login] Password expired';
export const GET_LOGIN_SETTINGS = '[Auth/Login] Get Login Settings';
export const GET_LOGIN_SETTINGS_SUCCESS = '[Auth/Login] Get Login Settings Success';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload: any) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: string) {}
}

export class LoginError implements Action {
  readonly type = LOGIN_ERROR;
  constructor(public payload: any) {}
}

export class LoginSuccessRouteToHome implements Action {
  readonly type = LOGIN_SUCCESS_ROUTE_TO_HOME;
  constructor() {}
}

export class LoginSuccessRouteToNextPage implements Action {
  readonly type = LOGIN_SUCCESS_ROUTE_TO_NEXT_PAGE;
  constructor(public payload: string) {}
}

export class LoginSuccessRouteToUserVoice implements Action {
  readonly type = LOGIN_SUCCESS_ROUTE_TO_USER_VOICE;
  constructor(public payload: string) {}
}

export class Login401Error implements Action {
  readonly type = LOGIN_401_ERROR;
  constructor() { }
}

export class PasswordExpired implements Action {
  readonly type = PASSWORD_EXPIRED;
  constructor() {}
}

export class GetLoginSettings implements Action {
  readonly type = GET_LOGIN_SETTINGS;
  constructor() {}
}

export class GetLoginSettingsSuccess implements Action {
  readonly type = GET_LOGIN_SETTINGS_SUCCESS;
  constructor(public payload: any) {}
}

export type Actions
  = Login
  | LoginSuccess
  | LoginError
  | LoginSuccessRouteToHome
  | LoginSuccessRouteToNextPage
  | LoginSuccessRouteToUserVoice
  | Login401Error
  | PasswordExpired
  | GetLoginSettings
  | GetLoginSettingsSuccess;
