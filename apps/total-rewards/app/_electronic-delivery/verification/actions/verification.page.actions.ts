import { Action } from '@ngrx/store';

import { TokenValidationResponse } from 'libs/models/payfactors-api/total-rewards/response';

export const REQUEST_TOKEN = '[Total Rewards/Delivery Page] Request Token';
export const REQUEST_TOKEN_SUCCESS = '[Total Rewards/Delivery Page] Request Token Success';
export const REQUEST_TOKEN_ERROR = '[Total Rewards/Delivery Page] Request Token Error';
export const VALIDATE_TOKEN = '[Total Rewards/Delivery Page] Validate Token';
export const VALIDATE_TOKEN_SUCCESS = '[Total Rewards/Delivery Page] Validate Token Success';
export const VALIDATE_TOKEN_ERROR = '[Total Rewards/Delivery Page] Validate Token Error';

export class RequestToken implements Action {
  readonly type = REQUEST_TOKEN;
  constructor(public payload: { resend: boolean, suppressEmail: boolean }) {}
}

export class RequestTokenSuccess implements Action {
  readonly type = REQUEST_TOKEN_SUCCESS;
  constructor() {}
}

export class RequestTokenError implements Action {
  readonly type = REQUEST_TOKEN_ERROR;
  constructor() {}
}

export class ValidateToken implements Action {
  readonly type = VALIDATE_TOKEN;
  constructor(public payload: string) { }
}

export class ValidateTokenSuccess implements Action {
  readonly type = VALIDATE_TOKEN_SUCCESS;
  constructor(public payload: TokenValidationResponse) {}
}

export class ValidateTokenError implements Action {
  readonly type = VALIDATE_TOKEN_ERROR;
  constructor() {}
}

export type VerificationPageActions =
  RequestToken |
  RequestTokenSuccess |
  RequestTokenError |
  ValidateToken |
  ValidateTokenSuccess |
  ValidateTokenError;
