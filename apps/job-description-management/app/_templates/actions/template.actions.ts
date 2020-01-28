import { Action } from '@ngrx/store';

import { SaveError } from '../../shared/models/save-error.model';
import { Template } from '../models';

  export const SAVE_TEMPLATE = '[JobDescription/Template] Save Template';
  export const SAVE_TEMPLATE_SUCCESS = '[JobDescription/Template] Save Template Success';
  export const SAVE_TEMPLATE_ERROR = '[JobDescription/Template] Save Template Error';

  export const CLEAR_SAVE_TEMPLATE_ERROR = '[JobDescription/Template] Clear Save Template Error';

  export const COPY_TEMPLATE = '[JobDescription/Template] Copy Template';
  export const COPY_TEMPLATE_SUCCESS = '[JobDescription/Template] Copy Template Success';

  export const DELETE_TEMPLATE = '[JobDescription/Template] Delete Template';
  export const DELETE_TEMPLATE_SUCCESS = '[JobDescription/Template] Delete Template Success';
  export const DELETE_TEMPLATE_ERROR = '[JobDescription/Template] Delete Template Error';

  export const LOAD_TEMPLATE = '[JobDescription/Template] Load Template';
  export const LOAD_TEMPLATE_SUCCESS = '[JobDescription/Template] Load Template Success';
  export const LOAD_TEMPLATE_ERROR = '[JobDescription/Template] Load Template Error';

  export const LOAD_TEMPLATE_ASSIGNMENT_SUMMARY = '[JobDescription/Template] Load Template Assignment Summary';
  export const LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_SUCCESS = '[JobDescription/Template] Load Template Assignment Summary Success';
  export const LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_ERROR = '[JobDescription/Template] Load Template Assignment Summary Error';

  export const CLEAN_TEMPLATE_STATE = '[JobDescription/Template] Clean Template State';
 
  export class SaveTemplate implements Action {
    readonly type = SAVE_TEMPLATE;

    constructor(public payload: {template: Template}) {}
  }

  export class SaveTemplateSuccess implements Action {
    readonly type = SAVE_TEMPLATE_SUCCESS;

    constructor(public payload: {DraftNumber: number, TemplateStatus: string, TemplateRevision: number}) {}
  }

  export class SaveTemplateError implements Action {
    readonly type = SAVE_TEMPLATE_ERROR;

    constructor(public payload: {error: SaveError}) {}
  }

  export class ClearSaveTemplateError implements Action {
    readonly type = CLEAR_SAVE_TEMPLATE_ERROR;
  }

  export class CopyTemplate implements Action {
    readonly type = COPY_TEMPLATE;

    constructor(public payload: {templateId: number, templateName: string}) {}
  }

  export class CopyTemplateSuccess implements Action {
    readonly type = COPY_TEMPLATE_SUCCESS;

    constructor(public payload: {template: string}) {}
  }

  export class DeleteTemplate implements Action {
    readonly type = DELETE_TEMPLATE;

    constructor(public payload: {id: number}) {}
  }

  export class DeleteTemplateSuccess implements Action {
    readonly type = DELETE_TEMPLATE_SUCCESS;
  }

  export class DeleteTemplateError implements Action {
    readonly type = DELETE_TEMPLATE_ERROR;
  }

  export class LoadTemplate implements Action {
    readonly type = LOAD_TEMPLATE;

    constructor(public payload: {templateId: number}) {}
  }

  export class LoadTemplateSuccess implements Action {
    readonly type = LOAD_TEMPLATE_SUCCESS;

    constructor(public payload: any) {}
  }

  export class LoadTemplateError implements Action {
    readonly type = LOAD_TEMPLATE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
  }

  export class LoadTemplateAssignmentSummary implements Action {
    readonly type = LOAD_TEMPLATE_ASSIGNMENT_SUMMARY;

    constructor(public payload: {templateId: number}) {}
  }

  export class LoadTemplateAssignmentSummarySuccess implements Action {
    readonly type = LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_SUCCESS;

    constructor(public payload: any) {}
  }

  export class LoadTemplateAssignmentSummaryError implements Action {
    readonly type = LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_ERROR;

    constructor(public payload: {errorMessage: string}) {}
  }

  export class CleanTemplateState implements Action {
    readonly type = CLEAN_TEMPLATE_STATE;
  }

  export type TemplateActions
  = SaveTemplate
  | SaveTemplateSuccess
  | SaveTemplateError
  | ClearSaveTemplateError
  | CopyTemplate
  | CopyTemplateSuccess
  | DeleteTemplate
  | DeleteTemplateSuccess
  | DeleteTemplateError
  | LoadTemplate
  | LoadTemplateSuccess
  | LoadTemplateError
  | LoadTemplateAssignmentSummary
  | LoadTemplateAssignmentSummarySuccess
  | LoadTemplateAssignmentSummaryError
  | CleanTemplateState;
