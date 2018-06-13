import {Action} from '@ngrx/store';

export const RESET_PASSWORD = '[Auth/Reset Password] Resetting Password';
export const RESET_PASSWORD_SUCCESS = '[Auth/Reset Password] Resetting Password Success';
export const RESET_PASSWORD_ERROR = '[Auth/Reset Password] Resetting Password Error';
export const RESET_PASSWORD_TOKEN_EXPIRED = '[Auth/Reset Password] Resetting Password Token Expired';
export const CHECK_RESET_PASSWORD_TOKEN = '[Auth/Reset Password] Checking Password Token';
export const CHECK_RESET_PASSWORD_TOKEN_SUCCESS = '[Auth/Reset Password] Checking Password Token Success';
export const CHECK_RESET_PASSWORD_TOKEN_ERROR = '[Auth/Reset Password] Checking Password Token Error';

export class ResetPassword implements Action {
  readonly type = RESET_PASSWORD;
  constructor(public token: string, public password: string) {}
}

export class ResetPasswordSuccess implements Action {
  readonly type = RESET_PASSWORD_SUCCESS;
  constructor() {}
}

export class ResetPasswordTokenExpired implements  Action {
  readonly type = RESET_PASSWORD_TOKEN_EXPIRED;
  constructor () {}
}

export class ResetPasswordError implements Action {
  readonly type = RESET_PASSWORD_ERROR;
  constructor() {}
}

export class CheckResetPasswordToken implements Action {
  readonly type = CHECK_RESET_PASSWORD_TOKEN;
  constructor(public token: string) {}
}

export class CheckResetPasswordTokenSuccess implements Action {
  readonly type = CHECK_RESET_PASSWORD_TOKEN_SUCCESS;
  constructor(public tokenValid: boolean) {}
}

export class CheckResetPasswordTokenError implements Action {
  readonly type = CHECK_RESET_PASSWORD_TOKEN_ERROR;
  constructor() {}
}

export type Actions
  = ResetPassword
  | ResetPasswordSuccess
  | ResetPasswordTokenExpired
  | ResetPasswordError
  | CheckResetPasswordToken
  | CheckResetPasswordTokenSuccess
  | CheckResetPasswordTokenError;
