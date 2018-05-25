import { Action } from '@ngrx/store';

export const LOAD_COMPANY_INDUSTRIES  = '[Peer Main/Dashboard/Request Company/Company Industries] Load Company Industries';
export const LOAD_COMPANY_INDUSTRIES_SUCCESS  = '[Peer Main/Dashboard/Request Company/Company Industries] Load Company Industries Success';
export const LOAD_COMPANY_INDUSTRIES_ERROR  = '[Peer Main/Dashboard/Request Company/Company Industries] Load Company Industries Error';

export class LoadCompanyIndustries implements Action {
  readonly type = LOAD_COMPANY_INDUSTRIES;
}

export class LoadCompanyIndustriesSuccess implements Action {
  readonly type = LOAD_COMPANY_INDUSTRIES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class LoadCompanyIndustriesError implements Action {
  readonly type = LOAD_COMPANY_INDUSTRIES_ERROR;
}

export type Actions
  = LoadCompanyIndustries
  | LoadCompanyIndustriesSuccess
  | LoadCompanyIndustriesError;
