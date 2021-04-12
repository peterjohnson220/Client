import { Action } from '@ngrx/store';
import { ExchangeJobDailyNatAvgOrg50thDetails } from 'libs/models/payfactors-api';

export const GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS = '[Peer/National Average] Get National Averages For Exchange Jobs';
export const GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS_SUCCESS = '[Peer/National Average] Get National Averages For Exchange Jobs Success';
export const GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS_ERROR = '[Peer/National Average] Get National Averages For Exchange Jobs Error';

export class GetNationalAveragesForExchangeJobs implements Action {
  readonly type = GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS;

  constructor(public exchangeJobIds: number[]) {}
}

export class GetNationalAveragesForExchangeJobsSuccess implements Action {
  readonly type = GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS_SUCCESS;

  constructor(public payload: ExchangeJobDailyNatAvgOrg50thDetails[]) {}
}

export class GetNationalAveragesForExchangeJobsError implements Action {
  readonly type = GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS_ERROR;
}

export type Actions
  = GetNationalAveragesForExchangeJobs
  | GetNationalAveragesForExchangeJobsSuccess
  | GetNationalAveragesForExchangeJobsError;
