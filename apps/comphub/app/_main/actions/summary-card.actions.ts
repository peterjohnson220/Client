import { Action } from '@ngrx/store';

import { JobData, JobSalaryTrend } from '../models';
import { SharePricingSummaryRequest } from 'libs/models/payfactors-api';

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
  | SetProjectTileAccess;
