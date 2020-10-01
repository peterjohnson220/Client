import { Action } from '@ngrx/store';

import { JobPricedHistorySummaryRequest } from 'libs/models/payfactors-api/comphub/request';

export const GET_JOB_PRICED_HISTORY_SUMMARY = '[Comphub/Quick Price History Modal] Get Job Priced History Summary';
export const GET_JOB_PRICED_HISTORY_SUMMARY_SUCCESS = '[Comphub/Quick Price History Modal] Get Job Priced History Summary Success';
export const GET_JOB_PRICED_HISTORY_SUMMARY_ERROR = '[Comphub/Quick Price History Modal] Get Job Priced History Summary Error';

export class GetJobPricedHistorySummary implements Action {
  readonly type = GET_JOB_PRICED_HISTORY_SUMMARY;
  constructor(public payload: JobPricedHistorySummaryRequest) {}
}

export class GetJobPricedHistorySummarySuccess implements Action {
  readonly type = GET_JOB_PRICED_HISTORY_SUMMARY_SUCCESS;
  constructor() {}
}

export class GetJobPricedHistorySummaryError implements Action {
  readonly type = GET_JOB_PRICED_HISTORY_SUMMARY_ERROR;
  constructor(public message: string) {}
}

export type Actions
  = GetJobPricedHistorySummary
  | GetJobPricedHistorySummarySuccess
  | GetJobPricedHistorySummaryError;
