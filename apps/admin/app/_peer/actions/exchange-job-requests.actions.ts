import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_JOB_REQUESTS =
  '[Peer Admin/Exchange Job Requests] Load Exchange Job Requests';
export const LOAD_EXCHANGE_JOB_REQUESTS_SUCCESS =
  '[Peer Admin/Exchange Job Requests] Load Exchange Job Requests Success';
export const LOAD_EXCHANGE_JOB_REQUESTS_ERROR =
  '[Peer Admin/Exchange Job Requests] Load Exchange Job Requests Error';

export class LoadExchangeJobRequests implements Action {
  readonly  type = LOAD_EXCHANGE_JOB_REQUESTS;

  constructor(public payload: any) {}
}

export class LoadExchangeJobRequestsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOB_REQUESTS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeJobRequestsError implements Action {
  readonly type = LOAD_EXCHANGE_JOB_REQUESTS_ERROR;
}

export type Actions
  = LoadExchangeJobRequests
  | LoadExchangeJobRequestsSuccess
  | LoadExchangeJobRequestsError;
