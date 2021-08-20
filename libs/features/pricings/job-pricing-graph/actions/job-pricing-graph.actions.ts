import { Action } from '@ngrx/store';

import { EmployeesBasePayModel } from 'libs/models/payfactors-api/company/response/employees-base-pay-model.model';
import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';

export const GET_PRICING_DATA = '[Base Pay Graph] Get Pricing Data';
export const GET_PRICING_DATA_SUCCESS = '[Base Pay Graph] Get Pricing Data Success';
export const GET_PRICING_DATA_ERROR = '[Base Pay Graph] Get Pricing Data Error';

export const LOAD_BASE_PAY_DATA = '[Base Pay Graph] Get Base Pay Data';
export const LOAD_BASE_PAY_DATA_SUCCESS = '[Base Pay Graph] Get Base Pay Data Success';
export const LOAD_BASE_PAY_DATA_ERROR = '[Base Pay Graph] Get Base Pay Data Error';

export class GetPricingData implements Action {
  readonly type = GET_PRICING_DATA;

  constructor(public jobId: number, public paymarketId: number) {}
}

export class GetPricingDataSuccess implements Action {
  readonly type = GET_PRICING_DATA_SUCCESS;

  constructor(public pricing: PricingForPayGraph) {}
}

export class GetPricingDataError implements Action {
  readonly type = GET_PRICING_DATA_ERROR;

  constructor(public payload: any) {}
}

export class LoadBasePayData implements Action {
  readonly type = LOAD_BASE_PAY_DATA;

  constructor(public jobId: number, public paymarketId: number, public pricing: PricingForPayGraph) {}
}

export class LoadBasePayDataSuccess implements Action {
  readonly type = LOAD_BASE_PAY_DATA_SUCCESS;

  constructor(public pricing: PricingForPayGraph, public basePay: EmployeesBasePayModel[]) {}
}

export class LoadBasePayDataError implements Action {
  readonly type = LOAD_BASE_PAY_DATA_ERROR;

  constructor(public payload: any) {}
}

export type Actions
  = GetPricingData
  | GetPricingDataSuccess
  | GetPricingDataError
  | LoadBasePayData
  | LoadBasePayDataSuccess
  | LoadBasePayDataError;

