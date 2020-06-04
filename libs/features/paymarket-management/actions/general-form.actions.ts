import { Action } from '@ngrx/store';

import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { DefaultUserPayMarket } from 'libs/models';

export const GET_COUNTRIES = '[Pay Market Management / General Form] Get Countries';
export const GET_COUNTRIES_SUCCESS = '[Pay Market Management / General Form] Get Countries Success';
export const GET_COUNTRIES_ERROR = '[Pay Market Management / General Form] Get Countries Error';
export const GET_CURRENCIES = '[Pay Market Management / General Form] Get Currencies';
export const GET_CURRENCIES_SUCCESS = '[Pay Market Management / General Form] Get Currencies Success';
export const GET_CURRENCIES_ERROR = '[Pay Market Management / General Form] Get Currencies Error';
export const GET_LINKED_PAY_MARKETS = '[Pay Market Management / General Form] Get Linked Pay Markets';
export const GET_LINKED_PAY_MARKETS_SUCCESS = '[Pay Market Management / General Form] Get Linked Pay Markets Success';
export const GET_LINKED_PAY_MARKETS_ERROR = '[Pay Market Management / General Form] Get Linked Pay Markets Error';
export const GET_DEFAULT_USER_PAY_MARKET = '[Pay Market Management / General Form] Get Default User Pay Market';
export const GET_DEFAULT_USER_PAY_MARKET_SUCCESS = '[Pay Market Management / General Form] Get Default User Pay Market Success';
export const GET_DEFAULT_USER_PAY_MARKET_ERROR = '[Pay Market Management / General Form] Get Default User Pay Market Error';

export class GetCountries implements Action {
  readonly type = GET_COUNTRIES;
  constructor() {}
}

export class GetCountriesSuccess implements Action {
  readonly type = GET_COUNTRIES_SUCCESS;

  constructor(public payload: KendoTypedDropDownItem[]) {}
}

export class GetCountriesError implements Action {
  readonly type = GET_COUNTRIES_ERROR;
  constructor() {}
}

export class GetCurrencies implements Action {
  readonly type = GET_CURRENCIES;
  constructor() { }
}

export class GetCurrenciesSuccess implements Action {
  readonly type = GET_CURRENCIES_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) { }
}

export class GetCurrenciesError implements Action {
  readonly type = GET_CURRENCIES_ERROR;
  constructor() { }
}

export class GetLinkedPayMarkets implements Action {
  readonly type = GET_LINKED_PAY_MARKETS;
  constructor(public payload: { payMarketId: number }) {}
}

export class GetLinkedPayMarketsSuccess implements Action {
  readonly type = GET_LINKED_PAY_MARKETS_SUCCESS;
  constructor(public payload: KendoTypedDropDownItem[]) {}
}

export class GetLinkedPayMarketsError implements Action {
  readonly type = GET_LINKED_PAY_MARKETS_ERROR;
  constructor() {}
}

export class GetDefaultUserPayMarket implements Action {
  readonly type = GET_DEFAULT_USER_PAY_MARKET;
  constructor() {}
}

export class GetDefaultUserPayMarketSuccess implements Action {
  readonly type = GET_DEFAULT_USER_PAY_MARKET_SUCCESS;
  constructor(public payload: DefaultUserPayMarket) {}
}

export class GetDefaultUserPayMarketError implements Action {
  readonly type = GET_DEFAULT_USER_PAY_MARKET_ERROR;
  constructor() {}
}

export type Actions
  = GetCountries
  | GetCountriesSuccess
  | GetCountriesError
  | GetCurrencies
  | GetCurrenciesSuccess
  | GetCurrenciesError
  | GetLinkedPayMarkets
  | GetLinkedPayMarketsSuccess
  | GetLinkedPayMarketsError
  | GetDefaultUserPayMarket
  | GetDefaultUserPayMarketSuccess
  | GetDefaultUserPayMarketError;
