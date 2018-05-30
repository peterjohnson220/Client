import { Action } from '@ngrx/store';

export const SENDING_PASSWORD_RESET  = '[auth] Sending Password Reset';
export const SENDING_PASSWORD_RESET_SUCCESS  = '[auth] Sending Password Reset Success';
export const SENDING_PASSWORD_RESET_ERROR  = '[auth] Sending Password Reset Error';

export class SendingPasswordReset implements Action {
  readonly type = SENDING_PASSWORD_RESET;

  constructor(public payload: any) {}
}

export class SendingPasswordResetSuccess implements Action {
  readonly type = SENDING_PASSWORD_RESET_SUCCESS;

  constructor() {}
}

export class SendingPasswordResetError implements Action {
  readonly type = SENDING_PASSWORD_RESET_ERROR;
  readonly payload;
}

export type Actions
  = SendingPasswordReset
  | SendingPasswordResetSuccess
  | SendingPasswordResetError;
