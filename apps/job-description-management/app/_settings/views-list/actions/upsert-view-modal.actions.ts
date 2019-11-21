import { Action } from '@ngrx/store';

import { TemplateListItem } from 'libs/models/jdm';

import { JobDescriptionView } from '../../shared/models';

export const LOAD_AVAILABLE_TEMPLATES = '[Job Description Management / Upsert View Modal] Load Available Templates';
export const LOAD_AVAILABLE_TEMPLATES_SUCCESS = '[Job Description Management / Upsert View Modal] Load Available Templates Success';
export const LOAD_AVAILABLE_TEMPLATES_ERROR = '[Job Description Management / Upsert View Modal] Load Available Templates Error';
export const LOAD_JOB_DESCRIPTION_VIEWS = '[Job Description Management / Upsert View Modal] Load Job Description Views';
export const LOAD_JOB_DESCRIPTION_VIEWS_SUCCESS = '[Job Description Management / Upsert View Modal] Load Job Description Views Success';
export const LOAD_JOB_DESCRIPTION_VIEWS_ERROR = '[Job Description Management / Upsert View Modal] Load Job Description Views Error';
export const ADD_VIEW = '[Job Description Management / Upsert View Modal] Add View';
export const ADD_VIEW_SUCCESS = '[Job Description Management / Upsert View Modal] Add View Success';
export const ADD_VIEW_ERROR = '[Job Description Management / Upsert View Modal] Add View Error';
export const UPDATE_VIEW = '[Job Description Management / Upsert View Modal] Update View';
export const UPDATE_VIEW_SUCCESS = '[Job Description Management / Upsert View Modal] Update View Success';
export const UPDATE_VIEW_ERROR = '[Job Description Management / Upsert View Modal] Update View Error';
export const OPEN_UPSERT_VIEW_MODAL = '[Job Description Management / Upsert View Modal] Open Upsert View Modal';
export const CLOSE_UPSERT_VIEW_MODAL = '[Job Description Management / Upsert View Modal] Close Upsert View Modal';
export const SET_EDITING_VIEW_NAME = '[Job Description Management / Upsert View Modal] Set Editing View Name';
export const CLEAR_ASSIGNED_TEMPLATES = '[Job Description Management / Upsert View Modal] Clear Assigned Templates';

export class LoadAvailableTemplates implements Action {
  readonly type = LOAD_AVAILABLE_TEMPLATES;
}

export class LoadAvailableTemplatesSuccess implements Action {
  readonly type = LOAD_AVAILABLE_TEMPLATES_SUCCESS;

  constructor(public payload: TemplateListItem[]) {}
}

export class LoadAvailableTemplatesError implements Action {
  readonly type = LOAD_AVAILABLE_TEMPLATES_ERROR;
}

export class LoadJobDescriptionViews implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_VIEWS;

  constructor(public payload: { viewName: string }) { }
}

export class LoadJobDescriptionViewsSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_VIEWS_SUCCESS;

  constructor(public payload: JobDescriptionView[]) {}
}

export class LoadJobDescriptionViewsError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_VIEWS_ERROR;
}

export class AddView implements Action {
  readonly type = ADD_VIEW;

  constructor(public payload: { viewName: string, templateIds: number[] }) {}
}

export class AddViewSuccess implements Action {
  readonly type = ADD_VIEW_SUCCESS;
}

export class AddViewError implements Action {
  readonly type = ADD_VIEW_ERROR;

  constructor(public payload: string) { }
}

export class UpdateView implements Action {
  readonly type = UPDATE_VIEW;

  constructor(public payload: { viewName: string, templateIds: number[] }) {}
}

export class UpdateViewSuccess implements Action {
  readonly type = UPDATE_VIEW_SUCCESS;
}

export class UpdateViewError implements Action {
  readonly type = UPDATE_VIEW_ERROR;

  constructor(public payload: string) { }
}

export class OpenUpsertViewModal implements Action {
  readonly type = OPEN_UPSERT_VIEW_MODAL;
}

export class CloseUpsertViewModal implements Action {
  readonly type = CLOSE_UPSERT_VIEW_MODAL;
}

export class SetEditingViewName implements Action {
  readonly type = SET_EDITING_VIEW_NAME;

  constructor(public payload: { editingViewName: string }) { }
}

export class ClearAssignedTemplates implements Action {
  readonly type = CLEAR_ASSIGNED_TEMPLATES;
}

export type Actions
  = LoadAvailableTemplates
  | LoadAvailableTemplatesSuccess
  | LoadAvailableTemplatesError
  | LoadJobDescriptionViews
  | LoadJobDescriptionViewsSuccess
  | LoadJobDescriptionViewsError
  | AddView
  | AddViewSuccess
  | AddViewError
  | UpdateView
  | UpdateViewSuccess
  | UpdateViewError
  | OpenUpsertViewModal
  | CloseUpsertViewModal
  | SetEditingViewName
  | ClearAssignedTemplates;
