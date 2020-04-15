import { Action } from '@ngrx/store';

import {CredentialsPackage, PatchProperty} from 'libs/models/hris-api/connection/request';
import {ConnectionSummary} from '../models';

export const GET_CURRENT_HRIS_CONNECTION = '[Data Management/HRIS Connections] Get Current HRIS Connection';
export const GET_CURRENT_HRIS_CONNECTION_ERROR = '[Data Management/HRIS Connections] Get Current HRIS Connection Error';
export const GET_CURRENT_HRIS_CONNECTION_SUCCESS = '[Data Management/HRIS Connections] Get Current HRIS Connection Success';

export const GET_HRIS_CONNECTION_SUMMARY = '[Data Management/HRIS Connections] Get HRIS Connection Summary';
export const GET_HRIS_CONNECTION_SUMMARY_ERROR = '[Data Management/HRIS Connections] Get HRIS Connection Summary Error';
export const GET_HRIS_CONNECTION_SUMMARY_SUCCESS = '[Data Management/HRIS Connections] Get HRIS Connection Summary Success';

export const DELETE_HRIS_CONNECTION = '[Data Management/HRIS Connections] Delete HRIS Connections';
export const DELETE_HRIS_CONNECTION_ERROR = '[Data Management/HRIS Connections] Delete HRIS Connections Error';
export const DELETE_HRIS_CONNECTION_SUCCESS = '[Data Management/HRIS Connections] Delete HRIS Connections Success';

export const VALIDATE = '[Data Management/Transfer Data Page] Validate Credentials';
export const VALIDATE_ERROR = '[Data Management/Transfer Data Page] Validate Credentials Error';
export const VALIDATE_SUCCESS = '[Data Management/Transfer Data Page] Validate Credentials Success';

export const CREATE_CONNECTION = '[Data Management/Transfer Data Page] Create Connection';
export const CREATE_CONNECTION_ERROR = '[Data Management/Transfer Data Page] Create Connection Error';
export const CREATE_CONNECTION_SUCCESS = '[Data Management/Transfer Data Page] Create Connection Success';

export const OPEN_REAUTHENTICATION_MODAL = '[Data Management/Hris Connections] Open Re-authentication Modal';

export const PATCH_CONNECTION = '[Data Management/Hris Connections] Patch Connection';
export const PATCH_CONNECTION_ERROR = '[Data Management/Hris Connections] Patch Connection Error';
export const PATCH_CONNECTION_SUCCESS = '[Data Management/Hris Connections] Patch Connection Success';

// TODO: Delete this
export const OUTBOUND_JDM_VALIDATE = '[Data Management/Transfer Data Page] Validate Outbound JDM Credentials';
export const OUTBOUND_JDM_VALIDATE_SUCCESS = '[Data Management/Transfer Data Page] Validate Outbound JDM Credentials Success';

export class GetCurrentHrisConnection implements Action {
  readonly type = GET_CURRENT_HRIS_CONNECTION;
}
export class GetCurrentHrisConnectionError implements Action {
  readonly type = GET_CURRENT_HRIS_CONNECTION_ERROR;
}
export class GetCurrentHrisConnectionSuccess implements Action {
  readonly type = GET_CURRENT_HRIS_CONNECTION_SUCCESS;

  constructor(public payload: CredentialsPackage) {}
}

export class DeleteHRISConnection implements Action {
  readonly type = DELETE_HRIS_CONNECTION;
}
export class DeleteHRISConnectionError implements Action {
  readonly type = DELETE_HRIS_CONNECTION_ERROR;
}
export class DeleteHRISConnectionSuccess implements Action {
  readonly type = DELETE_HRIS_CONNECTION_SUCCESS;
}

export class GetHrisConnectionSummary implements Action {
  readonly type = GET_HRIS_CONNECTION_SUMMARY;
}
export class GetHrisConnectionSummaryError implements Action {
  readonly type = GET_HRIS_CONNECTION_SUMMARY_ERROR;
}
export class GetHrisConnectionSummarySuccess implements Action {
  readonly type = GET_HRIS_CONNECTION_SUMMARY_SUCCESS;

  constructor(public payload: ConnectionSummary) {}
}

export class Validate implements Action {
  readonly type = VALIDATE;

  constructor(public payload: CredentialsPackage) {}
}
export class ValidateError implements Action {
  readonly type = VALIDATE_ERROR;

  constructor(public payload: string[] = []) {}
}
export class ValidateSuccess implements Action {
  readonly type = VALIDATE_SUCCESS;

  constructor(public payload: {success: boolean, skipValidation: boolean}) {}
}

export class CreateConnection implements Action {
  readonly type = CREATE_CONNECTION;

  constructor(public payload: CredentialsPackage) {}
}

export class CreateConnectionError implements Action {
  readonly type = CREATE_CONNECTION_ERROR;

  constructor() {}
}

export class CreateConnectionSuccess implements Action {
  readonly type = CREATE_CONNECTION_SUCCESS;

  constructor(public payload: { credentials: CredentialsPackage, connectionId: number }) {}
}

export class OpenReAuthenticationModal implements Action {
  readonly type = OPEN_REAUTHENTICATION_MODAL;

  constructor(public payload: boolean) {}
}

export class PatchConnection implements Action {
  readonly type = PATCH_CONNECTION;

  constructor(public payload: any) {}
}
export class PatchConnectionError implements Action {
  readonly type = PATCH_CONNECTION_ERROR;

  constructor() {}
}
export class PatchConnectionSuccess implements Action {
  readonly type = PATCH_CONNECTION_SUCCESS;

  constructor(public payload: number) {}
}


// TODO: Delete for outbound
export class OutboundJdmValidate implements Action {
  readonly type = OUTBOUND_JDM_VALIDATE;

  constructor(public payload: CredentialsPackage) {}
}
export class OutboundJdmValidateSuccess implements Action {
  readonly type = OUTBOUND_JDM_VALIDATE_SUCCESS;

  constructor() {}
}

export type Actions
  = GetCurrentHrisConnection
  | GetCurrentHrisConnectionError
  | GetCurrentHrisConnectionSuccess
  | DeleteHRISConnection
  | DeleteHRISConnectionError
  | DeleteHRISConnectionSuccess
  | GetHrisConnectionSummary
  | GetHrisConnectionSummaryError
  | GetHrisConnectionSummarySuccess
  | Validate
  | ValidateError
  | ValidateSuccess
  | CreateConnection
  | CreateConnectionError
  | CreateConnectionSuccess
  | OpenReAuthenticationModal
  | PatchConnection
  | PatchConnectionError
  | PatchConnectionSuccess
  | OutboundJdmValidate
  | OutboundJdmValidateSuccess;
