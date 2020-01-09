import { Action } from '@ngrx/store';

export const COPY_COMPANY_CONTROL = '[Settings/Company Controls/Detail] Copy Company Control';
export const COPY_COMPANY_CONTROL_SUCCESS = '[Settings/Company Controls/Detail] Copy Company Control Success';
export const COPY_COMPANY_CONTROL_ERROR = '[Settings/Company Controls/Detail] Copy Company Control Error';

export class CopyCompanyControl implements Action {
    readonly type = COPY_COMPANY_CONTROL;

    constructor(public payload: {controlName: string}) {}
}

export class CopyCompanyControlSuccess implements Action {
    readonly type = COPY_COMPANY_CONTROL_SUCCESS;
}

export class CopyCompanyControlError implements Action {
    readonly type = COPY_COMPANY_CONTROL_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export type CopyActions
  = CopyCompanyControl
  | CopyCompanyControlSuccess
  | CopyCompanyControlError;
