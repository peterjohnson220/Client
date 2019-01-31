import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeJobMapping } from 'libs/models/peer';

export const LOAD_EXCHANGE_JOB_MAPPINGS = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings';
export const LOAD_EXCHANGE_JOB_MAPPINGS_SUCCESS = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings Success';
export const LOAD_EXCHANGE_JOB_MAPPINGS_ERROR = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings Error';
export const SET_ACTIVE_EXCHANGE_JOB = '[Peer Main/Exchange Job Mapping] Set Active Exchange Job';
export const RESET_ACTIVE_EXCHANGE_JOB = '[Peer Main/Exchange Job Mapping] ReSet Active Exchange Job';
export const UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO = '[Peer Main/Exchange Job Mapping] Update Page Row Index To Scroll To';
export const LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP = '[Peer Main/Exchange Job Mapping] Load Exchange Job Mappings After Map';

export class LoadExchangeJobMappings implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS;

  constructor() { }
}

export class LoadExchangeJobMappingsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS_SUCCESS;

  constructor(public payload: GridDataResult) { }
}

export class LoadExchangeJobMappingsError implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS_ERROR;
}

export class SetActiveExchangeJob implements Action {
  readonly type = SET_ACTIVE_EXCHANGE_JOB;

  constructor(public payload: ExchangeJobMapping) { }
}

export class UpdatePageRowIndexToScrollTo implements Action {
  readonly type = UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO;

  constructor(public payload: number) { }
}

export class ReSetActiveExchangeJob implements Action {
  readonly type = RESET_ACTIVE_EXCHANGE_JOB;
}

export class LoadExchangeJobMappingsAfterMap implements Action {
  readonly type = LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP;
}

export type Actions
  = LoadExchangeJobMappings
  | LoadExchangeJobMappingsSuccess
  | LoadExchangeJobMappingsError
  | SetActiveExchangeJob
  | UpdatePageRowIndexToScrollTo
  | ReSetActiveExchangeJob
  | LoadExchangeJobMappingsAfterMap;
