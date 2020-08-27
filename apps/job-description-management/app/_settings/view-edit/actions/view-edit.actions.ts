import { Action } from '@ngrx/store';

import { JobDescriptionView } from '../../shared/models';
import { ElementViewToggleObj } from '../models';

export const EDIT_VIEW = '[Job Description Management / View Edit] Edit View';
export const LOAD_TEMPLATE_VIEWS = '[Job Description Management / View Edit] Load Template Views';
export const LOAD_TEMPLATE_VIEWS_SUCCESS = '[Job Description Management / View Edit] Load Template Views Success';
export const LOAD_TEMPLATE_VIEWS_ERROR = '[Job Description Management / View Edit] Load Template Views Error';
export const ADD_HIDDEN_ELEMENT_ID = '[Job Description Management / View Edit] Add Hidden Element Id';
export const REMOVE_HIDDEN_ELEMENT_ID = '[Job Description Management / View Edit] Remove Hidden Element Id';
export const ADD_HIDDEN_CONTROL_NAME_ELEMENT_ID = '[Job Description Management / View Edit] Add Hidden Control Name Element Id';
export const REMOVE_HIDDEN_CONTROL_NAME_ELEMENT_ID = '[Job Description Management / View Edit] Remove Hidden Control Name Element Id';
export const ADD_HIDDEN_SECTION_SUBHEADING_ELEMENT_ID = '[Job Description Management / View Edit] Add Hidden Section Subheading Element Id';
export const REMOVE_HIDDEN_SECTION_SUBHEADING_ELEMENT_ID = '[Job Description Management / View Edit] Remove Hidden Section Subheading Element Id';
export const GET_AVAILABLE_CONTROLS = '[Job Description Management / View Edit] Get Available Controls';
export const GET_AVAILABLE_CONTROLS_SUCCESS = '[Job Description Management / View Edit] Get Available Controls Success';
export const GET_AVAILABLE_CONTROLS_ERROR = '[Job Description Management / View Edit] Get Available Controls Error';
export const POPULATE_CONTROL_COLORS = '[Job Description Management / View Edit] Populate Control Colors';
export const SAVE_TEMPLATE_VIEWS = '[Job Description Management / View Edit] Save Template Views';
export const SAVE_TEMPLATE_VIEWS_SUCCESS = '[Job Description Management / View Edit] Save Template Views Success';
export const SAVE_TEMPLATE_VIEWS_ERROR = '[Job Description Management / View Edit] Save Template Views Error';
export const RESET = '[Job Description Management / View Edit] Reset';

export class EditView implements Action {
  readonly type = EDIT_VIEW;

  constructor(public payload: { viewName: string }) { }
}

export class LoadTemplateViews implements Action {
  readonly type = LOAD_TEMPLATE_VIEWS;

  constructor(public payload: { viewName: string }) { }
}

export class LoadTemplateViewsSuccess implements Action {
  readonly type = LOAD_TEMPLATE_VIEWS_SUCCESS;

  constructor(public payload: JobDescriptionView[]) { }
}

export class LoadTemplateViewsError implements Action {
  readonly type = LOAD_TEMPLATE_VIEWS_ERROR;
}

export class AddHiddenElementId implements Action {
  readonly type = ADD_HIDDEN_ELEMENT_ID;

  constructor(public payload: ElementViewToggleObj) { }
}

export class RemoveHiddenElementId implements Action {
  readonly type = REMOVE_HIDDEN_ELEMENT_ID;

  constructor(public payload: ElementViewToggleObj) { }
}

export class AddHiddenControlNameElementId implements Action {
  readonly type = ADD_HIDDEN_CONTROL_NAME_ELEMENT_ID;

  constructor(public payload: ElementViewToggleObj) { }
}

export class RemoveHiddenControlNameElementId implements Action {
  readonly type = REMOVE_HIDDEN_CONTROL_NAME_ELEMENT_ID;

  constructor(public payload: ElementViewToggleObj) { }
}

export class AddHiddenSectionSubheadingElementId implements Action {
  readonly type = ADD_HIDDEN_SECTION_SUBHEADING_ELEMENT_ID;

  constructor(public payload: ElementViewToggleObj) { }
}

export class RemoveHiddenSectionSubheadingElementId implements Action {
  readonly type = REMOVE_HIDDEN_SECTION_SUBHEADING_ELEMENT_ID;

  constructor(public payload: ElementViewToggleObj) { }
}

export class GetAvailableControls implements Action {
  readonly type = GET_AVAILABLE_CONTROLS;

  constructor() { }
}

export class GetAvailableControlsSuccess implements Action {
  readonly type = GET_AVAILABLE_CONTROLS_SUCCESS;

  constructor(public payload: any[]) { }
}

export class GetAvailableControlsError implements Action {
  readonly type = GET_AVAILABLE_CONTROLS_ERROR;
}

export class PopulateControlColors implements Action {
  readonly type = POPULATE_CONTROL_COLORS;
}

export class SaveTemplateViews implements Action {
  readonly type = SAVE_TEMPLATE_VIEWS;
}

export class SaveTemplateViewsSuccess implements Action {
  readonly type = SAVE_TEMPLATE_VIEWS_SUCCESS;
}

export class SaveTemplateViewsError implements Action {
  readonly type = SAVE_TEMPLATE_VIEWS_ERROR;
}

export class Reset implements Action {
  readonly type = RESET;
}

export type Actions
  = EditView
  | LoadTemplateViews
  | LoadTemplateViewsSuccess
  | LoadTemplateViewsError
  | AddHiddenElementId
  | RemoveHiddenElementId
  | AddHiddenControlNameElementId
  | RemoveHiddenControlNameElementId
  | AddHiddenSectionSubheadingElementId
  | RemoveHiddenSectionSubheadingElementId
  | GetAvailableControls
  | GetAvailableControlsSuccess
  | GetAvailableControlsError
  | PopulateControlColors
  | SaveTemplateViews
  | SaveTemplateViewsSuccess
  | SaveTemplateViewsError
  | Reset;
