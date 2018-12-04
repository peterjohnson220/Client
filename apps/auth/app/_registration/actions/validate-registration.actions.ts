import { Action } from '@ngrx/store';
import { SelfRegistrationExistingCompany } from '../models/self-registration-existing-company.model';

export const VALIDATE_TOKEN = '[Registration/Validate] Validate Token';
export const VALIDATE_TOKEN_SUCCESS = '[Registration/Validate] Validate Token Success';
export const VALIDATE_TOKEN_ERROR = '[Registration/Validate] Validate Token Error';
export const VALIDATE_TOKEN_EXPIRED = '[Registration/Validate] Validate Token Expired';
export const VALIDATE_TOKEN_ACCOUNT_EXISTS = '[Registration/Validate] Validate Token Account Exists';
export const VALIDATE_TOKEN_COMPANY_EXISTS = '[Registration/Validate] Validate Token Company Exists';

export const RESEND_TOKEN = '[Registration/Resend Token] Resend';
export const RESEND_TOKEN_SUCCESS = '[Registration/Resend Token] Resend Success';
export const RESEND_TOKEN_ERROR = '[Registration/Resend Token] Resend Error';

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

export class ResendToken implements Action {
  readonly type = RESEND_TOKEN;
  constructor(public payload: { token: string }) {}
}

export class ResendTokenSuccess implements Action {
  readonly type = RESEND_TOKEN_SUCCESS;
  constructor(public payload: { email: string }) {}
}

export class ResendTokenError implements Action {
  readonly type = RESEND_TOKEN_ERROR;
  constructor() {}
}

export type Actions
  = ValidateToken
  | ValidateTokenSuccess
  | ValidateTokenError
  | ValidateTokenExpired
  | ValidateTokenAccountExists
  | ValidateTokenCompanyExists
  | ResendToken
  | ResendTokenSuccess
  | ResendTokenError;
