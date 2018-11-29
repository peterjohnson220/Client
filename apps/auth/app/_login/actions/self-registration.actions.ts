import { Action } from '@ngrx/store';
import { SelfRegistrationRequestForm } from 'libs/models/user/self-registration-request-form.model';
import { SelfRegistrationCompletionForm } from 'libs/models/user/self-registration-completion-form.model';
import { SelfRegistrationExistingCompany } from '../models/self-registration-existing-company.model';

// Initial Request Form
export const REQUEST_SUBMIT = '[Self Registration/Request] Submit';
export const REQUEST_SUBMIT_SUCCESS = '[Self Registration/Request] Submit Success';
export const REQUEST_SUBMIT_ERROR = '[Self Registration/Request] Submit Error';
export const FIELD_CHANGE = '[Self Registration/Request] Field Change';

// Token/Validation
export const VALIDATE_TOKEN = '[Self Registration/Validate] Validate Token';
export const VALIDATE_TOKEN_SUCCESS = '[Self Registration/Validate] Validate Token Success';
export const VALIDATE_TOKEN_ERROR = '[Self Registration/Validate] Validate Token Error';
export const VALIDATE_TOKEN_EXPIRED = '[Self Registration/Validate] Validate Token Expired';
export const VALIDATE_TOKEN_ACCOUNT_EXISTS = '[Self Registration/Validate] Validate Token Account Exists';
export const VALIDATE_TOKEN_COMPANY_EXISTS = '[Self Registration/Validate] Validate Token Company Exists';

// Password/Completion Form
export const COMPLETION_SUBMIT = '[Self Registration/Completion] Submit';
export const COMPLETION_SUBMIT_SUCCESS = '[Self Registration/Completion] Submit Success';
export const COMPLETION_SUBMIT_ERROR = '[Self Registration/Completion] Submit Error';

// Resend Token
export const RESEND_TOKEN = '[Self Registration/Resend Token] Resend';
export const RESEND_TOKEN_SUCCESS = '[Self Registration/Resend Token] Resend Success';
export const RESEND_TOKEN_ERROR = '[Self Registration/Resend Token] Resend Error';

export class RequestSubmit implements Action {
  readonly type = REQUEST_SUBMIT;
  constructor() {}
}

export class RequestSubmitSuccess implements Action {
  readonly type = REQUEST_SUBMIT_SUCCESS;
  constructor() {}
}

export class RequestSubmitError implements Action {
  readonly type = REQUEST_SUBMIT_ERROR;
  constructor(public payload: any) {}
}

export class FieldChange implements Action {
  readonly type = FIELD_CHANGE;
  constructor(public payload: SelfRegistrationRequestForm) {}
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

export class CompletionSubmit implements Action {
  readonly type = COMPLETION_SUBMIT;
  constructor(public payload: SelfRegistrationCompletionForm) {}
}

export class CompletionSubmitSuccess implements Action {
  readonly type = COMPLETION_SUBMIT_SUCCESS;
  constructor(public payload: { homePagePath: string }) {}
}

export class CompletionSubmitError implements Action {
  readonly type = COMPLETION_SUBMIT_ERROR;
  constructor(public payload: any) {}
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
  | FieldChange
  | RequestSubmit
  | RequestSubmitSuccess
  | RequestSubmitError
  | CompletionSubmit
  | CompletionSubmitSuccess
  | CompletionSubmitError
  | ResendToken
  | ResendTokenSuccess
  | ResendTokenError;
