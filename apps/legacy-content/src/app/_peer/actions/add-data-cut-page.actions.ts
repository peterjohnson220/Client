import { Action } from '@ngrx/store';

import { ExchangeJobPayMarketFilter, ExchangeJobPayMarketFilterRequest } from 'libs/models/peer';

export const ADDING_DATA_CUT  = '[Legacy Content/Add Data Cut Page] Adding Data Cut';
export const ADDING_DATA_CUT_SUCCESS  = '[Legacy Content/Add Data Cut Page] Adding Data Cut Success';
export const ADDING_DATA_CUT_ERROR  = '[Legacy Content/Add Data Cut Page] Adding Data Cut Error';
export const CANCEL_ADD_DATA_CUT = '[Legacy Content/Add Data Cut Page] Cancel Add Data Cut';
export const LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER = '[Legacy Content/Add Data Cut Page] Load Exchange Job Pay Market Filter';
export const LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER_SUCCESS =
  '[Legacy Content/Add Data Cut Page] Load Exchange Job Pay Market Filter Success';

export class AddingDataCut implements Action {
  readonly type = ADDING_DATA_CUT;

  constructor(public payload: any) { }
}

export class AddingDataCutSuccess implements Action {
  readonly type = ADDING_DATA_CUT_SUCCESS;
}

export class AddingDataCutError implements Action {
  readonly type = ADDING_DATA_CUT_ERROR;
}

export class CancelAddDataCut implements Action {
  readonly type = CANCEL_ADD_DATA_CUT;
}

export class LoadingExchangeJobPayMarketFilter implements Action {
  readonly type = LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER;

  constructor(public payload: ExchangeJobPayMarketFilterRequest) { }
}

export class LoadingExchangeJobPayMarketFilterSuccess implements Action {
  readonly type = LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER_SUCCESS;

  constructor(public payload: ExchangeJobPayMarketFilter) { }
}

export type Actions
  = AddingDataCut
  | AddingDataCutSuccess
  | AddingDataCutError
  | CancelAddDataCut
  | LoadingExchangeJobPayMarketFilter
  | LoadingExchangeJobPayMarketFilterSuccess;
