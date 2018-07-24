import { Action } from '@ngrx/store';

import {SearchResponse, SurveyDataCutResponse} from 'libs/models/survey-search';
import {JobResult} from '../models/job-result.model';

export const GET_RESULTS = '[Project Add Data/Search Results] Get Results';
export const GET_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get Results Success';
export const GET_MORE_RESULTS = '[Project Add Data/Search Results] Get More Results';
export const GET_MORE_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get More Results Success';
export const CLEAR_RESULTS = '[Project Add Data/Search Results] Clear Results';
export const OPEN_TOOLTIP = '[Project Add Data/Search Results] Open Tooltip';
export const CLOSE_TOOLTIP = '[Project Add Data/Search Results] Close Tooltip';
export const GET_SURVEY_DATA_RESULTS = '[Project Add Data/Search Results] Get Survey Data Results';
export const GET_SURVEY_DATA_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get Survey Data Results Success';
export const SHOW_SURVEY_DATA_RESULTS = '[Project Add Data/Search Results] Show Survey Data Results';
export const HIDE_SURVEY_DATA_RESULTS = '[Project Add Data/Search Results] Hide Survey Data Results';

export class GetResults implements Action {
  readonly type = GET_RESULTS;
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

export class ClearResults implements Action {
  readonly type = CLEAR_RESULTS;
}

export class OpenTooltip implements Action {
  readonly type = OPEN_TOOLTIP;
}

export class CloseTooltip implements Action {
  readonly type = CLOSE_TOOLTIP;
}

export class GetSurveyDataResults implements Action {
  readonly type = GET_SURVEY_DATA_RESULTS;

  constructor(public payload: JobResult) {}
}

export class ShowSurveyDataResults implements Action {
  readonly type = SHOW_SURVEY_DATA_RESULTS;

  constructor(public payload: JobResult) {}
}

export class GetSurveyDataResultsSuccess implements Action {
  readonly type = GET_SURVEY_DATA_RESULTS_SUCCESS;

  constructor(public payload: SurveyDataCutResponse) {}
}

export class HideSurveyDataResults implements Action {
  readonly type = HIDE_SURVEY_DATA_RESULTS;

  constructor(public payload: JobResult) {}
}

export type Actions
  = GetResults
  | GetResultsSuccess
  | GetMoreResults
  | GetMoreResultsSuccess
  | ClearResults
  | OpenTooltip
  | CloseTooltip
  | GetSurveyDataResults
  | GetSurveyDataResultsSuccess
  | ShowSurveyDataResults
  | HideSurveyDataResults;
