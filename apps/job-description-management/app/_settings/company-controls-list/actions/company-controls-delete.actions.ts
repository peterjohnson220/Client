import { Action } from '@ngrx/store';

import { TemplateNameAndStatusModel } from '../models';

export const DELETE_CONTROL = '[Settings/Company Controls] Delete Control';
export const DELETE_CONTROL_SUCCESS = '[Settings/Company Controls] Delete Control Success';
export const DELETE_CONTROL_ERROR = '[Settings/Company Controls] Delete Control Error';
export const CLOSE_DELETE_CONTROL_MODAL = '[Settings/Company Controls] Close Delete Control Modal';
export const LOAD_TEMPLATES_WITH_CONTROL_TYPE = '[Settings/Company Controls] Load Templates With Control Type';
export const LOAD_TEMPLATES_WITH_CONTROL_TYPE_SUCCESS = '[Settings/Company Controls] Load Templates With Control Type Success';
export const LOAD_TEMPLATES_WITH_CONTROL_TYPE_ERROR = '[Settings/Company Controls] Load Templates With Control Type Error';

export class DeleteControl implements Action {
    readonly type = DELETE_CONTROL;

    constructor(public payload: {controlType: string}) {}
}

export class DeleteControlSuccess implements Action {
    readonly type = DELETE_CONTROL_SUCCESS;
}

export class DeleteControlError implements Action {
    readonly type = DELETE_CONTROL_ERROR;

    constructor(public payload: string) {}
}

export class CloseDeleteControlModal implements Action {
  readonly type = CLOSE_DELETE_CONTROL_MODAL;
}

export class LoadTemplatesWithControlType implements Action {
  readonly type = LOAD_TEMPLATES_WITH_CONTROL_TYPE;

  constructor(public payload: {controlType: string}) {}
}

export class LoadTemplatesWithControlTypeSuccess implements Action {
  readonly type = LOAD_TEMPLATES_WITH_CONTROL_TYPE_SUCCESS;

  constructor(public payload: TemplateNameAndStatusModel[]) {}
}

export class LoadTemplatesWithControlTypeError implements Action {
  readonly type = LOAD_TEMPLATES_WITH_CONTROL_TYPE_ERROR;
}
export type DeleteActions
  = DeleteControl
  | DeleteControlSuccess
  | DeleteControlError
  | CloseDeleteControlModal
  | LoadTemplatesWithControlType
  | LoadTemplatesWithControlTypeSuccess
  | LoadTemplatesWithControlTypeError;

