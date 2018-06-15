import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS =
  '[Peer Admin/Pending Exchange Access Requests] Load Pending Exchange Access Requests';
export const LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS_SUCCESS =
  '[Peer Admin/Pending Exchange Access Requests] Load Pending Exchange Access Requests Success';
export const LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS_ERROR =
  '[Peer Admin/Pending Exchange Access Requests] Load Pending Exchange Access Requests Error';

export class LoadPendingExchangeAccessRequests implements Action {
  readonly type = LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS;

  constructor(public payload: any) {}
}

export class LoadPendingExchangeAccessRequestsSuccess implements Action {
  readonly type = LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadPendingExchangeAccessRequestsError implements Action {
  readonly type = LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS_ERROR;
}

export type Actions
  = LoadPendingExchangeAccessRequests
  | LoadPendingExchangeAccessRequestsSuccess
  | LoadPendingExchangeAccessRequestsError;
