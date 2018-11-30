import { Action } from '@ngrx/store';

import { CompanyDto } from '../../../models';

export const GET_COMPANY_CONTEXT = '[AppContext/Company Context] Get Company Context';
export const GET_COMPANY_CONTEXT_SUCCESS = '[AppContext/Company Context] Get Company Context Success';
export const GET_COMPANY_CONTEXT_ERROR = '[AppContext/Company Context] Get Company Context Error';

export class GetCompanyContext implements Action {
  readonly type = GET_COMPANY_CONTEXT;
  constructor() { }
}

export class GetCompanyContextSuccess implements Action {
  readonly type = GET_COMPANY_CONTEXT_SUCCESS;
  constructor(public payload: CompanyDto) { }
}

export class GetCompanyContextError implements Action {
  readonly type = GET_COMPANY_CONTEXT_ERROR;
  constructor(public error: any) { }
}

export type Actions =
  | GetCompanyContext
  | GetCompanyContextSuccess
  | GetCompanyContextError;
