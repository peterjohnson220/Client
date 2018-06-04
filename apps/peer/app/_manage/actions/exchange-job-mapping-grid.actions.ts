import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeJobMapping } from 'libs/models/peer';

export const LOAD_EXCHANGE_JOB_MAPPINGS  = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings';
export const LOAD_EXCHANGE_JOB_MAPPINGS_SUCCESS  = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings Success';
export const LOAD_EXCHANGE_JOB_MAPPINGS_ERROR = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings Error';
export const SELECT_EXCHANGE_JOB_MAPPING = '[Peer Main/Exchange Job Mapping] Select Exchange Job Mapping';
export const RESELECT_EXCHANGE_JOB_MAPPING = '[Peer Main/Exchange Job Mapping] ReSelect Exchange Job Mapping';
export const UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO = '[Peer Main/Exchange Job Mapping] Update Page Row Index To Scroll To';
export const LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP  = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings After Map';

export class LoadExchangeJobMappings implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS;

  constructor(public payload: any) {}
}

export class LoadExchangeJobMappingsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeJobMappingsError implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS_ERROR;
}

export class SelectExchangeJobMapping implements Action {
  readonly type = SELECT_EXCHANGE_JOB_MAPPING;

  constructor(public payload: ExchangeJobMapping) {}
}

export class UpdatePageRowIndexToScrollTo implements Action {
  readonly type = UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO;

  constructor(public payload: number) {}
}

export class ReSelectExchangeJobMapping implements Action {
  readonly type = RESELECT_EXCHANGE_JOB_MAPPING;
}

export class LoadExchangeJobMappingsAfterMap implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP;
}

export type Actions
  = LoadExchangeJobMappings
  | LoadExchangeJobMappingsSuccess
  | LoadExchangeJobMappingsError
  | SelectExchangeJobMapping
  | UpdatePageRowIndexToScrollTo
  | ReSelectExchangeJobMapping
  | LoadExchangeJobMappingsAfterMap;
