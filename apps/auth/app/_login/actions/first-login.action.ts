import { Action } from '@ngrx/store';

export const VALIDATE_FIRST_LOGIN = '[Auth/First Login] Validate First Login';
export const VALIDATE_FIRST_LOGIN_SUCCESS = '[Auth/First Login] Validate First Login Success';
export const VALIDATE_FIRST_LOGIN_ERROR = '[Auth/First Login] Validate First Login Error';
export const FIRST_LOGIN_UPDATING_PASSWORD = '[Auth/First Login] Updating Password';
export const FIRST_LOGIN_UPDATING_PASSWORD_SUCCESS = '[Auth/First Login] Updating Password Success';
export const FIRST_LOGIN_UPDATING_PASSWORD_ERROR = '[Auth/First Login] Updating Password Error';

export class ValidateFirstLogin implements Action {
  readonly type = VALIDATE_FIRST_LOGIN;
  constructor() {}
}

export class ValidateFirstLoginSuccess implements Action {
  readonly type = VALIDATE_FIRST_LOGIN_SUCCESS;
  constructor() {}
}

export class ValidateFirstLoginError implements Action {
  readonly type = VALIDATE_FIRST_LOGIN_ERROR;
  constructor() {}
}

export class UpdatePassword implements Action {
  readonly type = FIRST_LOGIN_UPDATING_PASSWORD;
  constructor(public payload: any) {}
}

export class UpdatePasswordSuccess implements Action {
  readonly type = FIRST_LOGIN_UPDATING_PASSWORD_SUCCESS;
  constructor() {}
}

export class UpdatePasswordError implements Action {
  readonly type = FIRST_LOGIN_UPDATING_PASSWORD_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = ValidateFirstLogin
  | ValidateFirstLoginSuccess
  | ValidateFirstLoginError
  | UpdatePassword
  | UpdatePasswordSuccess
  | UpdatePasswordError;
