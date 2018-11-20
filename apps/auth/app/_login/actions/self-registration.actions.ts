import { Action } from '@ngrx/store';
import { SelfRegistrationForm } from 'libs/models/user/self-registration-form.model';
import { SelfRegistrationExistingCompany } from '../models/self-registration-existing-company.model';

export const VALIDATE_TOKEN = '[Self Registration/Validate] Validate Token';
export const VALIDATE_TOKEN_SUCCESS = '[Self Registration/Validate] Validate Token Success';
export const VALIDATE_TOKEN_ERROR = '[Self Registration/Validate] Validate Token Error';
export const VALIDATE_TOKEN_EXPIRED = '[Self Registration/Validate] Validate Token Expired';
export const VALIDATE_TOKEN_ACCOUNT_EXISTS = '[Self Registration/Validate] Validate Token Account Exists';
export const VALIDATE_TOKEN_COMPANY_EXISTS = '[Self Registration/Validate] Validate Token Company Exists';
export const FIELD_CHANGE = '[Self Registration/Request] Field Change';
export const SUBMIT = '[Self Registration/Request] Submit';
export const SUBMIT_SUCCESS = '[Self Registration/Request] Submit Success';
export const SUBMIT_ERROR = '[Self Registration/Request] Submit Error';

export class FieldChange implements Action {
  readonly type = FIELD_CHANGE;
  constructor(public payload: SelfRegistrationForm) {}
}

export class Submit implements Action {
  readonly type = SUBMIT;
  constructor() {}
}

export class SubmitSuccess implements Action {
  readonly type = SUBMIT_SUCCESS;
  constructor() {}
}

export class SubmitError implements Action {
  readonly type = SUBMIT_ERROR;
  constructor(public payload: any) {}
}

export class ValidateToken implements Action {
  readonly type = VALIDATE_TOKEN;
  constructor(public payload: { token: string }) {}
}

export class ValidateTokenSuccess implements Action {
  readonly type = VALIDATE_TOKEN_SUCCESS;
  constructor(public payload: { token: string }) {}
}

export class ValidateTokenError implements Action {
  readonly type = VALIDATE_TOKEN_ERROR;
  constructor() {}
}

export class ValidateTokenExpired implements Action {
  readonly type = VALIDATE_TOKEN_EXPIRED;
  constructor() {}
}

export class ValidateTokenAccountExists implements Action {
  readonly type = VALIDATE_TOKEN_ACCOUNT_EXISTS;
  constructor(public payload: { accountEmail: string }) {}
}

export class ValidateTokenCompanyExists implements Action {
  readonly type = VALIDATE_TOKEN_COMPANY_EXISTS;
  constructor(public payload: SelfRegistrationExistingCompany) {}
}

export type Actions
  = ValidateToken
  | ValidateTokenSuccess
  | ValidateTokenError
  | ValidateTokenExpired
  | ValidateTokenAccountExists
  | ValidateTokenCompanyExists
  | FieldChange
  | Submit
  | SubmitSuccess
  | SubmitError;
