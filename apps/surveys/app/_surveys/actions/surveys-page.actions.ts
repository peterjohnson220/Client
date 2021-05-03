import { Action } from '@ngrx/store';

export const OPEN_SURVEY_FIELDS_MODAL = '[Surveys / Surveys Page] Open Survey Fields Modal';
export const CLOSE_SURVEY_FIELDS_MODAL = '[Surveys / Surveys Page] Close Survey Fields Modal';

export class OpenSurveyFieldsModal implements Action {
  readonly type = OPEN_SURVEY_FIELDS_MODAL;
  constructor() {}
}

export class CloseSurveyFieldsModal implements Action {
  readonly type = CLOSE_SURVEY_FIELDS_MODAL;
  constructor() {}
}

export type Actions
  = OpenSurveyFieldsModal
  | CloseSurveyFieldsModal;
