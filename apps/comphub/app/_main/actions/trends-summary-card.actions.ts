import { Action } from '@ngrx/store';

import { TrendsSummaryDetails } from '../models/trends-summary-details.model';

import { PeerTrendDetails } from 'libs/models/peer/requests';

export const GET_PEER_TRENDS = '[Comphub/Trends Summary Card] Get Peer Trends';
export const GET_PEER_TRENDS_SUCCESS = '[Comphub/Trends Summary Card] Get Peer Trends Success';
export const GET_PEER_TRENDS_ERROR = '[Comphub/Trends Summary Card] Get Peer Trends Error';
export const SET_TRENDS_DOMAIN = '[Comphub/Trends Summary Card] Set Trends Domain';
export const SET_TRENDS_PERCENT_CHANGE = '[Comphub/Trends Summary Card] Set Trends Percent Change';
export const SAVE_PEER_TREND = '[Comphub/Trends Summary Card] Save Peer Trend';
export const SAVE_PEER_TREND_SUCCESS = '[Comphub/Trends Summary Card] Save Peer Trend Success';
export const SAVE_PEER_TREND_ERROR = '[Comphub/Trends Summary Card] Save Peer Trend Error';
export const TOGGLE_SAVE_TREND_MODAL = '[Comphub/Trends Summary Card] Toggle Save Trend Modal';
export const RESET = '[Comphub/Trends Summary Card] Reset';
export const EXPORT_EXCHANGE_JOBS = '[Comphub/Trends Summary Card] Export Exchange Jobs';
export const EXPORT_EXCHANGE_JOBS_SUCCESS = '[Comphub/Trends Summary Card] Export Exchange Jobs Success';
export const EXPORT_EXCHANGE_JOBS_ERROR = '[Comphub/Trends Summary Card] Export Exchange Jobs Error';
export const EXPORT_COMPANY_JOBS = '[Comphub/Trends Summary Card] Export Company Jobs';
export const EXPORT_COMPANY_JOBS_SUCCESS = '[Comphub/Trends Summary Card] Export Company Jobs Success';
export const EXPORT_COMPANY_JOBS_ERROR = '[Comphub/Trends Summary Card] Export Company Jobs Error';

export class
GetPeerTrends implements Action {
  readonly type = GET_PEER_TRENDS;
}

export class SavePeerTrend implements Action {
  readonly type = SAVE_PEER_TREND;

  constructor(public payload: PeerTrendDetails) {}
}

export class SavePeerTrendSuccess implements Action {
  readonly type = SAVE_PEER_TREND_SUCCESS;
}

export class SavePeerTrendError implements Action {
  readonly type = SAVE_PEER_TREND_ERROR;
}

export class GetPeerTrendsSuccess implements Action {
  readonly type = GET_PEER_TRENDS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetPeerTrendsError implements Action {
  readonly type = GET_PEER_TRENDS_ERROR;
}

export class SetTrendsDomain implements Action {
  readonly type = SET_TRENDS_DOMAIN;

  constructor(public payload: {minDate: Date, maxDate: Date}) {}
}

export class SetTrendsPercentChange implements Action {
  readonly type = SET_TRENDS_PERCENT_CHANGE;

  constructor(public payload: TrendsSummaryDetails) {}
}

export class ToggleSaveTrendModal implements Action {
  readonly type = TOGGLE_SAVE_TREND_MODAL;

  constructor(public payload: {displayModal: boolean}) {}
}

export class Reset implements Action {
  readonly type = RESET;

  constructor() {}
}

export class ExportExchangeJobs implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS;
}

export class ExportExchangeJobsSuccess implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS_SUCCESS;
}

export class ExportExchangeJobsError implements Action {
  readonly type = EXPORT_EXCHANGE_JOBS_ERROR;
}

export class ExportCompanyJobs implements Action {
  readonly type = EXPORT_COMPANY_JOBS;
}

export class ExportCompanyJobsSuccess implements Action {
  readonly type = EXPORT_COMPANY_JOBS_SUCCESS;
}

export class ExportCompanyJobsError implements Action {
  readonly type = EXPORT_COMPANY_JOBS_ERROR;
}

export type Actions =
  GetPeerTrends |
  GetPeerTrendsSuccess |
  GetPeerTrendsError |
  SetTrendsDomain |
  SetTrendsPercentChange |
  ToggleSaveTrendModal |
  SavePeerTrend |
  SavePeerTrendSuccess |
  Reset |
  SavePeerTrendError |
  ExportExchangeJobs |
  ExportExchangeJobsSuccess |
  ExportExchangeJobsError |
  ExportCompanyJobs |
  ExportCompanyJobsSuccess |
  ExportCompanyJobsError;
