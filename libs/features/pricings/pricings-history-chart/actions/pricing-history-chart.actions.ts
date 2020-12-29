import { Action } from '@ngrx/store';
import { PricingHistoryChartFilters, PayMarketPricingHistory } from 'libs/models/payfactors-api';

export const UPDATE_JOB_ID = '[PricingHistoryChart] Update JobId';
export const INIT_PRICING_HISTORY_CHART = '[PricingHistoryChart] Init Pricing History Chart';
export const INIT_PRICING_HISTORY_CHART_SUCCESS = '[PricingHistoryChart] Init Pricing History Chart Success';
export const INIT_PRICING_HISTORY_CHART_ERROR = '[PricingHistoryChart] Init Pricing History Chart Error';
export const INIT_USER_DEFAULT_FILTERS = '[PricingHistoryChart] Init User Default Filters';
export const GET_DATA = '[PricingHistoryChart] Get Data';
export const GET_DATA_SUCCESS = '[PricingHistoryChart] Get Data Success';
export const UPDATE_FILTERS = '[PricingHistoryChart] Update Filters';
export const GET_DATA_ERROR = '[PricingHistoryChart] Get Data Success';

export class UpdateJobId implements Action {
  readonly type = UPDATE_JOB_ID;
  constructor(public jobId: number) { }
}

export class InitPricingHistoryChart implements Action {
  readonly type = INIT_PRICING_HISTORY_CHART;
  constructor() { }
}

export class InitPricingHistoryChartSuccess implements Action {
  readonly type = INIT_PRICING_HISTORY_CHART_SUCCESS;
  constructor(public payload: any[]) { }
}

export class InitPricingHistoryChartError implements Action {
  readonly type = INIT_PRICING_HISTORY_CHART_ERROR;
  constructor(public payload: any) { }
}

export class InitUserDefaultFilters implements Action {
  readonly type = INIT_USER_DEFAULT_FILTERS;
  constructor(public payload: PricingHistoryChartFilters) { }
}

export class GetData implements Action {
  readonly type = GET_DATA;
  constructor() { }
}

export class GetDataSuccess implements Action {
  readonly type = GET_DATA_SUCCESS;
  constructor(public payload: PayMarketPricingHistory[]) { }
}

export class GetDataError implements Action {
  readonly type = GET_DATA_ERROR;
  constructor(public payload: any) { }
}

export class UpdateFilters implements Action {
  readonly type = UPDATE_FILTERS;
  constructor(public payload: PricingHistoryChartFilters) { }
}


export type Actions
  = UpdateJobId
  | InitPricingHistoryChart
  | InitPricingHistoryChartSuccess
  | InitPricingHistoryChartError  
  | InitUserDefaultFilters
  | GetData
  | GetDataSuccess
  | GetDataError
  | UpdateFilters;

