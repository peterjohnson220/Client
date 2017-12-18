import { Action } from '@ngrx/store';

import { ExchangeCompany } from 'libs/models';

export const LOADING_EXCHANGE_COMPANIES  = '[Peer Admin/Exchange Companies] Loading Exchange Companies';
export const LOADING_EXCHANGE_COMPANIES_SUCCESS  = '[Peer Admin/Exchange Companies] Loading Exchange Companies Success';
export const LOADING_EXCHANGE_COMPANIES_ERROR  = '[Peer Admin/Exchange Companies] Loading Exchange Companies Error';

export class LoadingExchangeCompanies implements Action {
  readonly type = LOADING_EXCHANGE_COMPANIES;

  constructor(public payload: number) {}
}

export class LoadingExchangeCompaniesSuccess implements Action {
  readonly type = LOADING_EXCHANGE_COMPANIES_SUCCESS;

  constructor(public payload: ExchangeCompany[]) {}
}

export class LoadingExchangeCompaniesError implements Action {
  readonly type = LOADING_EXCHANGE_COMPANIES_ERROR;
}

export type Actions
  = LoadingExchangeCompanies
  | LoadingExchangeCompaniesSuccess
  | LoadingExchangeCompaniesError;




