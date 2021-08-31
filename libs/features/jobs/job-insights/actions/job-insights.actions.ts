import { Action } from '@ngrx/store';

import { GenericKeyValue } from 'libs/models/common';

import { GetJobInsightsRequest, JobInsights } from 'libs/models/payfactors-api';

export const LOAD_JOB_INSIGHTS = '[Jobs / Job Insights] Load Job Insights';
export const LOAD_JOB_INSIGHTS_FOR_PRINT = '[Jobs / Job Insights] Load Job Insights For Print';
export const LOAD_JOB_INSIGHTS_SUCCESS = '[Jobs / Job Insights] Load Job Insights Success';
export const LOAD_JOB_INSIGHTS_ERROR = '[Jobs / Job Insights] Load Job Insights Error';
export const LOAD_CUSTOM_JOB_FIELDS = '[Jobs / Job Insights] Load Custom Job Fields';
export const LOAD_CUSTOM_JOB_FIELDS_SUCCESS = '[Jobs / Job Insights] Load Custom Job Fields Success';
export const LOAD_CUSTOM_JOB_FIELDS_ERROR = '[Jobs / Job Insights] Load Custom Job Fields Error';
export const RESET_JOB_INSIGHTS = '[Jobs / Job Insights] Reset Job Insights';

export class LoadJobInsights implements Action {
  readonly type = LOAD_JOB_INSIGHTS;
  constructor(public payload: GetJobInsightsRequest) {}
}

export class LoadJobInsightsForPrint implements Action {
  readonly type = LOAD_JOB_INSIGHTS_FOR_PRINT;
  constructor(public payload: GetJobInsightsRequest) {}
}

export class LoadJobInsightsSuccess implements Action {
  readonly type = LOAD_JOB_INSIGHTS_SUCCESS;
  constructor(public payload: JobInsights) {}
}

export class LoadJobInsightsError implements Action {
  readonly type = LOAD_JOB_INSIGHTS_ERROR;
  constructor() {}
}

export class LoadCustomJobFields implements Action {
  readonly type = LOAD_CUSTOM_JOB_FIELDS;
  constructor(public payload: { companyId: number }) {}
}

export class LoadCustomJobFieldsSuccess implements Action {
  readonly type = LOAD_CUSTOM_JOB_FIELDS_SUCCESS;
  constructor(public payload: GenericKeyValue<string, string>[]) {}
}

export class LoadCustomJobFieldsError implements Action {
  readonly type = LOAD_CUSTOM_JOB_FIELDS_ERROR;
  constructor() {}
}

export class ResetJobInsights implements Action {
  readonly type = RESET_JOB_INSIGHTS;
  constructor() {}
}

export type Actions
  = LoadJobInsights
  | LoadJobInsightsForPrint
  | LoadJobInsightsSuccess
  | LoadJobInsightsError
  | LoadCustomJobFields
  | LoadCustomJobFieldsSuccess
  | LoadCustomJobFieldsError
  | ResetJobInsights;

