import { Action } from '@ngrx/store';

import { JobContext } from '../models';

export const SET_JOB_CONTEXT = '[Project Add Data/Add Survey Data Page] Set Job Context';
export const CLOSE_SURVEY_SEARCH = '[Project Add Data/Add Survey Data Page] Close Survey Search';

export class SetJobContext implements Action {
  readonly type = SET_JOB_CONTEXT;

  constructor(public payload: JobContext) {}
}

export class CloseSurveySearch implements Action {
  readonly type = CLOSE_SURVEY_SEARCH;

  constructor() {}
}

export type Actions
  = SetJobContext
  | CloseSurveySearch;
