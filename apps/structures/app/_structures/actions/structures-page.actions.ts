import { Action } from '@ngrx/store';

import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { PayMarket } from 'libs/models/paymarket';

export const DELETE_STRUCTURE_MODEL = '[Structures / Structures Page] Delete Structure Model';
export const DELETE_STRUCTURE_MODEL_SUCCESS  = '[Structures / Structures Page] Delete Structure Model Success';
export const DELETE_STRUCTURE_MODEL_ERROR  = '[Structures  / Structures Page] Delete Structure Model Error';
export const OPEN_DELETE_STRUCTURES_MODAL = '[Structures / Structures Page] Open Delete Structure Modal';
export const CLOSE_DELETE_STRUCTURES_MODAL = '[Structures / Structures Page] Close Delete Structure Modal';
export const LOAD_CURRENCIES  = '[Structures / Structures Page] Load Currencies';
export const LOAD_CURRENCIES_SUCCESS  = '[Structures / Structures Page] Load Currencies Success';
export const LOAD_CURRENCIES_ERROR  = '[Structures / Structures Page] Load Currencies Error';
export const LOAD_COMPANY_PAYMARKETS = '[Structures / Structures Page] Load Company Pay Markets';
export const LOAD_COMPANY_PAYMARKETS_SUCCESS = '[Structures / Structures Page] Load Company Pay Markets Success';
export const LOAD_COMPANY_PAYMARKETS_ERROR = '[Structures / Structures Page] Load Company Pay Markets Error';

export class DeleteStructureModel implements Action {
  readonly type = DELETE_STRUCTURE_MODEL;

  constructor(public payload: { pageViewId: string, rangeGroupIds: number[] }) {}
}

export class DeleteStructureModelSuccess implements Action {
  readonly type = DELETE_STRUCTURE_MODEL_SUCCESS;

  constructor() {}
}

export class DeleteStructureModelError implements Action {
  readonly type = DELETE_STRUCTURE_MODEL_ERROR;

  constructor() {}
}

export class OpenDeletePayMarketModal implements Action {
  readonly type = OPEN_DELETE_STRUCTURES_MODAL;
  constructor() {}
}

export class CloseDeletePayMarketModal implements Action {
  readonly type = CLOSE_DELETE_STRUCTURES_MODAL;
  constructor() {}
}

export class LoadCurrencies implements Action {
  readonly type = LOAD_CURRENCIES;

  constructor() {}
}

export class LoadCurrenciesSuccess implements Action {
  readonly type = LOAD_CURRENCIES_SUCCESS;

  constructor(public payload: KendoTypedDropDownItem[]) {}
}

export class LoadCurrenciesError implements Action {
  readonly type = LOAD_CURRENCIES_ERROR;

  constructor() {}
}

export class LoadCompanyPayMarkets implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS;

  constructor() {}
}

export class LoadCompanyPayMarketsSuccess implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS_SUCCESS;

  constructor(public payload: PayMarket[]) {}
}

export class LoadCompanyPayMarketsError implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS_ERROR;

  constructor() {}
}

export type Actions
  = DeleteStructureModel
  | DeleteStructureModelSuccess
  | DeleteStructureModelError
  | OpenDeletePayMarketModal
  | CloseDeletePayMarketModal
  | LoadCurrencies
  | LoadCurrenciesSuccess
  | LoadCurrenciesError
  | LoadCompanyPayMarkets
  | LoadCompanyPayMarketsSuccess
  | LoadCompanyPayMarketsError;
