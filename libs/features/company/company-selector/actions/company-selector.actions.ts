import { Action } from '@ngrx/store';

import { CompanySelectorItem } from '../models';

export const GET_COMPANIES = '[Feature / Company] Get Companies';
export const GET_COMPANIES_SUCCESS = '[Feature / Company] Get Companies Success';
export const GET_COMPANIES_ERROR = '[Feature / Company] Get Companies Error';
export const SET_SELECTED_COMPANY = '[Feature / Company] Set Selected Company';
export const COMPANY_HAS_BENEFITS = '[Feature / Company] Company Has Benefits';
export const COMPANY_HAS_BENEFITS_SUCCESS = '[Feature / Company] Company Has Benefits Success';

export class CompanyHasBenefits implements Action {
  readonly type = COMPANY_HAS_BENEFITS;
}

export class CompanyHasBenefitsSuccess implements Action {
  readonly type = COMPANY_HAS_BENEFITS_SUCCESS;

  constructor(public companyHasBenefits: boolean) { }
}

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
  | SetSelectedCompany
  | CompanyHasBenefits
  | CompanyHasBenefitsSuccess;
