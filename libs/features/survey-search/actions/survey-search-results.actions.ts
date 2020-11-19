import { Action } from '@ngrx/store';

import { PricingMatchesResponse } from 'libs/models/payfactors-api/survey-search';

import { JobResult, DataCutDetails } from '../models';

export const REPLACE_JOB_RESULTS = '[Project/Survey Search] Replace Job Results';
export const ADD_JOB_RESULTS = '[Project/Survey Search] Add Job Results';
export const CLEAR_RESULTS = '[Project/Survey Search] Clear Results';
export const TOGGLE_DATA_CUT_SELECTION = '[Project/Survey Search] Toggle Data Cut Selection';
export const CLEAR_DATA_CUT_SELECTIONS = '[Project/Survey Search] Clear Data Cut Selections';
export const GET_SURVEY_DATA_RESULTS = '[Project/Survey Search] Get Survey Data Results';
export const GET_SURVEY_DATA_RESULTS_SUCCESS = '[Project/Survey Search] Get Survey Data Results Success';
export const GET_SURVEY_DATA_RESULTS_ERROR = '[Project/Survey Search] Get Survey Data Results Error';
export const GET_EXCHANGE_DATA_RESULTS = '[Project/Survey Search] Get Exchange Data Results';
export const GET_EXCHANGE_DATA_RESULTS_SUCCESS = '[Project/Survey Search] Get Exchange Data Results Success';
export const GET_EXCHANGE_DATA_RESULTS_ERROR = '[Project/Survey Search] Get Exchange Data Results Error';
export const UPDATE_RESULTS_MATCHES_COUNT = '[Project/Survey Search] Update Results Matches Count';
export const REFINE_EXCHANGE_JOB_RESULT = '[Project/Survey Search] Refine Exchange Job Result';
export const REFINE_EXCHANGE_JOB_RESULT_COMPLETE = '[Project/Survey Search] Refine Exchange Job Result Complete';

export class ReplaceJobResults implements Action {
  readonly type = REPLACE_JOB_RESULTS;

  constructor(public payload: JobResult[]) {}
}

export class AddJobResults implements Action {
  readonly type = ADD_JOB_RESULTS;

  constructor(public payload: JobResult[]) {}
}

export class ClearResults implements Action {
  readonly type = CLEAR_RESULTS;
}

export class ToggleDataCutSelection implements Action {
  readonly type = TOGGLE_DATA_CUT_SELECTION;

  constructor(public payload: DataCutDetails) {}
}

export class ClearDataCutSelections implements Action {
  readonly type = CLEAR_DATA_CUT_SELECTIONS;

  constructor() {}
}

export class GetSurveyDataResults implements Action {
  readonly type = GET_SURVEY_DATA_RESULTS;

  constructor(public payload: JobResult) {}
}

export class GetSurveyDataResultsSuccess implements Action {
  readonly type = GET_SURVEY_DATA_RESULTS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetSurveyDataResultsError implements Action {
  readonly type = GET_SURVEY_DATA_RESULTS_ERROR;

  constructor(public payload: number) {}
}

export class GetExchangeDataResults implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS;

  constructor(public payload: JobResult) {}
}

export class GetExchangeDataResultsSuccess implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetExchangeDataResultsError implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS_ERROR;

  constructor(public payload: { exchangeJobId: number }) {}
}

export class UpdateResultsMatchesCount implements Action {
  readonly type = UPDATE_RESULTS_MATCHES_COUNT;

  constructor(public payload: PricingMatchesResponse) {}
}

export class RefineExchangeJobResult implements Action {
  readonly type = REFINE_EXCHANGE_JOB_RESULT;

  constructor(public payload: {lockedExchangeJobId: number}|{exchangeId: number, exchangeJobTitle: string}) { }
}

export class RefineExchangeJobResultComplete implements Action {
  readonly type = REFINE_EXCHANGE_JOB_RESULT_COMPLETE;

  constructor() { }
}

export type Actions
  = AddJobResults
  | ReplaceJobResults
  | ClearResults
  | ToggleDataCutSelection
  | ClearDataCutSelections
  | GetSurveyDataResults
  | GetSurveyDataResultsSuccess
  | GetSurveyDataResultsError
  | GetExchangeDataResults
  | GetExchangeDataResultsSuccess
  | GetExchangeDataResultsError
  | UpdateResultsMatchesCount
  | RefineExchangeJobResult
  | RefineExchangeJobResultComplete;
