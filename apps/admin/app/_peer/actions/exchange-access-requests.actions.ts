import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_ACCESS_REQUESTS =
  '[Peer Admin/Exchange Access Requests] Load Exchange Access Requests';
export const LOAD_EXCHANGE_ACCESS_REQUESTS_SUCCESS =
  '[Peer Admin/Exchange Access Requests] Load Exchange Access Requests Success';
export const LOAD_EXCHANGE_ACCESS_REQUESTS_ERROR =
  '[Peer Admin/Exchange Access Requests] Load Exchange Access Requests Error';

export class LoadExchangeAccessRequests implements Action {
  readonly type = LOAD_EXCHANGE_ACCESS_REQUESTS;

  constructor(public payload: any) {}
}

export class LoadExchangeAccessRequestsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_ACCESS_REQUESTS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeAccessRequestsError implements Action {
  readonly type = LOAD_EXCHANGE_ACCESS_REQUESTS_ERROR;
}

export type Actions
  = LoadExchangeAccessRequests
  | LoadExchangeAccessRequestsSuccess
  | LoadExchangeAccessRequestsError;
