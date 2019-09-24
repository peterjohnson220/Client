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

  export type Actions
  = SaveTemplate
  | SaveTemplateSuccess
  | SaveTemplateError
  | ClearSaveTemplateError
  | CopyTemplate
  | CopyTemplateSuccess
  | DeleteTemplate
  | DeleteTemplateSuccess
  | DeleteTemplateError;

