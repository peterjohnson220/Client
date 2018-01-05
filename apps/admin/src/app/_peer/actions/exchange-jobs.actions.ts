import { Action } from '@ngrx/store';

import { ExchangeJob } from 'libs/models';

export const LOADING_EXCHANGE_JOBS  = '[Peer Admin/Exchange Jobs] Loading Exchange Jobs';
export const LOADING_EXCHANGE_JOBS_SUCCESS  = '[Peer Admin/Exchange Jobs] Loading Exchange Jobs Success';
export const LOADING_EXCHANGE_JOBS_ERROR  = '[Peer Admin/Exchange Jobs] Loading Exchange Jobs Error';

export class LoadingExchangeJobs implements Action {
  readonly type = LOADING_EXCHANGE_JOBS;

  constructor(public payload: number) {}
}

export class LoadingExchangeJobsSuccess implements Action {
  readonly type = LOADING_EXCHANGE_JOBS_SUCCESS;

  constructor(public payload: ExchangeJob[]) {}
}

export class LoadingExchangeJobsError implements Action {
  readonly type = LOADING_EXCHANGE_JOBS_ERROR;
}

export type Actions
  = LoadingExchangeJobs
  | LoadingExchangeJobsSuccess
  | LoadingExchangeJobsError;
