import { Action } from '@ngrx/store';

import { ControlType } from 'libs/models';

export const LOAD_COMPANY_CONTROLS = '[Settings/Company Controls] Load Company Controls';
export const LOAD_COMPANY_CONTROLS_SUCCESS = '[Settings/Company Controls] Load Company Controls Success';
export const LOAD_COMPANY_CONTROLS_ERROR = '[Settings/Company Controls] Load Company Controls Error';

export class LoadCompanyControls implements Action {
    readonly type = LOAD_COMPANY_CONTROLS;
}

export class LoadCompanyControlsSuccess implements Action {
    readonly type = LOAD_COMPANY_CONTROLS_SUCCESS;

    constructor(public payload: ControlType[]) {}
}

export class LoadCompanyControlsError implements Action {
    readonly type = LOAD_COMPANY_CONTROLS_ERROR;
}

export type Actions
  = LoadCompanyControls
  | LoadCompanyControlsSuccess
  | LoadCompanyControlsError;

