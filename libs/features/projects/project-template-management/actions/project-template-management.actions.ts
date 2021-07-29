import { Action } from '@ngrx/store';

import { BaseProjectFields, CompositeField, ProjectTemplateFields } from 'libs/models';
import { SaveCompositeFieldsRequest, SaveProjectTemplateRequest } from 'libs/models/payfactors-api/project/request';

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
export const EDIT_TEMPLATE = '[ProjectTemplateManagement] Edit Template';
export const TOGGLE_SELECT_ALL = '[ProjectTemplateManagement] Toggle Select All';
export const SET_BASE_PROJECT_FIELDS = '[ProjectTemplateManagement] Set Base Project Fields';
export const SAVE_BASE_PROJECT_FIELD_SELECTIONS = '[ProjectTemplateManagement] Save Base Project Field Selections';
export const SAVE_BASE_PROJECT_FIELD_SELECTIONS_SUCCESS = '[ProjectTemplateManagement] Save Base Project Field Selections Success';

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

export class EditTemplate implements Action {
  readonly type = EDIT_TEMPLATE;
  constructor(public payload: number) { }
}

export class ToggleSelectAll implements Action {
  readonly type = TOGGLE_SELECT_ALL;
  constructor(public payload: {
    Category: string;
    SelectAllValue: boolean
  }) {}
}

export class SetBaseProjectFields implements Action {
  readonly type = SET_BASE_PROJECT_FIELDS;
  constructor(public payload: BaseProjectFields) {}
}

export class SaveBaseProjectFieldSelections implements Action {
  readonly type = SAVE_BASE_PROJECT_FIELD_SELECTIONS;
  constructor(public payload: SaveCompositeFieldsRequest) {}
}

export class SaveBaseProjectFieldSelectionsSuccess implements Action {
  readonly type = SAVE_BASE_PROJECT_FIELD_SELECTIONS_SUCCESS;
  constructor() {}
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
  | UpdateReferencePoints
  | EditTemplate
  | ToggleSelectAll
  | SetBaseProjectFields
  | SaveBaseProjectFieldSelections
  | SaveBaseProjectFieldSelectionsSuccess;
