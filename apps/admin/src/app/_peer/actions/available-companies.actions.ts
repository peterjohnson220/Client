import { Action } from '@ngrx/store';

import { AvailableCompany } from 'libs/models/peer';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOADING_AVAILABLE_COMPANIES  = '[Peer Admin/Available Companies] Loading Available Companies';
export const LOADING_AVAILABLE_COMPANIES_SUCCESS  = '[Peer Admin/Available Companies] Loading Available Companies Success';
export const LOADING_AVAILABLE_COMPANIES_ERROR  = '[Peer Admin/AVAILABLE Companies] Loading Available Companies Error';

export class LoadingAvailableCompanies implements Action {
  readonly type = LOADING_AVAILABLE_COMPANIES;

  // TODO: model?
  constructor(public payload: any) {}
}

export class LoadingAvailableCompaniesSuccess implements Action {
  readonly type = LOADING_AVAILABLE_COMPANIES_SUCCESS;

  // TODO: Need strong type?
  constructor(public payload: GridDataResult) {}
}

export class LoadingAvailableCompaniesError implements Action {
  readonly type = LOADING_AVAILABLE_COMPANIES_ERROR;
}

export type Actions
  = LoadingAvailableCompanies
  | LoadingAvailableCompaniesSuccess
  | LoadingAvailableCompaniesError;




