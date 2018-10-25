import { Action } from '@ngrx/store';

export const LOADING_COMPANIES = '[Org Data Autoloader/Company Selector] Loading Companies';
export const LOADING_COMPANIES_SUCCESS = '[Org Data Autoloader/Company Selector] Loading Companies Success';
export const LOADING_COMPANIES_ERROR = '[Org Data Autoloader/Company Selector] Loading Companies Error';

export class LoadingCompanies implements Action {
  readonly type = LOADING_COMPANIES;

  constructor(public payload: any = null) {}
}

export class LoadingCompaniesError implements Action {
  readonly type = LOADING_COMPANIES_ERROR;

  constructor(public payload: any = null) {}
}

export class LoadingCompaniesSuccess implements Action {
  readonly type = LOADING_COMPANIES_SUCCESS;

  constructor(public payload: any) {}
}

export type Actions
  = LoadingCompanies
  | LoadingCompaniesError
  | LoadingCompaniesSuccess;
