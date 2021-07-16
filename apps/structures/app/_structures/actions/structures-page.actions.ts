import { Action } from '@ngrx/store';

import { CompanyStructure, StructureForm } from 'libs/models';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { RangeDistributionType } from 'libs/models/payfactors-api';
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
export const SHOW_STRUCTURE_FORM = '[Structures / Structures Page] Show Structure Form';
export const CREATE_STRUCTURE = '[Structures / Structures Page] Create Structure';
export const CREATE_STRUCTURE_SUCCESS = '[Structures / Structures Page] Create Structure Success';
export const CREATE_STRUCTURE_ERROR = '[Structures / Structures Page] Create Structure Error';
export const LOAD_COMPANY_STRUCTURES = '[Structures / Structures Page] Load Company Structures';
export const LOAD_COMPANY_STRUCTURES_SUCCESS = '[Structures / Structures Page] Load Company Structures Success';
export const LOAD_COMPANY_STRUCTURES_ERROR = '[Structures / Structures Page] Load Company Structures Error';
export const LOAD_RANGE_DISTRIBUTION_TYPES = '[Structures / Structures Page] Load Range Distribution Types';
export const LOAD_RANGE_DISTRIBUTION_TYPES_SUCCESS = '[Structures / Structures Page] Load Range Distribution Types Success';
export const LOAD_RANGE_DISTRIBUTION_TYPES_ERROR = '[Structures / Structures Page] Load Range Distribution Types Error';

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

export class ShowStructureForm implements Action {
  readonly type = SHOW_STRUCTURE_FORM;
  constructor(public showStructureForm: boolean) {}
}

export class CreateStructure implements Action {
  readonly type = CREATE_STRUCTURE;
  constructor(public payload: StructureForm) {}
}

export class CreateStructureSuccess implements Action {
  readonly type = CREATE_STRUCTURE_SUCCESS;
  constructor(public payload: { rangeType: string, rangeGroupId: number }) {}
}

export class CreateStructureError implements Action {
  readonly type = CREATE_STRUCTURE_ERROR;
  constructor(public payload: { errorMessage: string }) {}
}

export class LoadCompanyStructures implements Action {
  readonly type = LOAD_COMPANY_STRUCTURES;
  constructor() {}
}

export class LoadCompanyStructuresSuccess implements Action {
  readonly type = LOAD_COMPANY_STRUCTURES_SUCCESS;
  constructor(public payload: CompanyStructure[]) {}
}

export class LoadCompanyStructuresError implements Action {
  readonly type = LOAD_COMPANY_STRUCTURES_ERROR;
  constructor() {}
}

export class LoadRangeDistributionTypes implements Action {
  readonly type = LOAD_RANGE_DISTRIBUTION_TYPES;
  constructor() {}
}

export class LoadRangeDistributionTypesSuccess implements Action {
  readonly type = LOAD_RANGE_DISTRIBUTION_TYPES_SUCCESS;
  constructor(public payload: RangeDistributionType[]) {}
}

export class LoadRangeDistributionTypesError implements Action {
  readonly type = LOAD_RANGE_DISTRIBUTION_TYPES_ERROR;
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
  | LoadCompanyPayMarketsError
  | ShowStructureForm
  | CreateStructure
  | CreateStructureSuccess
  | CreateStructureError
  | LoadCompanyStructures
  | LoadCompanyStructuresSuccess
  | LoadCompanyStructuresError
  | LoadRangeDistributionTypes
  | LoadRangeDistributionTypesSuccess
  | LoadRangeDistributionTypesError;
