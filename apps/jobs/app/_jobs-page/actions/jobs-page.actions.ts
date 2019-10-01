import { Action } from '@ngrx/store';

export const LOAD_COMPANY = '[Jobs Page] Load Company';
export const LOAD_COMPANY_ERROR = '[Jobs Page] Load Company Error';
export const LOAD_COMPANY_SUCCESS = '[Jobs Page] Load Company Success';
export const HANDLE_API_ERROR = '[Jobs Page] Handle API Error';

export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;
  constructor() {}
}

export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;
  constructor(public payload: string) {}
}

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public payload: string) { }
}

export type JobsPageActions
  = LoadCompany
  | LoadCompanySuccess
  | HandleApiError;
