import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { AddExchangeCompaniesRequest } from 'libs/models/peer';

export const LOADING_EXCHANGE_COMPANIES  = '[Peer Admin/Exchange Companies] Loading Exchange Companies';
export const LOADING_EXCHANGE_COMPANIES_SUCCESS  = '[Peer Admin/Exchange Companies] Loading Exchange Companies Success';
export const LOADING_EXCHANGE_COMPANIES_ERROR  = '[Peer Admin/Exchange Companies] Loading Exchange Companies Error';
export const OPEN_ADD_EXCHANGE_COMPANIES_MODAL = '[Peer Admin/Exchange Companies] Open Add Exchange Companies Modal';
export const CLOSE_ADD_EXCHANGE_COMPANIES_MODAL = '[Peer Admin/Exchange Companies] Close Add Exchange Companies Modal';
export const ADDING_EXCHANGE_COMPANIES = '[Peer Admin/Exchange Companies] Adding Exchange Companies';
export const ADDING_EXCHANGE_COMPANIES_SUCCESS = '[Peer Admin/Exchange Companies] Adding Exchange Companies Success';
export const ADDING_EXCHANGE_COMPANIES_ERROR = '[Peer Admin/Exchange Companies] Adding Exchange Companies Error';
export const OPEN_DELETE_EXCHANGE_COMPANY_MODAL = '[Peer Admin/Exchange Companies] Open Delete Exchange Company Modal';
export const CLOSE_DELETE_EXCHANGE_COMPANY_MODAL = '[Peer Admin/Exchange Companies] Close Delete Exchange Company Modal';
export const DELETING_EXCHANGE_COMPANY = '[Peer Admin/Exchange Companies] Deleting Exchange Company';
export const DELETING_EXCHANGE_COMPANY_SUCCESS = '[Peer Admin/Exchange Companies] Deleting Exchange Company Success';
export const DELETING_EXCHANGE_COMPANY_ERROR = '[Peer Admin/Exchange Companies] Deleting Exchange Company Error';

export class LoadingExchangeCompanies implements Action {
  readonly type = LOADING_EXCHANGE_COMPANIES;

  constructor(public payload: any) {}
}

export class LoadingExchangeCompaniesSuccess implements Action {
  readonly type = LOADING_EXCHANGE_COMPANIES_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadingExchangeCompaniesError implements Action {
  readonly type = LOADING_EXCHANGE_COMPANIES_ERROR;
}

// Add exchange companies
export class OpenAddExchangeCompaniesModal implements Action {
  readonly type = OPEN_ADD_EXCHANGE_COMPANIES_MODAL;
}

export class CloseAddExchangeCompaniesModal implements Action {
  readonly type = CLOSE_ADD_EXCHANGE_COMPANIES_MODAL;
}

export class AddingExchangeCompanies implements Action {
  readonly type = ADDING_EXCHANGE_COMPANIES;

  constructor(public payload: AddExchangeCompaniesRequest) {}
}

export class AddingExchangeCompaniesSuccess implements Action {
  readonly type = ADDING_EXCHANGE_COMPANIES_SUCCESS;
}

export class AddingExchangeCompaniesError implements Action {
  readonly type = ADDING_EXCHANGE_COMPANIES_ERROR;
}

// Delete Exchange Company
export class OpenDeleteExchangeCompanyModal implements Action {
  readonly type = OPEN_DELETE_EXCHANGE_COMPANY_MODAL;
}

export class CloseDeleteExchangeCompanyModal implements Action {
  readonly type = CLOSE_DELETE_EXCHANGE_COMPANY_MODAL;
}

export class DeletingExchangeCompany implements Action {
  readonly type = DELETING_EXCHANGE_COMPANY;

  constructor(public payload: any) {}
}

export class DeletingExchangeCompanySuccess implements Action {
  readonly type = DELETING_EXCHANGE_COMPANY_SUCCESS;
}

export class DeletingExchangeCompanyError implements Action {
  readonly type = DELETING_EXCHANGE_COMPANY_ERROR;
}

export type Actions
  = LoadingExchangeCompanies
  | LoadingExchangeCompaniesSuccess
  | LoadingExchangeCompaniesError
  | OpenAddExchangeCompaniesModal
  | CloseAddExchangeCompaniesModal
  | AddingExchangeCompanies
  | AddingExchangeCompaniesSuccess
  | AddingExchangeCompaniesError
  | OpenDeleteExchangeCompanyModal
  | CloseDeleteExchangeCompanyModal
  | DeletingExchangeCompany
  | DeletingExchangeCompanySuccess
  | DeletingExchangeCompanyError;
