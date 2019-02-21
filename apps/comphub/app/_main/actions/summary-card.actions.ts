import { Action } from '@ngrx/store';

import { JobData, JobSalaryTrend } from '../models';

export const PRICE_NEW_JOB = '[Comphub/Summary Card] Price New Job';
export const GET_JOB_NATIONAL_TREND = '[Comphub/Summary Card] Get National Job Trend';
export const GET_JOB_NATIONAL_TREND_SUCCESS = '[Comphub/Summary Card] Get National Job Trend Success';
export const GET_JOB_NATIONAL_TREND_ERROR = '[Comphub/Summary Card] Get National Job Trend Error';

export class PriceNewJob implements Action {
  readonly type = PRICE_NEW_JOB;

  constructor() {}
}

export class GetNationalJobTrendData implements Action {
  readonly type = GET_JOB_NATIONAL_TREND;

  constructor(public payload: JobData) {}
}

export class GetNationalJobTrendDataSuccess implements Action {
  readonly type = GET_JOB_NATIONAL_TREND_SUCCESS;

  constructor(public payload: JobSalaryTrend) {}
}

export class GetNationalJobTrendDataError implements Action {
  readonly type = GET_JOB_NATIONAL_TREND_ERROR;

  constructor() {}
}

export type Actions
  = PriceNewJob
  | GetNationalJobTrendData
  | GetNationalJobTrendDataSuccess
  | GetNationalJobTrendDataError;
