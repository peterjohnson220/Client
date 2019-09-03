import { Action } from '@ngrx/store';

import { CompanyDto } from 'libs/models/company';

export const LOAD_COMPANY = '[Jobs Page] Load Company';
export const LOAD_COMPANY_ERROR = '[Jobs Page] Load Company Error';
export const LOAD_COMPANY_SUCCESS = '[Jobs Page] Load Company Success';

export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;
  constructor(public payload: number) {}
}

export class LoadCompanyError implements Action {
  readonly type = LOAD_COMPANY_ERROR;
  constructor() {}
}

export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;
  constructor(public payload: CompanyDto) {}
}

export type JobsPageActions
  = LoadCompany
  | LoadCompanyError
  | LoadCompanySuccess;




