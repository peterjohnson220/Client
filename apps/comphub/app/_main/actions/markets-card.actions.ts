import { Action } from '@ngrx/store';

import { MDScopeResponse } from 'libs/models/payfactors-api';

import { PricingPaymarket, AddPayMarketFormData, CountryDataSet, MarketDataLocation } from '../models';

export const INIT_MARKETS_CARD = '[Comphub/Markets Card] Init Markets Card';
export const GET_PAYMARKETS = '[Comphub/Markets Card] Get Pay Markets';
export const GET_PAYMARKETS_SUCCESS = '[Comphub/Markets Card] Get Pay Markets Success';
export const GET_PAYMARKETS_ERROR = '[Comphub/Markets Card] Get Pay Markets Error';
export const SET_PAYMARKET_FILTER = '[Comphub/Markets Card] Set Pay Markets Filter';
export const SET_SELECTED_PAYMARKET = '[Comphub/Markets Card] Set Selected Pay Market';
export const SET_TO_DEFAULT_PAYMARKET = '[Comphub/Markets Card] Set to Default Paymarket';
export const SAVE_PAYMARKET = '[Comphub/Markets Card] Save Pay Market';
export const GET_MD_SCOPE = '[Comphub/Markets Card] Get Market Data Scope';
export const GET_MD_SCOPE_SUCCESS = '[Comphub/Markets Card] Get Market Data Scope Success';
export const GET_MD_SCOPE_ERROR = '[Comphub/Markets Card] Get Market Data Scope Error';
export const GET_MD_LOCATIONS = '[Comphub/Markets Card] Get Market Data Locations';
export const GET_MD_LOCATIONS_SUCCESS = '[Comphub/Markets Card] Get Market Data Locations Success';
export const GET_MD_LOCATIONS_ERROR = '[Comphub/Markets Card] Get Market Data Locations Error';
export const ORDER_PAYMARKETS_WITH_SELECTED_FIRST = '[Comphub/Markets Card] Order Pay Markets with Selected First';
export const HIDE_ADD_NEW_PAYMARKETS_BUTTON = '[Comphub/Markets Card] Hide Add New Paymarket Button';
export const DISPLAY_NATIONAL_AS_CARD = '[Comphub/Markets Card] Display National As Card';
export const CLEAR_MD_LOCATIONS = '[Comphub/Markets Card] Clear MD Locations';

export class InitMarketsCard implements Action {
  readonly type = INIT_MARKETS_CARD;

  constructor() {}
}

export class GetPaymarkets implements Action {
  readonly type = GET_PAYMARKETS;

  constructor(public payload: { countryCode: string }) {}
}

export class GetPaymarketsSuccess implements Action {
  readonly type = GET_PAYMARKETS_SUCCESS;

  constructor(public payload: PricingPaymarket[]) {}
}

export class GetPaymarketsError implements Action {
  readonly type = GET_PAYMARKETS_ERROR;

  constructor() {}
}

export class SetPaymarketFilter implements Action {
  readonly type = SET_PAYMARKET_FILTER;

  constructor(public payload: string) {}
}

export class SetSelectedPaymarket implements Action {
  readonly type = SET_SELECTED_PAYMARKET;

  constructor(public payload: { paymarket: PricingPaymarket, initialLoad?: boolean }) {}
}

export class SetToDefaultPaymarket implements Action {
  readonly type = SET_TO_DEFAULT_PAYMARKET;

  constructor() {}
}

export class SavePayMarket implements Action {
  readonly type = SAVE_PAYMARKET;

  constructor(public payload: AddPayMarketFormData) {}
}

export class GetMarketDataScope implements Action {
  readonly type = GET_MD_SCOPE;

  constructor() {}
}

export class GetMarketDataScopeSuccess implements Action {
  readonly type = GET_MD_SCOPE_SUCCESS;

  constructor(public payload: { response: MDScopeResponse, countryDataSet: CountryDataSet }) {}
}

export class GetMarketDataScopeError implements Action {
  readonly type = GET_MD_SCOPE_ERROR;
}

export class OrderPayMarketsWithSelectedFirst implements Action {
  readonly type = ORDER_PAYMARKETS_WITH_SELECTED_FIRST;
}

export class HideAddNewPaymarketButton implements Action {
  readonly type = HIDE_ADD_NEW_PAYMARKETS_BUTTON;
}

export class DisplayNationalAsCard implements Action {
  readonly type = DISPLAY_NATIONAL_AS_CARD;

  constructor(public payload: boolean) {}
}

export class GetMarketDataLocations implements Action {
  readonly type = GET_MD_LOCATIONS;

  constructor(public payload: string) {}
}

export class GetMarketDataLocationsSuccess implements Action {
  readonly type = GET_MD_LOCATIONS_SUCCESS;

  constructor(public payload: MarketDataLocation[]) {}
}

export class GetMarketDataLocationsError implements Action {
  readonly type = GET_MD_LOCATIONS_ERROR;
}

export class ClearMarketDataLocations implements Action {
  readonly type = CLEAR_MD_LOCATIONS;
}

export type Actions
  = InitMarketsCard
  | GetPaymarkets
  | GetPaymarketsSuccess
  | GetPaymarketsError
  | SetPaymarketFilter
  | SetSelectedPaymarket
  | SetToDefaultPaymarket
  | SavePayMarket
  | GetMarketDataScope
  | GetMarketDataScopeSuccess
  | GetMarketDataScopeError
  | OrderPayMarketsWithSelectedFirst
  | HideAddNewPaymarketButton
  | DisplayNationalAsCard
  | GetMarketDataLocations
  | GetMarketDataLocationsSuccess
  | GetMarketDataLocationsError
  | ClearMarketDataLocations;
