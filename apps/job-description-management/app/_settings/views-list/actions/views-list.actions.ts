import { Action } from '@ngrx/store';

import { FilterableName } from 'libs/core/interfaces';

export const LOAD_JOB_DESCRIPTION_VIEWS = '[Job Description Management / Views List] Load Views';
export const LOAD_JOB_DESCRIPTION_VIEWS_SUCCESS = '[Job Description Management / Views List] Load Views Success';
export const LOAD_JOB_DESCRIPTION_VIEWS_ERROR = '[Job Description Management / Views List] Load Views Error';
export const DELETE_VIEW = '[Job Description Management / Views List] Delete View';

export class LoadJobDescriptionViews implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_VIEWS;
}

export class LoadJobDescriptionViewsSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_VIEWS_SUCCESS;

  constructor(public payload: FilterableName[]) {}
}

export class LoadJobDescriptionViewsError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_VIEWS_ERROR;
}

export class DeleteView implements Action {
  readonly type = DELETE_VIEW;

  constructor(public payload: { viewName: string }) {}
}

export type Actions
  = LoadJobDescriptionViews
  | LoadJobDescriptionViewsSuccess
  | LoadJobDescriptionViewsError
  | DeleteView;