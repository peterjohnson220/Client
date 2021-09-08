import { Action } from '@ngrx/store';

import { EmployeesPayModel } from 'libs/models/payfactors-api/company/response/employees-pay-model.model';
import { PricingForPayGraph } from 'libs/models/payfactors-api/pricings/response';

export const GET_BASE_PRICING_DATA = '[Job Pricing Graph] Get Base Pricing Data';
export const GET_BASE_PRICING_DATA_SUCCESS = '[Job Pricing Graph] Get Base Pricing Data Success';
export const GET_BASE_PRICING_DATA_ERROR = '[Job Pricing Graph] Get Base Pricing Data Error';

export const GET_TCC_PRICING_DATA = '[Job Pricing Graph] Get TCC Pricing Data';
export const GET_TCC_PRICING_DATA_SUCCESS = '[Job Pricing Graph] Get TCC Pricing Data Success';
export const GET_TCC_PRICING_DATA_ERROR = '[Job Pricing Graph] Get TCC Pricing Data Error';

export const LOAD_GRAPH_PAY_DATA = '[Job Pricing Graph] Get Graph Pay Data';
export const LOAD_GRAPH_PAY_DATA_SUCCESS = '[Job Pricing Graph] Get Graph Pay Data Success';
export const LOAD_GRAPH_PAY_DATA_ERROR = '[Job Pricing Graph] Get Graph Pay Data Error';

export class GetBasePricingData implements Action {
  readonly type = GET_BASE_PRICING_DATA;

  constructor(public jobId: number, public paymarketId: number, public payData: EmployeesPayModel[]) {}
}

export class GetBasePricingDataSuccess implements Action {
  readonly type = GET_BASE_PRICING_DATA_SUCCESS;

  constructor(public pricing: PricingForPayGraph, public payData: EmployeesPayModel[]) {}
}

export class GetBasePricingDataError implements Action {
  readonly type = GET_BASE_PRICING_DATA_ERROR;

  constructor(public payload: any) {}
}

export class GetTccPricingData implements Action {
  readonly type = GET_TCC_PRICING_DATA;

  constructor(public jobId: number, public paymarketId: number, public payData: EmployeesPayModel[]) {}
}

export class GetTccPricingDataSuccess implements Action {
  readonly type = GET_TCC_PRICING_DATA_SUCCESS;

  constructor(public pricing: PricingForPayGraph, public payData: EmployeesPayModel[]) {}
}

export class GetTccPricingDataError implements Action {
  readonly type = GET_TCC_PRICING_DATA_ERROR;

  constructor(public payload: any) {}
}

export class LoadGraphPayData implements Action {
  readonly type = LOAD_GRAPH_PAY_DATA;

  constructor(public jobId: number, public paymarketId: number) {}
}

export class LoadGraphPayDataSuccess implements Action {
  readonly type = LOAD_GRAPH_PAY_DATA_SUCCESS;

  constructor(public payData: EmployeesPayModel[]) {}
}

export class LoadGraphPayDataError implements Action {
  readonly type = LOAD_GRAPH_PAY_DATA_ERROR;

  constructor(public payload: any) {}
}

export type Actions
  = GetBasePricingData
  | GetBasePricingDataSuccess
  | GetBasePricingDataError
  | GetTccPricingData
  | GetTccPricingDataSuccess
  | GetTccPricingDataError
  | LoadGraphPayData
  | LoadGraphPayDataSuccess
  | LoadGraphPayDataError;

