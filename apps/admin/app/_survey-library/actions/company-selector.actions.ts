import { Action } from '@ngrx/store';

import { CompanySelectorItem } from 'libs/features/company/models';

export const GET_COMPANIES = '[Admin / Survey Library] Get Companies';
export const GET_COMPANIES_SUCCESS = '[Admin / Survey Library] Get Companies Success';
export const GET_COMPANIES_ERROR = '[Admin / Survey Library] Get Companies Error';

export class GetCompanies implements Action {
  readonly type = GET_COMPANIES;
}

export class GetCompaniesSuccess implements Action {
  readonly type = GET_COMPANIES_SUCCESS;

  constructor(public payload: CompanySelectorItem[]) { }
}

export class GetCompaniesError implements Action {
  readonly type = GET_COMPANIES_ERROR;
}

export type Actions
  = GetCompanies
  | GetCompaniesSuccess
  | GetCompaniesError;
