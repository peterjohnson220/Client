import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOADING_EXCHANGE_JOB_MAPPINGS  = '[Peer Main/Exchange Job Mapping] Loading Exchange Job Mappings';
export const LOADING_EXCHANGE_JOB_MAPPINGS_SUCCESS  = '[Peer Main/Exchange Job Mapping] Loading Exchange Job Mappings Success';
export const LOADING_EXCHANGE_JOB_MAPPINGS_ERROR = '[Peer Main/Exchange Job Mapping] Loading Exchange Job Mappings Error';
export const UPDATE_EXCHANGE_JOB_MAPPINGS_QUERY = '[Peer Main/Exchange Job Mapping] Update Exchange Job Mappings Query';

export class LoadingExchangeJobMappings implements Action {
  readonly type = LOADING_EXCHANGE_JOB_MAPPINGS;

  constructor(public payload: any) {}
}

export class LoadingExchangeJobMappingsSuccess implements Action {
  readonly type = LOADING_EXCHANGE_JOB_MAPPINGS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadingExchangeJobMappingsError implements Action {
  readonly type = LOADING_EXCHANGE_JOB_MAPPINGS_ERROR;
}

export class UpdateExchangeJobMappingsQuery implements Action {
  readonly type = UPDATE_EXCHANGE_JOB_MAPPINGS_QUERY;

  constructor(public payload: string) {}
}

export type Actions
  = LoadingExchangeJobMappings
  | LoadingExchangeJobMappingsSuccess
  | LoadingExchangeJobMappingsError
  | UpdateExchangeJobMappingsQuery;
