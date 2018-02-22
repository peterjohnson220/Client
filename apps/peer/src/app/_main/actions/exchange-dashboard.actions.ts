import { Action } from '@ngrx/store';

import { Exchange, GetChartRequest, ChartItem } from 'libs/models';

export const LOADING_EXCHANGE  = '[Peer Main/Exchange Dashboard] Loading Exchange';
export const LOADING_EXCHANGE_SUCCESS  = '[Peer Main/Exchange Dashboard] Loading Exchange Success';
export const LOADING_EXCHANGE_ERROR  = '[Peer Main/Exchange Dashboard] Loading Exchange Error';
export const LOADING_CHART  = '[Peer Main/Exchange Dashboard] Loading Chart';
export const LOADING_CHART_SUCCESS  = '[Peer Main/Exchange Dashboard] Loading Chart Success';
export const LOADING_CHART_ERROR  = '[Peer Main/Exchange Dashboard] Loading Chart Error';

export class LoadingExchange implements Action {
  readonly type = LOADING_EXCHANGE;

  constructor(public payload: number) {}
}

export class LoadingExchangeSuccess implements Action {
  readonly type = LOADING_EXCHANGE_SUCCESS;

  constructor(public payload: Exchange) {}
}

export class LoadingExchangeError implements Action {
  readonly type = LOADING_EXCHANGE_ERROR;
}

export class LoadingChart implements Action {
  readonly type = LOADING_CHART;

  constructor(public payload: GetChartRequest) {}
}

export class LoadingChartSuccess implements Action {
  readonly type = LOADING_CHART_SUCCESS;

  constructor(public payload: ChartItem[]) {}
}

export class LoadingChartError implements Action {
  readonly type = LOADING_CHART_ERROR;
}

export type Actions
  = LoadingExchange
  | LoadingExchangeSuccess
  | LoadingExchangeError
  | LoadingChart
  | LoadingChartSuccess
  | LoadingChartError;
