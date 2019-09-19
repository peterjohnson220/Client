import { Action } from '@ngrx/store';
import { SaveCustomCompanySurveyTitleRequestModel } from 'libs/models/payfactors-api/survey-library/request';
import { SurveyTitleResponseModel, SurveyTitlesFilter } from '../models';

export const SAVE_CUSTOM_TITLE = '[Admin / Survey Library] Save Custom Survey Title';
export const SAVE_CUSTOM_TITLE_SUCCESS = '[Admin / Survey Library] Save Custom Survey Title Success';
export const SAVE_CUSTOM_TITLE_ERROR = '[Admin / Survey Library] Save Custom Survey Title Error';
export const SAVE_SURVEY_TITLE = '[Admin / Survey Library] Save Survey Title';
export const SAVE_SURVEY_TITLE_SUCCESS = '[Admin / Survey Library] Save Survey Title Success';
export const SAVE_SURVEY_TITLE_ERROR = '[Admin / Survey Library] Save Survey Title Error';
export const LOADING_SURVEY_TITLES = '[Admin / Survey Library] Load Survey Titles';
export const LOADING_SURVEY_TITLES_SUCCESS = '[Admin / Survey Library] Load Survey Titles Success';
export const LOADING_SURVEY_TITLES_ERROR = '[Admin / Survey Library] Load Survey Titles Error';

export class SaveCustomTitle implements Action {
  readonly type = SAVE_CUSTOM_TITLE;

  constructor(public payload: {surveyTitleId: number, request: SaveCustomCompanySurveyTitleRequestModel}) { }
}

export class SaveCustomTitleSuccess implements Action {
  readonly type = SAVE_CUSTOM_TITLE_SUCCESS;

  constructor(public companyId: number, public titleId: number) {}
}

export class SaveCustomTitleError implements Action {
  readonly type = SAVE_CUSTOM_TITLE_ERROR;
}

export class SaveSurveyTitle implements Action {
  readonly type = SAVE_SURVEY_TITLE;

  constructor(public payload: any) { }
}

export class SaveSurveyTitleSuccess implements Action {
  readonly type = SAVE_SURVEY_TITLE_SUCCESS;
}

export class SaveSurveyTitleError implements Action {
  readonly type = SAVE_SURVEY_TITLE_ERROR;
}
export class LoadingSurveyTitles implements Action {
  readonly type = LOADING_SURVEY_TITLES;

  constructor(public payload: {publisherId: number, filter: SurveyTitlesFilter}) { }
}

export class LoadingSurveyTitlesSuccess implements Action {
  readonly type = LOADING_SURVEY_TITLES_SUCCESS;

  constructor(public payload: SurveyTitleResponseModel) {}
}

export class LoadingSurveyTitlesError implements Action {
  readonly type = LOADING_SURVEY_TITLES_ERROR;
}

export type Actions
  = SaveCustomTitle
  | SaveCustomTitleSuccess
  | SaveCustomTitleError
  | SaveSurveyTitle
  | SaveSurveyTitleSuccess
  | SaveSurveyTitleError
  | LoadingSurveyTitles
  | LoadingSurveyTitlesSuccess
  | LoadingSurveyTitlesError;
