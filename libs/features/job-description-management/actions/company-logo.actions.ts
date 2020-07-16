import { Action } from '@ngrx/store';

import { CompanyDto } from 'libs/models';

import { CompanyLogo } from '../models';

export const LOAD_COMPANY_LOGO = '[job-description-management / Job Description] Load Company Logo';
export const LOAD_COMPANY_LOGO_SUCCESS = '[job-description-management / Job Description] Load Company Logo Success';
export const LOAD_COMPANY_LOGO_ERROR = '[job-description-management / Job Description] Load Company Logo Error';

export const LOAD_AVAILABLE_COMPANY_LOGOS = '[Template/Available Company Logos] Load Company Logos';
export const LOAD_AVAILABLE_COMPANY_LOGOS_SUCCESS = '[Template/Available Company Logos] Load Company Logos Success';
export const LOAD_AVAILABLE_COMPANY_LOGOS_ERROR = '[Template/Available Company Logos] Load Company Logos Error';

export class LoadAvailableCompanyLogos implements Action {
  readonly type = LOAD_AVAILABLE_COMPANY_LOGOS;
}
export class LoadAvailableCompanyLogosSuccess implements Action {
  readonly type = LOAD_AVAILABLE_COMPANY_LOGOS_SUCCESS;
  constructor(public payload: CompanyLogo[]) {}
}
export class LoadAvailableCompanyLogosError implements Action {
  readonly type = LOAD_AVAILABLE_COMPANY_LOGOS_ERROR;
  constructor(public payload: {error: string}) {}
}
export class LoadCompanyLogo implements Action {
  readonly type = LOAD_COMPANY_LOGO;
  constructor(public payload: number) {}
}
export class LoadCompanyLogoSuccess implements Action {
  readonly type = LOAD_COMPANY_LOGO_SUCCESS;
  constructor(public payload: CompanyDto) {}
}
export class LoadCompanyLogoError implements Action {
  readonly type = LOAD_COMPANY_LOGO_ERROR;
  constructor() {}
}

export type CompanyLogoActions = LoadCompanyLogo
  | LoadCompanyLogoSuccess
  | LoadCompanyLogoError
  | LoadAvailableCompanyLogos
  | LoadAvailableCompanyLogosSuccess
  | LoadAvailableCompanyLogosError;
