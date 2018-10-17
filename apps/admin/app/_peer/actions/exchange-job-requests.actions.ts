import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_JOB_REQUESTS =
  '[Peer Admin/Exchange Job Requests] Load Exchange Job Requests';
export const LOAD_EXCHANGE_JOB_REQUESTS_SUCCESS =
  '[Peer Admin/Exchange Job Requests] Load Exchange Job Requests Success';
export const LOAD_EXCHANGE_JOB_REQUESTS_ERROR =
  '[Peer Admin/Exchange Job Requests] Load Exchange Job Requests Error';
export const APPROVE_EXCHANGE_JOB_REQUEST =
  '[Peer Admin/Exchange Job Requests] Approve Exchange Job Request';
export const APPROVE_EXCHANGE_JOB_REQUEST_SUCCESS =
  '[Peer Admin/Exchange Job Requests] Approve Exchange Job Request Success';
export const APPROVE_EXCHANGE_JOB_REQUEST_ERROR =
  '[Peer Admin/Exchange Job Requests] Approve Exchange Job Request Error';
export const DENY_EXCHANGE_JOB_REQUEST =
  '[Peer Admin/Exchange Job Requests] Deny Exchange Job Request';
export const DENY_EXCHANGE_JOB_REQUEST_SUCCESS =
  '[Peer Admin/Exchange Job Requests] Deny Exchange Job Request Success';
export const DENY_EXCHANGE_JOB_REQUEST_ERROR =
  '[Peer Admin/Exchange Job Requests] Deny Exchange Job Request Error';
export const OPEN_JOB_REQUEST_INFO =
  '[Peer Admin/Exchange Job Requests] Open Job Request Info';
export const CLOSE_JOB_REQUEST_INFO =
  '[Peer Admin/Exchange Job Requests] Close Job Request Info';
export const OPEN_JOB_REQUEST_DENY_MODAL =
  '[Peer Admin/Exchange Job Requests] Open Job Request Deny Modal';
export const CLOSE_JOB_REQUEST_DENY_MODAL =
  '[Peer Admin/Exchange Job Requests] Close Job Request Deny Modal';

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

export class ApproveExchangeJobRequest implements Action {
  readonly  type = APPROVE_EXCHANGE_JOB_REQUEST;

  constructor(public payload: any) {}
}

export class ApproveExchangeJobRequestSuccess implements Action {
  readonly type = APPROVE_EXCHANGE_JOB_REQUEST_SUCCESS;
}

export class ApproveExchangeJobRequestError implements Action {
  readonly type = APPROVE_EXCHANGE_JOB_REQUEST_ERROR;
}

export class DenyExchangeJobRequest implements Action {
  readonly  type = DENY_EXCHANGE_JOB_REQUEST;

  constructor(public payload: any) {}
}

export class DenyExchangeJobRequestSuccess implements Action {
  readonly type = DENY_EXCHANGE_JOB_REQUEST_SUCCESS;
}

export class DenyExchangeJobRequestError implements Action {
  readonly type = DENY_EXCHANGE_JOB_REQUEST_ERROR;
}

export class OpenJobRequestInfo implements Action {
  readonly type = OPEN_JOB_REQUEST_INFO;

  constructor(public payload: any) {}
}

export class CloseJobRequestInfo implements Action {
  readonly type = CLOSE_JOB_REQUEST_INFO;
}

export class OpenJobRequestDenyModal implements Action {
  readonly type = OPEN_JOB_REQUEST_DENY_MODAL;
}

export class CloseJobRequestDenyModal implements Action {
  readonly type = CLOSE_JOB_REQUEST_DENY_MODAL;
}

export type Actions
  = LoadExchangeJobRequests
  | LoadExchangeJobRequestsSuccess
  | LoadExchangeJobRequestsError
  | ApproveExchangeJobRequest
  | ApproveExchangeJobRequestSuccess
  | ApproveExchangeJobRequestError
  | DenyExchangeJobRequest
  | DenyExchangeJobRequestSuccess
  | DenyExchangeJobRequestError
  | OpenJobRequestInfo
  | CloseJobRequestInfo
  | OpenJobRequestDenyModal
  | CloseJobRequestDenyModal;
