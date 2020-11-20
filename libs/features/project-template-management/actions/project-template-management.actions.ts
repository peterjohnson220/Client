import { Action } from '@ngrx/store';

import { CompositeField, ProjectTemplateFields } from 'libs/models';
import { SaveProjectTemplateRequest } from 'libs/models/payfactors-api/project/request';

export const HANDLE_API_ERROR = '[ProjectTemplateManagement] Handle API Error';
export const SHOW_PROJECT_TEMPLATE_FORM = '[ProjectTemplateManagement] Show Template Form';
export const GET_PROJECT_TEMPLATE_FIELDS = '[ProjectTemplateManagement] Get Project Template Fields';
export const GET_PROJECT_TEMPLATE_FIELDS_SUCCESS = '[ProjectTemplateManagement] Get Project Template Fields Success';
export const GET_PROJECT_TEMPLATE_FIELDS_ERROR = '[ProjectTemplateManagement] Get Project Template Fields Error';
export const SAVE_PROJECT_TEMPLATE_FIELDS = '[ProjectTemplateManagement] Save Project Template Fields';
export const SAVE_PROJECT_TEMPLATE_FIELDS_SUCCESS = '[ProjectTemplateManagement] Save Project Template Fields Success';
export const SAVE_PROJECT_TEMPLATE_FIELDS_ERROR = '[ProjectTemplateManagement] Save Project Template Fields Error';
export const CREATE_NEW_TEMPLATE = '[ProjectTemplateManagement] Create New Template';
export const TOGGLE_FIELD_SELECTED = '[ProjectTemplateManagement] Toggle Field Selected';
export const UPDATE_REFERENCE_POINTS = '[ProjectTemplateManagement] Update Reference Points';

export class ShowProjectTemplateForm implements Action {
  readonly type = SHOW_PROJECT_TEMPLATE_FORM;
  constructor(public payload: boolean) { }
}

export class CreateNewTemplate implements Action {
  readonly type = CREATE_NEW_TEMPLATE;
  constructor() { }
}

export class GetProjectTemplateFields implements Action {
  readonly type = GET_PROJECT_TEMPLATE_FIELDS;
  constructor(public payload?: number) { }
}

export class GetProjectTemplateFieldsSuccess implements Action {
  readonly type = GET_PROJECT_TEMPLATE_FIELDS_SUCCESS;
  constructor(public payload: ProjectTemplateFields) { }
}

export class GetProjectTemplateFieldsError implements Action {
  readonly type = GET_PROJECT_TEMPLATE_FIELDS_ERROR;
  constructor() { }
}

export class ToggleFieldSelected implements Action {
  readonly type = TOGGLE_FIELD_SELECTED;
  constructor(public payload: CompositeField) {}
}

export class SaveProjectTemplateFields implements Action {
  readonly type = SAVE_PROJECT_TEMPLATE_FIELDS;
  constructor(public payload: SaveProjectTemplateRequest) { }
}

export class SaveProjectTemplateFieldsSuccess implements Action {
  readonly type = SAVE_PROJECT_TEMPLATE_FIELDS_SUCCESS;
  constructor() { }
}

export class SaveProjectTemplateFieldsError implements Action {
  readonly type = SAVE_PROJECT_TEMPLATE_FIELDS_ERROR;
  constructor(public payload: string) { }
}

export class UpdateReferencePoints implements Action {
  readonly type = UPDATE_REFERENCE_POINTS;
  constructor(public payload: number[]) { }
}

export type Actions
  = ShowProjectTemplateForm
  | GetProjectTemplateFields
  | GetProjectTemplateFieldsSuccess
  | GetProjectTemplateFieldsError
  | ToggleFieldSelected
  | SaveProjectTemplateFields
  | SaveProjectTemplateFieldsSuccess
  | SaveProjectTemplateFieldsError
  | UpdateReferencePoints;
