import { Action } from '@ngrx/store';

import { FlsaQuestionnaireDetails } from '../models';

export const LOAD_FLSA_QUESTIONNAIRE = '[job-description-management / FLSA Questionnaire] Load FLSA Questionnaire';
export const LOAD_FLSA_QUESTIONNAIRE_ERROR = '[job-description-management / FLSA Questionnaire] Load FLSA Questionnaire Error';
export const LOAD_FLSA_QUESTIONNAIRE_SUCCESS = '[job-description-management / FLSA Questionnaire] Load FLSA Questionnaire Success';
export const SAVE_FLSA_QUESTIONNAIRE = '[job-description-management / FLSA Questionnaire] Save FLSA Questionnaire';
export const SAVE_FLSA_QUESTIONNAIRE_SUCCESS = '[job-description-management / FLSA Questionnaire] Save FLSA Questionnaire Success';
export const SAVE_FLSA_QUESTIONNAIRE_ERROR = '[job-description-management / FLSA Questionnaire] Save FLSA Questionnaire Error';
export const SELECT_FLSA_QUESTION = '[job-description-management / FLSA Questionnaire] Select FLSA Question';

export class LoadFlsaQuestionnaire implements Action {
  readonly type = LOAD_FLSA_QUESTIONNAIRE;

  constructor(public payload: {jobDescriptionId: number, version: number, isHistorical: boolean}) {}
}
export class LoadFlsaQuestionnaireError implements Action {
  readonly type = LOAD_FLSA_QUESTIONNAIRE_ERROR;

  constructor() {}
}
export class LoadFlsaQuestionnaireSuccess implements Action {
  readonly type = LOAD_FLSA_QUESTIONNAIRE_SUCCESS;

  constructor(public payload: FlsaQuestionnaireDetails) {}
}
export class SaveFlsaQuestionnaire implements Action {
  readonly type = SAVE_FLSA_QUESTIONNAIRE;

  constructor() {}
}
export class SaveFlsaQuestionnaireSuccess implements Action {
  readonly type = SAVE_FLSA_QUESTIONNAIRE_SUCCESS;

  constructor(public payload: { FlsaQuestionnaireVersion: number, FlsaQuestionnaireStatus: number, EditDate: any, EditUser: string }) {}
}
export class SaveFlsaQuestionnaireError implements Action {
  readonly type = SAVE_FLSA_QUESTIONNAIRE_ERROR;

  constructor() {}
}
export class SelectFlsaQuestion implements Action {
  readonly type = SELECT_FLSA_QUESTION;

  constructor(public payload: {exemption: string, question: string, selected: boolean}) {}
}
export type Actions
  = LoadFlsaQuestionnaire
  | LoadFlsaQuestionnaireError
  | LoadFlsaQuestionnaireSuccess
  | SaveFlsaQuestionnaire
  | SaveFlsaQuestionnaireSuccess
  | SaveFlsaQuestionnaireError
  | SelectFlsaQuestion;
