import { Action } from '@ngrx/store';

import { ExistingCompany } from 'libs/models/peer';

export const LOAD_EXISTING_COMPANIES  = '[Peer Main/Exchange Request/Existing Companies] Load Existing Companies';
export const LOAD_EXISTING_COMPANIES_SUCCESS  = '[Peer Main/Exchange Request/Existing Companies] Load Existing Companies Success';
export const LOAD_EXISTING_COMPANIES_ERROR  = '[Peer Main/Exchange Request/Existing Companies] Load Existing Companies Error';

export class LoadExistingCompanies implements Action {
  readonly type = LOAD_EXISTING_COMPANIES;
  readonly payload = null;
}

export class LoadExistingCompaniesSuccess implements Action {
  readonly type = LOAD_EXISTING_COMPANIES_SUCCESS;

  constructor(public payload: ExistingCompany[]) {}
}

export class LoadExistingCompaniesError implements Action {
  readonly type = LOAD_EXISTING_COMPANIES_ERROR;
  readonly payload = null;
}

export type Actions
  = LoadExistingCompanies
  | LoadExistingCompaniesSuccess
  | LoadExistingCompaniesError;
