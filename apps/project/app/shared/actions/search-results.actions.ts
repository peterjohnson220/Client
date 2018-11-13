import { Action } from '@ngrx/store';

import {
  SearchResponse,
  SurveyDataResponse,
  PricingMatchesResponse
} from 'libs/models/survey-search';

import { JobResult, DataCutDetails } from '../models';

export const GET_RESULTS = '[Project Add Data/Search Results] Get Results';
export const GET_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get Results Success';
export const GET_MORE_RESULTS = '[Project Add Data/Search Results] Get More Results';
export const GET_MORE_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get More Results Success';
export const GET_RESULTS_ERROR = '[Project Add Data/Search Results] Get Results Error';
export const CLEAR_RESULTS = '[Project Add Data/Search Results] Clear Results';
export const TOGGLE_SURVEY_DATA_CUT_SELECTION = '[Project Add Data/Add Survey Data Page] Toggle Survey Data Cut Selection';
export const CLEAR_DATA_CUT_SELECTIONS = '[Project Add Data/Add Survey Data Page] Clear Data Cut Selections';
export const GET_SURVEY_DATA_RESULTS = '[Project Add Data/Search Results] Get Survey Data Results';
export const GET_SURVEY_DATA_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get Survey Data Results Success';
export const GET_SURVEY_DATA_RESULTS_ERROR = '[Project Add Data/Search Results] Get Survey Data Results Error';
export const UPDATE_RESULTS_MATCHES_COUNT = '[Project Add Data/Search Results] Update Results Matches Count';

export class GetResults implements Action {
  readonly type = GET_RESULTS;
  constructor(public payload: { keepFilteredOutOptions: boolean }) {}
}

export class GetResultsSuccess implements Action {
  readonly type = GET_RESULTS_SUCCESS;

  constructor(public payload: SearchResponse) {}
}

export class GetMoreResults implements Action {
  readonly type = GET_MORE_RESULTS;
}

export class GetMoreResultsSuccess implements Action {
  readonly type = GET_MORE_RESULTS_SUCCESS;

  constructor(public payload: SearchResponse) {}
}

export class GetResultsError implements Action {
  readonly type = GET_RESULTS_ERROR;

  constructor() {}
}

export class ClearResults implements Action {
  readonly type = CLEAR_RESULTS;
}

export class ToggleSurveyDataCutSelection implements Action {
  readonly type = TOGGLE_SURVEY_DATA_CUT_SELECTION;

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

  constructor(public payload: SurveyDataResponse) {}
}

export class GetSurveyDataResultsError implements Action {
  readonly type = GET_SURVEY_DATA_RESULTS_ERROR;

  constructor(public payload: number) {}
}

export class UpdateResultsMatchesCount implements Action {
  readonly type = UPDATE_RESULTS_MATCHES_COUNT;

  constructor(public payload: PricingMatchesResponse) {}
}

export type Actions
  = GetResults
  | GetResultsSuccess
  | GetMoreResults
  | GetMoreResultsSuccess
  | GetResultsError
  | ClearResults
  | ToggleSurveyDataCutSelection
  | ClearDataCutSelections
  | GetSurveyDataResults
  | GetSurveyDataResultsSuccess
  | GetSurveyDataResultsError
  | UpdateResultsMatchesCount;
