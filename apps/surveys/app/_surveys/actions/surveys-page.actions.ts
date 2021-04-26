import { Action } from '@ngrx/store';

export const LOAD_SURVEYS  = '[Surveys / Surveys Page] Load Surveys';

export class LoadSurveys implements Action {
  readonly type = LOAD_SURVEYS;

  constructor() {}
}

export type Actions
  = LoadSurveys;
