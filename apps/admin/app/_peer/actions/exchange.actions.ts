import { Action } from '@ngrx/store';

import { Exchange, StatusEnum } from 'libs/models';

import { ExchangeManagementDetails } from '../models';

export const LOAD_EXCHANGE_MANAGEMENT_DETAILS = '[Admin/Peer] Load Exchange Management Details';
export const LOAD_EXCHANGE_MANAGEMENT_DETAILS_SUCCESS = '[Admin/Peer] Load Management Details Success';
export const LOAD_EXCHANGE_MANAGEMENT_DETAILS_ERROR = '[Admin/Peer] Load Exchange Management Details Error';
export const OPEN_TOGGLE_EXCHANGE_STATUS_MODAL = '[Admin/Peer] Open Toggle Exchange Status';
export const CLOSE_TOGGLE_EXCHANGE_STATUS_MODAL = '[Admin/Peer] Close Toggle Exchange Status';
export const UPDATE_EXCHANGE_STATUS = '[Admin/Peer] Update Exchange Status';
export const UPDATE_EXCHANGE_STATUS_SUCCESS = '[Admin/Peer] Update Exchange Status Success';
export const UPDATE_EXCHANGE_STATUS_ERROR = '[Admin/Peer] Update Exchange Status Error';

export class LoadExchangeManagementDetails implements Action {
  readonly type = LOAD_EXCHANGE_MANAGEMENT_DETAILS;

  constructor(public payload: number) {}
}

export class LoadExchangeManagementDetailsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_MANAGEMENT_DETAILS_SUCCESS;

  constructor(public payload: ExchangeManagementDetails) {}
}

export class LoadExchangeManagementDetailsError implements Action {
  readonly type = LOAD_EXCHANGE_MANAGEMENT_DETAILS_ERROR;
}

export class OpenToggleExchangeStatusModal implements Action {
  readonly type = OPEN_TOGGLE_EXCHANGE_STATUS_MODAL;
}

export class CloseToggleExchangeStatusModal implements Action {
  readonly type = CLOSE_TOGGLE_EXCHANGE_STATUS_MODAL;
}

export class UpdateExchangeStatus implements Action {
  readonly type = UPDATE_EXCHANGE_STATUS;

  constructor(public exchangeId: number, public newStatus: StatusEnum) {}
}

export class UpdateExchangeStatusSuccess implements Action {
  readonly type = UPDATE_EXCHANGE_STATUS_SUCCESS;

  constructor(public payload: Exchange) {}
}

export class UpdateExchangeStatusError implements Action {
  readonly type = UPDATE_EXCHANGE_STATUS_ERROR;
}

export type Actions
  = LoadExchangeManagementDetails
  | LoadExchangeManagementDetailsSuccess
  | LoadExchangeManagementDetailsError
  | OpenToggleExchangeStatusModal
  | CloseToggleExchangeStatusModal
  | UpdateExchangeStatus
  | UpdateExchangeStatusSuccess
  | UpdateExchangeStatusError;
