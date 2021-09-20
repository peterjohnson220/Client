import { Action } from '@ngrx/store';

import { JobData, JobGridData } from 'libs/models/comphub';
import { GetCrowdSourcedJobPricingRequest } from 'libs/models/payfactors-api';

import { QuickPriceGridContext } from '../models';


export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Jobs Card] Get Quick Price Data';
export const GET_QUICK_PRICE_DATA_SUCCESS  = '[Comphub/Jobs Card] Get Quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Jobs Card] Get Quick Price Data Error';
export const LOAD_MORE_DATA_SUCCESS = '[Comphub/Jobs Card] Load More Data Success';
export const TOGGLE_JOB_DESCRIPTION = '[Comphub/Jobs Card] Toggle Job Description';
export const GET_PEER_JOB_DATA = '[Comphub/Jobs Card] Get Peer Job Data';
export const SEARCH_CROWD_SOURCED_JOBS_BY_TITLE = '[Comphub/Crowd Sourced Page] Search Crowd Sourced Jobs By Title';
export const SEARCH_CROWD_SOURCED_JOBS_BY_TITLE_SUCCESS = '[Comphub/Crowd Sourced Page] Search Crowd Sourced Jobs By Title Success';
export const SEARCH_CROWD_SOURCED_JOBS_BY_TITLE_ERROR = '[Comphub/Crowd Sourced Page] Search Crowd Sourced Jobs By Title Error';
export const GET_CROWD_SOURCED_JOB_PRICING = '[Comphub/Crowd Sourced Page] Get Crowd Sourced Job Pricing';
export const GET_CROWD_SOURCED_JOB_PRICING_SUCCESS = '[Comphub/Crowd Sourced Page] Get Crowd Sourced Job Pricing Success';
export const GET_CROWD_SOURCED_JOB_PRICING_ERROR = '[Comphub/Crowd Sourced Page] Get Crowd Sourced Job Pricing Error';
export const TOGGLE_CROWD_SOURCED_TASKS = '[Comphub/ Crowd Sourced Page] Toggle Crowd Sourced Tasks';

export class GetQuickPriceMarketData implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA;

  constructor(public payload: QuickPriceGridContext) {}
}

export class GetQuickPriceDataSuccess implements Action {
  readonly type = GET_QUICK_PRICE_DATA_SUCCESS;

  constructor(public payload: JobGridData) {}
}

export class GetQuickPriceMarketDataError implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA_ERROR;
}

export class LoadMoreDataSuccess implements Action {
  readonly type = LOAD_MORE_DATA_SUCCESS;

  constructor(public payload: JobData[]) {}
}

export class ToggleJobDescription implements Action {
  readonly type = TOGGLE_JOB_DESCRIPTION;

  constructor(public payload: { jobId: number }) {}
}

export class GetPeerJobData implements Action {
  readonly type = GET_PEER_JOB_DATA;
}

export class SearchCrowdSourcedJobsByTitle implements Action {
  readonly type = SEARCH_CROWD_SOURCED_JOBS_BY_TITLE;

  constructor(public payload: string) {}
}

export class SearchCrowdSourcedJobsByTitleSuccess implements Action {
  readonly type = SEARCH_CROWD_SOURCED_JOBS_BY_TITLE_SUCCESS;

  constructor(public payload: JobGridData) {}
}

export class SearchCrowdSourcedJobsByTitleError implements Action {
  readonly type = SEARCH_CROWD_SOURCED_JOBS_BY_TITLE_ERROR;

  constructor() {}
}
export class GetCrowdSourcedJobPricing implements Action {
  readonly type = GET_CROWD_SOURCED_JOB_PRICING;

  constructor(public payload: GetCrowdSourcedJobPricingRequest) {}
}

export class GetCrowdSourcedJobPricingSuccess implements Action {
  readonly type = GET_CROWD_SOURCED_JOB_PRICING_SUCCESS;

  constructor(public payload: JobData) {}
}

export class GetCrowdSourcedJobPricingError implements Action {
  readonly type = GET_CROWD_SOURCED_JOB_PRICING_ERROR;

  constructor() {}
}

export class ToggleCrowdSourcedTasks implements Action {
  readonly type = TOGGLE_CROWD_SOURCED_TASKS;

  constructor(public payload: {jobTitle: string}) {}
}

export type Actions
  = GetQuickPriceMarketData
  | GetQuickPriceDataSuccess
  | GetQuickPriceMarketDataError
  | LoadMoreDataSuccess
  | ToggleJobDescription
  | GetPeerJobData
  | SearchCrowdSourcedJobsByTitle
  | SearchCrowdSourcedJobsByTitleSuccess
  | SearchCrowdSourcedJobsByTitleError
  | GetCrowdSourcedJobPricing
  | GetCrowdSourcedJobPricingSuccess
  | GetCrowdSourcedJobPricingError
  | ToggleCrowdSourcedTasks;
