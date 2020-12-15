import { Action } from '@ngrx/store';
import { PricedPayMarkets, PricingHistoryChartFilters } from 'libs/models/payfactors-api';

export const UPDATE_JOB_ID = '[PricingHistoryChart] Update JobId';
export const LOAD_PRICED_PAYMARKETS = '[PricingHistoryChart] Load Priced Pay Markets';
export const LOAD_PRICED_PAYMARKETS_SUCCESS = '[PricingHistoryChart] Load Priced Pay Markets Success';
export const LOAD_PRICED_PAYMARKETS_ERROR = '[PricingHistoryChart] Load Priced Pay Markets Success';
export const UPDATE_FILTERS = '[PricingHistoryChart] Update Filters';

export class UpdateJobId implements Action {
  readonly type = UPDATE_JOB_ID;
  constructor(public jobId: number) { }
}

export class LoadPricedPayMarkets implements Action {
  readonly type = LOAD_PRICED_PAYMARKETS;
  constructor() { }
}

export class LoadPricedPayMarketsSuccess implements Action {
  readonly type = LOAD_PRICED_PAYMARKETS_SUCCESS;
  constructor(public payload: PricedPayMarkets[]) { }
}

export class LoadPricedPayMarketsError implements Action {
  readonly type = LOAD_PRICED_PAYMARKETS_ERROR;
  constructor(public payload: any) { }
}

export class UpdateFilters implements Action {
  readonly type = UPDATE_FILTERS;
  constructor(public payload: PricingHistoryChartFilters) { }
}


export type Actions
  = UpdateJobId
  | LoadPricedPayMarkets
  | LoadPricedPayMarketsSuccess
  | LoadPricedPayMarketsError
  | UpdateFilters;

