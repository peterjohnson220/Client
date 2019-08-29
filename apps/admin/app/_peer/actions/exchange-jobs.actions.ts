import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { AddExchangeJobsRequest } from 'libs/models/peer';

export const LOADING_EXCHANGE_JOBS  = '[Peer Admin/Exchange Jobs] Loading Exchange Jobs';
export const LOADING_EXCHANGE_JOBS_SUCCESS  = '[Peer Admin/Exchange Jobs] Loading Exchange Jobs Success';
export const LOADING_EXCHANGE_JOBS_ERROR  = '[Peer Admin/Exchange Jobs] Loading Exchange Jobs Error';
export const OPEN_ADD_EXCHANGE_JOBS_MODAL = '[Peer Admin/Exchange Jobs] Open Add Exchange Jobs Modal';
export const CLOSE_ADD_EXCHANGE_JOBS_MODAL = '[Peer Admin/Exchange Jobs] Close Add Exchange Jobs Modal';
export const ADDING_EXCHANGE_JOBS = '[Peer Admin/Exchange Jobs] Adding Exchange Jobs';
export const ADDING_EXCHANGE_JOBS_SUCCESS = '[Peer Admin/Exchange Jobs] Adding Exchange Jobs Success';
export const ADDING_EXCHANGE_JOBS_ERROR = '[Peer Admin/Exchange Jobs] Adding Exchange Jobs Error';
export const EXPORT_EXCHANGE_JOBS = '[Peer Admin/Exchange Jobs] Export Exchange Jobs';
export const EXPORT_EXCHANGE_JOBS_SUCCESS = '[Peer Admin/Exchange Jobs] Export Exchange Jobs Success';
export const EXPORT_EXCHANGE_JOBS_ERROR = '[Peer Admin/Exchange Jobs] Export Exchange Jobs Error';

export class LoadingExchangeJobs implements Action {
  readonly type = LOADING_EXCHANGE_JOBS;

  constructor(public payload: any) {}
}

export class LoadingExchangeJobsSuccess implements Action {
  readonly type = LOADING_EXCHANGE_JOBS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadingExchangeJobsError implements Action {
  readonly type = LOADING_EXCHANGE_JOBS_ERROR;
}

export class OpenAddExchangeJobsModal implements Action {
  readonly type = OPEN_ADD_EXCHANGE_JOBS_MODAL;
}

export class CloseAddExchangeJobsModal implements Action {
  readonly type = CLOSE_ADD_EXCHANGE_JOBS_MODAL;
}

export class AddingExchangeJobs implements Action {
  readonly type = ADDING_EXCHANGE_JOBS;

  constructor(public payload: AddExchangeJobsRequest) {}
}

export class AddingExchangeJobsSuccess implements Action {
  readonly type = ADDING_EXCHANGE_JOBS_SUCCESS;
}

export class AddingExchangeJobsError implements Action {
  readonly type = ADDING_EXCHANGE_JOBS_ERROR;
}

export class ExportExchangeJobs implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS;

  constructor(public payload: { exchangeId: number }) {}
}

export class ExportExchangeJobsSuccess implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS_SUCCESS;
}

export class ExportExchangeJobsError implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS_ERROR;
}

export type Actions
  = LoadingExchangeJobs
  | LoadingExchangeJobsSuccess
  | LoadingExchangeJobsError
  | OpenAddExchangeJobsModal
  | CloseAddExchangeJobsModal
  | AddingExchangeJobs
  | AddingExchangeJobsSuccess
  | AddingExchangeJobsError
  | ExportExchangeJobs
  | ExportExchangeJobsSuccess
  | ExportExchangeJobsError;
