import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { AddExchangeJobsRequest } from 'libs/models/peer';

export const LOADING_AVAILABLE_JOBS  = '[Peer Admin/Available Jobs] Loading Available Jobs';
export const LOADING_AVAILABLE_JOBS_SUCCESS  = '[Peer Admin/Available Jobs] Loading Available Jobs Success';
export const LOADING_AVAILABLE_JOBS_ERROR  = '[Peer Admin/Available Jobs] Loading Available Jobs Error';

export class LoadingAvailableJobs implements Action {
  readonly type = LOADING_AVAILABLE_JOBS;

  constructor(public payload: any) {}
}

export class LoadingAvailableJobsSuccess implements Action {
  readonly type = LOADING_AVAILABLE_JOBS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadingAvailableJobsError implements Action {
  readonly type = LOADING_AVAILABLE_JOBS_ERROR;
}

// TODO: MOVE TO exchange-jobs actions when avail -
// Add exchange companies
export const OPEN_ADD_EXCHANGE_JOBS_MODAL = '[Peer Admin/Exchange Jobs] Open Add Exchange Jobs Modal';
export const CLOSE_ADD_EXCHANGE_JOBS_MODAL = '[Peer Admin/Exchange Jobs] Close Add Exchange Jobs Modal';
export const ADDING_EXCHANGE_JOBS = '[Peer Admin/Exchange Jobs] Adding Exchange Jobs';
export const ADDING_EXCHANGE_JOBS_SUCCESS = '[Peer Admin/Exchange Jobs] Adding Exchange Jobs Success';
export const ADDING_EXCHANGE_JOBS_ERROR = '[Peer Admin/Exchange Jobs] Adding Exchange Jobs Error';

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

export type Actions
  = LoadingAvailableJobs
  | LoadingAvailableJobsSuccess
  | LoadingAvailableJobsError
  // TODO: MOVE TO exchange-jobs actions when avail -
  | OpenAddExchangeJobsModal
  | CloseAddExchangeJobsModal
  | AddingExchangeJobs
  | AddingExchangeJobsSuccess
  | AddingExchangeJobsError;
