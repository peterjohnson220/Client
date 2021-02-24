import { Action } from '@ngrx/store';

import { CompanySelectorItem } from '../models';

export const GET_COMPANIES = '[Feature / Company] Get Companies';
export const GET_COMPANIES_SUCCESS = '[Feature / Company] Get Companies Success';
export const GET_COMPANIES_ERROR = '[Feature / Company] Get Companies Error';
export const SET_SELECTED_COMPANY = '[Feature / Company] Set Selected Company';
export const COMPANY_HAS_BENEFITS = '[Feature / Company] Company Has Benefits';
export const COMPANY_HAS_BENEFITS_SUCCESS = '[Feature / Company] Company Has Benefits Success';
export const IS_VALID_COMPANY_REPOSITORY = '[Feature / Company] Is Valid Company Repository';
export const IS_VALID_COMPANY_REPOSITORY_SUCCESS = '[Feature / Company] Is Valid Company Repository Success';


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

export class IsValidCompanyRepository implements Action {
  readonly type = IS_VALID_COMPANY_REPOSITORY;

  constructor(public  payload: number) {
  }
}

export class IsValidCompanyRepositorySuccess implements Action {
  readonly type = IS_VALID_COMPANY_REPOSITORY_SUCCESS;

  constructor(public isValidCompanyRepository: boolean) { }
}

export type Actions
  = GetCompanies
  | GetCompaniesSuccess
  | GetCompaniesError
  | SetSelectedCompany
  | CompanyHasBenefits
  | CompanyHasBenefitsSuccess
  | IsValidCompanyRepository
  | IsValidCompanyRepositorySuccess;
