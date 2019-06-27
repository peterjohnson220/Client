import { Action } from '@ngrx/store';

import { DataListItem } from '../models';

export const LOAD_COMPANIES_LIST = '[Pf-Admin/Select Company] Load Companies List';
export const LOAD_COMPANIES_LIST_IF_EMPTY = '[Pf-Admin/Select Company] Load Companies List If Empty';
export const LOAD_COMPANIES_LIST_SUCCESS = '[Pf-Admin/Select Company] Load Companies List Success';
export const LOAD_COMPANIES_LIST_ERROR = '[Pf-Admin/Select Company] Load Companies List Error';
export const SET_COMPANY_FILTER = '[Pf-Admin/Select Company] Set Company Filter';

export class LoadCompaniesList implements Action {
  readonly type = LOAD_COMPANIES_LIST;
}

export class LoadCompaniesListIfEmpty implements Action {
  readonly type = LOAD_COMPANIES_LIST_IF_EMPTY;
}

export class LoadCompaniesListSuccess implements Action {
  readonly type = LOAD_COMPANIES_LIST_SUCCESS;

  constructor(public payload: DataListItem[]) {}
}

export class LoadCompaniesListError implements Action {
  readonly type = LOAD_COMPANIES_LIST_ERROR;
}

export class SetCompanyFilter implements Action {
  readonly type = SET_COMPANY_FILTER;

  constructor(public payload: string) { }
}

export type Actions
  = LoadCompaniesList
  | LoadCompaniesListIfEmpty
  | LoadCompaniesListSuccess
  | LoadCompaniesListError
  | SetCompanyFilter;
