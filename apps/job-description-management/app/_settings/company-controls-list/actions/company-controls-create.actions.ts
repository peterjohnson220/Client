import { Action } from '@ngrx/store';

export const CREATE_CONTROL = '[Settings/Company Controls] Create Control';
export const CREATE_CONTROL_SUCCESS = '[Settings/Company Controls] Create Control Success';
export const CREATE_CONTROL_ERROR = '[Settings/Company Controls] Create Control Error';
export const OPEN_CREATE_CONTROL_MODAL = '[Settings/Company Controls] Open Create Control Modal';
export const CLOSE_CREATE_CONTROL_MODAL = '[Settings/Company Controls] Close Create Control Modal';

export class CreateControl implements Action {
    readonly type = CREATE_CONTROL;

    constructor(public payload: {controlName: string}) {}
}

export class CreateControlSuccess implements Action {
    readonly type = CREATE_CONTROL_SUCCESS;
}

export class CreateControlError implements Action {
    readonly type = CREATE_CONTROL_ERROR;

    constructor(public payload: string) {}
}

export class OpenCreateControlModal implements Action {
  readonly type = OPEN_CREATE_CONTROL_MODAL;
}

export class CloseCreateControlModal implements Action {
  readonly type = CLOSE_CREATE_CONTROL_MODAL;
}

export type CreateActions
  = CreateControl
  | CreateControlSuccess
  | CreateControlError
  | OpenCreateControlModal
  | CloseCreateControlModal;

