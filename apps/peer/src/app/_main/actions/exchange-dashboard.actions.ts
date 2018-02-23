import { Action } from '@ngrx/store';

import { GetChartRequest, ChartItem } from 'libs/models';

export const LOADING_CHART  = '[Peer Main/Exchange Dashboard] Loading Chart';
export const LOADING_CHART_SUCCESS  = '[Peer Main/Exchange Dashboard] Loading Chart Success';
export const LOADING_CHART_ERROR  = '[Peer Main/Exchange Dashboard] Loading Chart Error';

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
  = LoadingChart
  | LoadingChartSuccess
  | LoadingChartError;
