import { Action } from '@ngrx/store';

import { SharePricingSummaryRequest } from 'libs/models/payfactors-api';

import { JobData, JobSalaryTrend } from '../models';

export const PRICE_NEW_JOB = '[Comphub/Summary Card] Price New Job';
export const GET_JOB_NATIONAL_TREND = '[Comphub/Summary Card] Get National Job Trend';
export const GET_JOB_NATIONAL_TREND_SUCCESS = '[Comphub/Summary Card] Get National Job Trend Success';
export const GET_JOB_NATIONAL_TREND_ERROR = '[Comphub/Summary Card] Get National Job Trend Error';
export const OPEN_SHARE_MODAL = '[Comphub/Summary Card] Open Share Modal';
export const CLOSE_SHARE_MODAL = 'Comphub/Summary Card] Close Share Modal';
export const SHARE_PRICING_SUMMARY = '[Comphub/Summary Card] Share Pricing Summary';
export const SHARE_PRICING_SUMMARY_ERROR = '[Comphub/Summary Card] Share Pricing Summary Error';
export const SHARE_PRICING_SUMMARY_CONFLICT = '[Comphub/Summary Card] Share Pricing Summary Conflict';
export const CREATE_PROJECT = '[Comphub/Summary Card] Create Project';
export const CREATE_PROJECT_SUCCESS = '[Comphub/Summary Card] Create Project Success';
export const CREATE_PROJECT_ERROR = '[Comphub/Summary Card] Create Project Error';
export const RESET_CREATE_PROJECT_STATUS = '[Comphub/Summary Card] Reset Create Project';
export const SET_PROJECT_TILE_ACCESS = '[Comphub/Summary Card] Set Project Tile Access';
export const ADD_COMPLETED_PRICING_HISTORY = '[Comphub/Summary Card] Create Completed Pricing History';
export const ADD_COMPLETED_PRICING_HISTORY_SUCCESS = '[Comphub/Summary Card] Create Completed Pricing History Success';
export const ADD_COMPLETED_PRICING_HISTORY_ERROR = '[Comphub/Summary Card] Create Completed Pricing History Error';
export const TOGGLE_GLOSSARY_DISPLAY = '[Comphub/Summary Card] Toggle Glossary Display';
export const SET_MIN_PAYMARKET_MINIMUM_WAGE = '[Comphub/Summary Card] Set Min Paymarket Minimum Wage';
export const SET_MAX_PAYMARKET_MINIMUM_WAGE = '[Comphub/Summary Card] Set Max Paymarket Minimum Wage';
export const PRICE_NEW_PEER_JOB = '[Comphub/Summary Card] Price New Peer Job';
export const RECALCULATE_JOB_DATA = '[Comphub/Summary Card] Recalculate Job';
export const RECALCULATE_JOB_DATA_SUCCESS = '[Comphub/Summary Card] Recalculate Job Success';
export const RECALCULATE_JOB_DATA_ERROR = '[Comphub/Summary Card] Recalculate Job Error';

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

export class OpenShareModal implements Action {
  readonly type = OPEN_SHARE_MODAL;

  constructor() {}
}

export class CloseShareModal implements Action {
  readonly type = CLOSE_SHARE_MODAL;

  constructor() {}
}

export class SharePricingSummary implements Action {
  readonly type = SHARE_PRICING_SUMMARY;

  constructor(public payload: SharePricingSummaryRequest) {}
}

export class SharePricingSummaryError implements Action {
  readonly type = SHARE_PRICING_SUMMARY_ERROR;

  constructor() {}
}

export class SharePricingSummaryConflict implements Action {
  readonly type = SHARE_PRICING_SUMMARY_CONFLICT;

  constructor() {}
}

export class CreateProject implements Action {
  readonly type = CREATE_PROJECT;

  constructor() {}
}

export class CreateProjectSuccess implements Action {
  readonly type = CREATE_PROJECT_SUCCESS;

  constructor(public payload: number) {}
}

export class CreateProjectError implements Action {
  readonly type = CREATE_PROJECT_ERROR;

  constructor() {}
}

export class ResetCreateProjectStatus implements Action {
  readonly type = RESET_CREATE_PROJECT_STATUS;

  constructor() {}
}

export class SetProjectTileAccess implements Action {
  readonly type = SET_PROJECT_TILE_ACCESS;

  constructor(public payload: boolean) {}
}

export class AddCompletedPricingHistory implements Action {
  readonly type = ADD_COMPLETED_PRICING_HISTORY;

  constructor(public payload: JobData) {}
}

export class AddCompletedPricingHistorySuccess implements Action {
  readonly type = ADD_COMPLETED_PRICING_HISTORY_SUCCESS;

  constructor() {}
}

export class AddCompletedPricingHistoryError implements Action {
  readonly type = ADD_COMPLETED_PRICING_HISTORY_ERROR;

  constructor() {}
}

export class ToggleGlossaryDisplay implements Action {
  readonly type = TOGGLE_GLOSSARY_DISPLAY;

  constructor(public payload: { open: boolean}) {}
}

export class SetMinPaymarketMinimumWage implements Action {
  readonly type = SET_MIN_PAYMARKET_MINIMUM_WAGE;

  constructor(public payload: number) {}
}

export class SetMaxPaymarketMinimumWage implements Action {
  readonly type = SET_MAX_PAYMARKET_MINIMUM_WAGE;

  constructor(public payload: number) {}
}

export class PriceNewPeerJob implements Action {
  readonly type = PRICE_NEW_PEER_JOB;
}

export class RecalculateJobData implements Action {
  readonly type = RECALCULATE_JOB_DATA;
}

export class RecalculateJobDataSuccess implements Action {
  readonly type = RECALCULATE_JOB_DATA_SUCCESS;
}

export class RecalculateJobDataError implements Action {
  readonly type = RECALCULATE_JOB_DATA_ERROR;
}

export type Actions
  = PriceNewJob
  | GetNationalJobTrendData
  | GetNationalJobTrendDataSuccess
  | GetNationalJobTrendDataError
  | OpenShareModal
  | CloseShareModal
  | SharePricingSummary
  | SharePricingSummaryError
  | SharePricingSummaryConflict
  | CreateProject
  | CreateProjectSuccess
  | CreateProjectError
  | ResetCreateProjectStatus
  | SetProjectTileAccess
  | AddCompletedPricingHistory
  | AddCompletedPricingHistorySuccess
  | AddCompletedPricingHistoryError
  | ToggleGlossaryDisplay
  | SetMinPaymarketMinimumWage
  | SetMaxPaymarketMinimumWage
  | PriceNewPeerJob
  | RecalculateJobData
  | RecalculateJobDataSuccess
  | RecalculateJobDataError;
