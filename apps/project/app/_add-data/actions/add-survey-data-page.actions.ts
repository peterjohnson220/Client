import { Action } from '@ngrx/store';

import { JobContext } from '../models';

export const SET_JOB_CONTEXT = '[Project Add Data/Add Survey Data Page] Set Job Context';
export const CLOSE_SURVEY_SEARCH = '[Project Add Data/Add Survey Data Page] Close Survey Search';
export const ADD_DATA = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project';
export const ADD_DATA_SUCCESS = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project Success';
export const ADD_DATA_ERROR = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project Error';

export class SetJobContext implements Action {
  readonly type = SET_JOB_CONTEXT;

  constructor(public payload: JobContext) {}
}

export class CloseSurveySearch implements Action {
  readonly type = CLOSE_SURVEY_SEARCH;

  constructor() {}
}

export class AddData implements Action {
  readonly type = ADD_DATA;

  constructor(public payload: boolean) {}
}

export class AddDataSuccess implements Action {
  readonly type = ADD_DATA_SUCCESS;

  constructor(public payload: number[]) {}
}

export class AddDataError implements Action {
  readonly type = ADD_DATA_ERROR;

  constructor() {}
}


export type Actions
  = SetJobContext
  | CloseSurveySearch
  | AddData
  | AddDataSuccess
  | AddDataError;
