import { Action } from '@ngrx/store';

import { CompanyDto } from 'libs/models/company';

export const LOAD_COMPANY_INFORMATION = '[job-description-management / Public View Header] Load Company Information';
export const LOAD_COMPANY_INFORMATION_ERROR = '[job-description-management / Public View Header] Load Company Information Error';
export const LOAD_COMPANY_INFORMATION_SUCCESS = '[job-description-management / Public View Header] Load Company Information Success';

export class LoadCompanyInformation implements Action {
  readonly type = LOAD_COMPANY_INFORMATION;

  constructor(public payload: { CompanyId: number }) {}
}

export class LoadCompanyInformationError implements Action {
  readonly type = LOAD_COMPANY_INFORMATION_ERROR;
}

export class LoadCompanyInformationSuccess implements Action {
  readonly type = LOAD_COMPANY_INFORMATION_SUCCESS;

  constructor(public payload: CompanyDto) {}
}

export type Actions
  = LoadCompanyInformation
  | LoadCompanyInformationError
  | LoadCompanyInformationSuccess;
