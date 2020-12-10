import {Action} from '@ngrx/store';

export const CHANGE_PASSWORD = '[Auth/Change Password] Changing Password';
export const CHANGE_PASSWORD_SUCCESS = '[Auth/Change Password] Changing Password Success';
export const CHANGE_PASSWORD_ERROR = '[Auth/Change Password] Changing Password Error';
export const CHANGE_PASSWORD_ALREADY_USED = '[Auth/Change Password] Changing Password Already Used';

export class ChangePassword implements Action {
  readonly type = CHANGE_PASSWORD;
  constructor(public payload: {CurrentPassword: string, NewPassword: string}) {}
}

export class ChangePasswordSuccess implements Action {
  readonly type = CHANGE_PASSWORD_SUCCESS;
  constructor() {}
}

export class ChangePasswordError implements Action {
  readonly type = CHANGE_PASSWORD_ERROR;
  constructor() {}
}


export type Actions
  = ChangePassword
  | ChangePasswordSuccess
  | ChangePasswordError;
