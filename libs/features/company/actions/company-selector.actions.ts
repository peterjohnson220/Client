import { Action } from '@ngrx/store';

import { CompanySelectorItem } from '../models';

export const GET_COMPANIES = '[Feature / Company] Get Companies';
export const GET_COMPANIES_SUCCESS = '[Feature / Company] Get Companies Success';
export const GET_COMPANIES_ERROR = '[Feature / Company] Get Companies Error';
export const SET_SELECTED_COMPANY = '[Feature / Company] Set Selected Company';

export class GetCompanies implements Action {
  readonly type = GET_COMPANIES;
}

export class GetCompaniesSuccess implements Action {
  readonly type = GET_COMPANIES_SUCCESS;

  constructor(public payload: CompanySelectorItem[]) { }
}

export class SetSelectedCompany implements Action {
  readonly type = SET_SELECTED_COMPANY;

  constructor(public payload: CompanySelectorItem) { }
}

export class GetCompaniesError implements Action {
  readonly type = GET_COMPANIES_ERROR;
}

export type Actions
  = GetCompanies
  | GetCompaniesSuccess
  | GetCompaniesError
  | SetSelectedCompany;
