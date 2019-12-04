import { Action } from '@ngrx/store';

import { ControlType } from 'libs/models';
import { CompanyControlEditableInfo } from '../../shared/models';

// Create Company Control
export const CREATE_CONTROL = '[Settings/Company Controls/Detail] Create Control Detail View';

// Edit Company Control
export const OPEN_COMPANY_CONTORLS_DETAIL_VIEW = '[Settings/Company Controls/Detail] Open Company Control Detail View';
export const OPEN_COMPANY_CONTORLS_DETAIL_VIEW_SUCCESS = '[Settings/Company Controls/Detail] Open Company Control Detail View Success';
export const IS_CONTROL_EDITABLE = '[Settings/Company Controls/Detail] Is Control Editable';
export const IS_CONTROL_EDITABLE_SUCCESS = '[Settings/Company Controls/Detail] Is Control Editable Success';
export const LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION = '[Settings/Company Controls/Detail] Load Company Control By Type And Version';
export const LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION_SUCCESS = '[Settings/Company Controls/Detail] Load Company Control By Type And Version Success';

// Save
export const SAVE_CONTROL = '[Settings/Company Controls/Detail] Save Control';
export const SAVE_CONTROL_SUCCESS = '[Settings/Company Controls/Detail] Save Control Success';
export const SAVE_CONTROL_ERROR = '[Settings/Company Controls/Detail] Save Control Error';
export const SAVE_NEW_CONTROL = '[Settings/Company Controls/Detail] Save New Control';
export const SAVE_EDITED_CONTROL = '[Settings/Company Controls/Detail] Save Edited Control';
export const UNHANDLED_ERROR = '[Settings/Company Controls/Detail] Save Control Type Unhandled Error';
export const CLOSE_COMPANY_CONTROLS_DETAIL_VIEW = '[Settings/Company Controls/Detail] Leave Control Detail View';

export class CreateControl implements Action {
    readonly type = CREATE_CONTROL;

    constructor(public payload: {controlName: string}) {}
}

export class LoadCompanyControlByTypeAndVersion implements Action {
    readonly type = LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION;

    constructor(public payload: {type: string, version: number}) {}
}

export class LoadCompanyControlByTypeAndVersionSuccess implements Action {
    readonly type = LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION_SUCCESS;

    constructor(public control: ControlType) {}
}

export class OpenCompanyControlsDetailView implements Action {
    readonly type = OPEN_COMPANY_CONTORLS_DETAIL_VIEW;

    constructor(public control: ControlType) {}
}
export class OpenCompanyControlsDetailViewSuccess implements Action {
    readonly type = OPEN_COMPANY_CONTORLS_DETAIL_VIEW_SUCCESS;
}

export class SaveControl implements Action {
    readonly type = SAVE_CONTROL;

    constructor(public control: ControlType) {}
}

export class SaveNewControlType implements Action {
    readonly type = SAVE_NEW_CONTROL;

    constructor(public control: ControlType) {}
}

export class SaveControlTypeSuccess implements Action {
    readonly type = SAVE_CONTROL_SUCCESS;
}

export class SaveControlTypeError implements Action {
    readonly type = SAVE_CONTROL_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class UnhandledError implements Action {
    readonly type = UNHANDLED_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class SaveEditedControlType implements Action {
    readonly type = SAVE_EDITED_CONTROL;

    constructor(public control: ControlType) {}
}

export class IsControlEditable implements Action {
    readonly type = IS_CONTROL_EDITABLE;

    constructor(public payload: {controlType: string}) {}
}

export class IsControlEditableSuccess implements Action {
    readonly type = IS_CONTROL_EDITABLE_SUCCESS;

    constructor(public controlEditableInfo: CompanyControlEditableInfo) {}
}
export class CloseCompanyControlsDetailView implements Action {
    readonly type = CLOSE_COMPANY_CONTROLS_DETAIL_VIEW;
}

export type DetailActions
  = LoadCompanyControlByTypeAndVersion
  | LoadCompanyControlByTypeAndVersionSuccess
  | OpenCompanyControlsDetailView
  | OpenCompanyControlsDetailViewSuccess
  | CreateControl
  | SaveControl
  | SaveNewControlType
  | SaveControlTypeSuccess
  | SaveControlTypeError
  | UnhandledError
  | SaveEditedControlType
  | IsControlEditable
  | IsControlEditableSuccess
  | CloseCompanyControlsDetailView;
