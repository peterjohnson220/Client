import { Action } from '@ngrx/store';

import { JobSearchPricingDataResponse } from 'libs/models/payfactors-api';
import { JobResult } from 'libs/features/add-jobs/models';

export const TOGGLE_JOB_SELECTION = '[Project Add Jobs/Search Results] Toggle Job Selection';
export const REPLACE_JOB_RESULTS = '[Project Add Jobs/Search Results] Replace Job Results';
export const ADD_JOB_RESULTS = '[Project Add Jobs/Search Results] Add Job Results';
export const CLEAR_SELECTED_JOBS = '[Project Add Jobs/Search Results] Clear Selected Jobs';
export const LOAD_JOB_PRICING_DATA = '[Project Add Jobs/Search Results] Load Pricing Data';
export const LOAD_JOB_PRICING_DATA_SUCCESS = '[Project Add Jobs/Search Results] Load Pricing Data Success';
export const LOAD_JOB_PRICING_DATA_ERROR = '[Project Add Jobs/Search Results] Load Pricing Data Error';
export const TOGGLE_JOB_DETAIL = '[Project Add Jobs/Search Results] Toggle Job Detail';

export class ToggleJobSelection implements Action {
  readonly type = TOGGLE_JOB_SELECTION;

  constructor(public payload: JobResult) {}
}

export class ReplaceJobResults implements Action {
  readonly type = REPLACE_JOB_RESULTS;

  constructor(public payload: JobResult[]) {}
}

export class AddJobResults implements Action {
  readonly type = ADD_JOB_RESULTS;

  constructor(public payload: JobResult[]) {}
}

export class ClearSelectedJobs implements Action {
  readonly type = CLEAR_SELECTED_JOBS;

  constructor() {}
}
export class ToggleJobDetail implements Action {
  readonly type = TOGGLE_JOB_DETAIL;

  constructor(public payload: JobResult) {}
}

export class GetJobPricingData implements Action {
  readonly type = LOAD_JOB_PRICING_DATA;

  constructor(public payload: JobResult) {}
}

export class GetJobPricingDataSuccess implements Action {
  readonly type = LOAD_JOB_PRICING_DATA_SUCCESS;

  constructor(public payload: { jobId: string, data: JobSearchPricingDataResponse }) {}
}

export class GetJobPricingDataError implements Action {
  readonly type = LOAD_JOB_PRICING_DATA_ERROR;

  constructor(public payload: string) {}
}

export type Actions
  = ToggleJobSelection
  | ReplaceJobResults
  | AddJobResults
  | ClearSelectedJobs
  | GetJobPricingData
  | GetJobPricingDataSuccess
  | GetJobPricingDataError
  | ToggleJobDetail;

