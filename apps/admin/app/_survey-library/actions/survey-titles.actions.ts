import { Action } from '@ngrx/store';
import { SaveCustomCompanySurveyTitleRequestModel } from 'libs/models/payfactors-api/survey-library/request';

export const SAVE_CUSTOM_TITLE = '[Admin / Survey Library] Save Custom Survey Title';
export const SAVE_CUSTOM_TITLE_SUCCESS = '[Admin / Survey Library] Save Custom Survey Title Success';
export const SAVE_CUSTOM_TITLE_ERROR = '[Admin / Survey Library] Save Custom Survey Title Error';

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

export type Actions
  = SaveCustomTitle
  | SaveCustomTitleSuccess
  | SaveCustomTitleError;
