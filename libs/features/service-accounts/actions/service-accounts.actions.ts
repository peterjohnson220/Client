import { Action } from '@ngrx/store';

import { ServiceAccountRequest, ServiceAccountUser, ServiceAccountUserStatus } from 'libs/models';

export const CREATE_SERVICE_ACCOUNT = '[Service Accounts] Create Service Account';
export const CREATE_SERVICE_ACCOUNT_SUCCESS = '[Service Accounts] Create Service Account Success';
export const CREATE_SERVICE_ACCOUNT_ERROR = '[Service Accounts] Create Service Account Error';
export const GET_ACCOUNT_STATUS = '[Service Accounts] Get Account Status';
export const GET_ACCOUNT_STATUS_SUCCESS = '[Service Accounts] Get Account Status Success';
export const GET_ACCOUNT_STATUS_ERROR = '[Service Accounts] Get Account Status Error';
export const CLOSE_RESET_ACCOUNT_MODAL = '[Service Accounts] Close Reset Account Modal';
export const OPEN_RESET_ACCOUNT_MODAL = '[Service Accounts] Open Reset Account Modal';
export const CLOSE_NEW_ACCOUNT_MODAL = '[Service Accounts] Close New Account Modal';
export const OPEN_NEW_ACCOUNT_MODAL = '[Service Accounts] Open New Account Modal';
export const RESET_SERVICE_ACCOUNT = '[Service Accounts] Reset Service Account';
export const RESET_SERVICE_ACCOUNT_SUCCESS = '[Service Accounts] Reset Service Account Success';
export const RESET_SERVICE_ACCOUNT_ERROR = '[Service Accounts] Reset Service Account Error';

export class CreateServiceAccount implements Action {
  readonly type = CREATE_SERVICE_ACCOUNT;

  constructor(public payload: ServiceAccountRequest) { }
}

export class CreateServiceAccountSuccess implements Action {
  readonly type = CREATE_SERVICE_ACCOUNT_SUCCESS;

  constructor(public payload: ServiceAccountUser) { }
}

export class CreateServiceAccountError implements Action {
  readonly type = CREATE_SERVICE_ACCOUNT_ERROR;
}

export class GetAccountStatus implements Action {
  readonly type = GET_ACCOUNT_STATUS;

  constructor(public payload: ServiceAccountRequest) { }
}

export class GetAccountStatusSuccess implements Action {
  readonly type = GET_ACCOUNT_STATUS_SUCCESS;

  constructor(public payload: ServiceAccountUserStatus) { }
}

export class GetAccountStatusError implements Action {
  readonly type = GET_ACCOUNT_STATUS_ERROR;
}

export class CloseResetAccountModal implements Action {
  readonly type = CLOSE_RESET_ACCOUNT_MODAL;
}

export class OpenResetAccountModal implements Action {
  readonly type = OPEN_RESET_ACCOUNT_MODAL;
}

export class CloseNewAccountModal implements Action {
  readonly type = CLOSE_NEW_ACCOUNT_MODAL;
}

export class OpenNewAccountModal implements Action {
  readonly type = OPEN_NEW_ACCOUNT_MODAL;
}

export class ResetServiceAccount implements Action {
  readonly type = RESET_SERVICE_ACCOUNT;

  constructor(public payload: ServiceAccountRequest) { }
}

export class ResetServiceAccountSuccess implements Action {
  readonly type = RESET_SERVICE_ACCOUNT_SUCCESS;

  constructor(public payload: ServiceAccountUser) { }
}

export class ResetServiceAccountError implements Action {
  readonly type = RESET_SERVICE_ACCOUNT_ERROR;
}

export type Actions
  = CreateServiceAccount
  | CreateServiceAccountSuccess
  | CreateServiceAccountError
  | GetAccountStatus
  | GetAccountStatusSuccess
  | GetAccountStatusError
  | CloseResetAccountModal
  | OpenResetAccountModal
  | CloseNewAccountModal
  | OpenNewAccountModal
  | ResetServiceAccount
  | ResetServiceAccountSuccess
  | ResetServiceAccountError;
