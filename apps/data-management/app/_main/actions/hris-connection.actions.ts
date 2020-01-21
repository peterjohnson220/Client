import { Action } from '@ngrx/store';

import {CredentialsPackage} from 'libs/models/hris-api/connection/request';

export const GET_CURRENT_HRIS_CONNECTION = '[Data Management/HRIS Connections] Get Current HRIS Connection';
export const GET_CURRENT_HRIS_CONNECTION_ERROR = '[Data Management/HRIS Connections] Get Current HRIS Connection Error';
export const GET_CURRENT_HRIS_CONNECTION_SUCCESS = '[Data Management/HRIS Connections] Get Current HRIS Connection Success';

export const DELETE_HRIS_CONNECTION = '[Data Management/HRIS Connections] Delete HRIS Connections';
export const DELETE_HRIS_CONNECTION_ERROR = '[Data Management/HRIS Connections] Delete HRIS Connections Error';
export const DELETE_HRIS_CONNECTION_SUCCESS = '[Data Management/HRIS Connections] Delete HRIS Connections Success';

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

export type Actions
  = GetCurrentHrisConnection
  | GetCurrentHrisConnectionError
  | GetCurrentHrisConnectionSuccess
  | DeleteHRISConnection
  | DeleteHRISConnectionError
  | DeleteHRISConnectionSuccess;
