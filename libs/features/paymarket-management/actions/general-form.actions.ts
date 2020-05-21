import { Action } from '@ngrx/store';

import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { GroupedListItem } from 'libs/models/list';
import { PayMarket } from 'libs/models';

export const GET_COUNTRIES = '[Pay Market Management / General Form] Get Countries';
export const GET_COUNTRIES_SUCCESS = '[Pay Market Management / General Form] Get Countries Success';
export const GET_COUNTRIES_ERROR = '[Pay Market Management / General Form] Get Countries Error';
export const GET_CURRENCIES = '[Pay Market Management / General Form] Get Currencies';
export const GET_CURRENCIES_SUCCESS = '[Pay Market Management / General Form] Get Currencies Success';
export const GET_CURRENCIES_ERROR = '[Pay Market Management / General Form] Get Currencies Error';
export const GET_LINKED_PAY_MARKETS = '[Pay Market Management / General Form] Get Linked Pay Markets';
export const GET_LINKED_PAY_MARKETS_SUCCESS = '[Pay Market Management / General Form] Get Linked Pay Markets Success';
export const GET_LINKED_PAY_MARKETS_ERROR = '[Pay Market Management / General Form] Get Linked Pay Markets Error';
export const GET_SIZES = '[Pay Market Management / General Form] Get Sizes';
export const GET_SIZES_SUCCESS = '[Pay Market Management / General Form] Get Sizes Success';
export const GET_SIZES_ERROR = '[Pay Market Management / General Form] Get Sizes Error';
export const GET_USER_DEFAULT_SCOPE = '[Pay Market Management / General Form] Get User Default Scope';
export const GET_USER_DEFAULT_SCOPE_SUCCESS = '[Pay Market Management / General Form] Get User Default Scope Success';
export const GET_USER_DEFAULT_SCOPE_ERROR = '[Pay Market Management / General Form] Get User Default Scope Error';
export const GET_ALL_INDUSTRIES = '[Pay Market Management / General Form] Get All Industries';
export const GET_ALL_INDUSTRIES_SUCCESS = '[Pay Market Management / General Form] Get All Industries Success';
export const GET_ALL_INDUSTRIES_ERROR = '[Pay Market Management / General Form] Get All Industries Error';

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

export class GetSizes implements Action {
  readonly type = GET_SIZES;
  constructor() {}
}

export class GetSizesSuccess implements Action {
  readonly type = GET_SIZES_SUCCESS;
  constructor(public payload: GroupedListItem[]) {}
}

export class GetSizesError implements Action {
  readonly type = GET_SIZES_ERROR;
  constructor() {}
}

export class GetUserDefaultScope implements Action {
  readonly type = GET_USER_DEFAULT_SCOPE;
  constructor() {}
}

export class GetUserDefaultScopeSuccess implements Action {
  readonly type = GET_USER_DEFAULT_SCOPE_SUCCESS;
  constructor(public payload: PayMarket) {}
}

export class GetUserDefaultScopeError implements Action {
  readonly type = GET_USER_DEFAULT_SCOPE_ERROR;
  constructor() {}
}

export class GetAllIndustries implements Action {
  readonly type = GET_ALL_INDUSTRIES;
  constructor() {}
}

export class GetAllIndustriesSuccess implements Action {
  readonly type = GET_ALL_INDUSTRIES_SUCCESS;
  constructor(public payload: GroupedListItem[]) { }
}

export class GetAllIndustriesError implements Action {
  readonly type = GET_ALL_INDUSTRIES_ERROR;
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
  | GetSizes
  | GetSizesSuccess
  | GetSizesError
  | GetUserDefaultScope
  | GetUserDefaultScopeSuccess
  | GetUserDefaultScopeError
  | GetAllIndustries
  | GetAllIndustriesSuccess
  | GetAllIndustriesError;
