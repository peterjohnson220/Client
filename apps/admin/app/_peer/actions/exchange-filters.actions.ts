import { Action } from '@ngrx/store';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeSearchFilterAggregate } from 'libs/models/peer';

export const LOAD_EXCHANGE_FILTERS = '[Peer Admin/Exchange Filters] Load Exchange Filters';
export const LOAD_EXCHANGE_FILTERS_SUCCESS = '[Peer Admin/Exchange Filters] Load Exchange Filters Success';
export const LOAD_EXCHANGE_FILTERS_ERROR = '[Peer Admin/Exchange Filters] Load Exchange Filters Error';
export const PUT_FILTER = '[Peer Admin/Exchange Filters] Put Filter';
export const PUT_FILTER_SUCCESS = '[Peer Admin/Exchange Filters] Put Filter Success';
export const PUT_FILTER_ERROR = '[Peer Admin/Exchange Filters] Put Filter Error';
export const REORDER_FILTERS = '[Peer Admin/Exchange Filters] Reorder Filters';
export const REORDER_FILTERS_SUCCESS = '[Peer Admin/Exchange Filters] Reorder Filters Success';
export const REORDER_FILTERS_ERROR = '[Peer Admin/Exchange Filters] Reorder Filters Error';

export class LoadExchangeFilters implements Action {
  readonly type = LOAD_EXCHANGE_FILTERS;

  constructor(public payload: any) {}
}

export class LoadExchangeFiltersSuccess implements Action {
  readonly type = LOAD_EXCHANGE_FILTERS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeFilterError implements Action {
  readonly type = LOAD_EXCHANGE_FILTERS_ERROR;
}

export class PutFilter implements Action {
  readonly type = PUT_FILTER;

  constructor(public payload: ExchangeSearchFilterAggregate) {}
}

export class PutFilterSuccess implements Action {
  readonly type = PUT_FILTER_SUCCESS;

  constructor(public payload: ExchangeSearchFilterAggregate) {}
}

export class PutFilterError implements Action {
  readonly type = PUT_FILTER_ERROR;
}

export class ReorderFilters implements Action {
  readonly type = REORDER_FILTERS;

  constructor(public payload: ExchangeSearchFilterAggregate[]) {}
}

export class ReorderFiltersSuccess implements Action {
  readonly type = REORDER_FILTERS_SUCCESS;
}

export class ReorderFiltersError implements Action {
  readonly type = REORDER_FILTERS_ERROR;
}

export type Actions
  = LoadExchangeFilters
  | LoadExchangeFiltersSuccess
  | LoadExchangeFilterError
  | PutFilter
  | PutFilterSuccess
  | PutFilterError
  | ReorderFilters
  | ReorderFiltersSuccess
  | ReorderFiltersError;
