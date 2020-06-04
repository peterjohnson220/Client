import { Action } from '@ngrx/store';
import { SftpUserModel } from 'libs/models/Sftp';

export const SET_SFTP_USERNAME = '[Org Data Autoloader/Sftp User] Set Sftp Username';
export const SET_SFTP_PUBLIC_KEY = '[Org Data Autoloader/Sftp User] Set Sftp Public Key';
export const GET_SFTP_USER = '[Org Data Autoloader/Sftp User] Get Sftp User';
export const GET_SFTP_USER_SUCCESS = '[Org Data Autoloader/Sftp User] Get Sftp User Success';
export const GET_SFTP_USER_Error = '[Org Data Autoloader/Sftp User] Get Sftp User Error';
export const VALIDATE_USERNAME = '[Org Data Autoloader/Sftp User] Validate Username';
export const VALIDATE_USERNAME_SUCCESS = '[Org Data Autoloader/Sftp User] Validate Username Success';
export const VALIDATE_USERNAME_ERROR = '[Org Data Autoloader/Sftp User] Validate Username Error';

export class SetSftpUsername implements Action {
  readonly type = SET_SFTP_USERNAME;

  constructor(public payload: string) {}
}

export class SetSftpPublicKey implements Action {
  readonly type = SET_SFTP_PUBLIC_KEY;

  constructor(public payload: File) {}
}

export class GetSftpUser implements Action {
  readonly type = GET_SFTP_USER;

  constructor(public payload: number) {}
}

export class GetSftpUserSuccess implements Action {
  readonly type = GET_SFTP_USER_SUCCESS;

  constructor(public payload: SftpUserModel) {}
}

export class GetSftpUserError implements Action {
  readonly type = GET_SFTP_USER_Error;

  constructor(public payload = null) {}
}

export class ValidateUsername implements Action {
  readonly type = VALIDATE_USERNAME;

  constructor(public payload: any) {}
}

export class ValidateUsernameSuccess implements Action {
  readonly type = VALIDATE_USERNAME_SUCCESS;

  constructor(public payload: any) {}
}

export class ValidateUsernameError implements Action {
  readonly type = VALIDATE_USERNAME_ERROR;

  constructor(public payload = null) {}
}

export type Actions =
  SetSftpUsername
  | SetSftpPublicKey
  | GetSftpUser
  | GetSftpUserSuccess
  | GetSftpUserError
  | ValidateUsername
  | ValidateUsernameSuccess
  | ValidateUsernameError;
