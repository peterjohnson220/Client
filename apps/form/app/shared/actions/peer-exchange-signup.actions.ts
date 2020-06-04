import { Action } from '@ngrx/store';

import { CompanyBaseInformation } from 'libs/models/company';

export const GET_EXCHANGE_SIGNUP_COMPANIES = '[Form - Shared] Get Exchange Signup Companies';
export const GET_EXCHANGE_SIGNUP_COMPANIES_SUCCESS = '[Form - Shared] Get Exchange Signup Companies Success';
export const GET_EXCHANGE_SIGNUP_COMPANIES_ERROR = '[Form - Shared] Get Exchange Signup Companies Error';

export class GetExchangeSignupCompanies implements Action {
  readonly type = GET_EXCHANGE_SIGNUP_COMPANIES;

  constructor(public payload: { exchangeName: string }) {}
}

export class GetExchangeSignupCompaniesSuccess implements Action {
  readonly type = GET_EXCHANGE_SIGNUP_COMPANIES_SUCCESS;

  constructor(public payload: { exchangeSignupCompanies: CompanyBaseInformation[] }) {}
}

export class GetExchangeSignupCompaniesError implements Action {
  readonly type = GET_EXCHANGE_SIGNUP_COMPANIES_ERROR;
}


export type PeerExchangeSignupActions
  = GetExchangeSignupCompanies
  | GetExchangeSignupCompaniesSuccess
  | GetExchangeSignupCompaniesError;
