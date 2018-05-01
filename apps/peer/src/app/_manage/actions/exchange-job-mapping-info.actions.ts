import { Action } from '@ngrx/store';

import { CompanyJobToMapTo, UpsertExchangeJobMapRequest } from 'libs/models/peer/index';

export const LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY =
  '[Peer Main/Exchange Job Mapping Info] Load Company Jobs To Map To By Query';
export const LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY_SUCCESS =
  '[Peer Main/Exchange Job Mapping Info] Load Company Jobs To Map To By Query Success';
export const LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY_ERROR =
  '[Peer Main/Exchange Job Mapping Info] Load Company Jobs To Map To By Query Error';
export const SELECT_COMPANY_JOB = '[Peer Main/Exchange Job Mapping Info] Select Company Job';
export const APPLY_MAPPING = '[Peer Main/Exchange Job Mapping Info] Apply Mapping';
export const APPLY_MAPPING_SUCCESS = '[Peer Main/Exchange Job Mapping Info] Apply Mapping Success';
export const APPLY_MAPPING_ERROR = '[Peer Main/Exchange Job Mapping Info] Apply Mapping Error';
export const EDIT_MAPPING = '[Peer Main/Exchange Job Mapping Info] Edit Mapping';
export const CANCEL_EDIT_MAPPING = '[Peer Main/Exchange Job Mapping Info] Cancel Edit Mapping';

export class LoadCompanyJobsToMapToByQuery implements Action {
  readonly type = LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY;

  constructor(public payload: any) {}
}

export class LoadCompanyJobsToMapToByQuerySuccess implements Action {
  readonly type = LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY_SUCCESS;

  constructor(public payload: CompanyJobToMapTo[]) {}
}

export class LoadCompanyJobsToMapToByQueryError implements Action {
  readonly type = LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY_ERROR;
}

export class SelectCompanyJob implements Action {
  readonly type = SELECT_COMPANY_JOB;

  constructor(public payload: number) {}
}

export class ApplyMapping implements Action {
  readonly type = APPLY_MAPPING;

  constructor(public payload: UpsertExchangeJobMapRequest) {}
}

export class ApplyMappingSuccess implements Action {
  readonly type = APPLY_MAPPING_SUCCESS;
}

export class ApplyMappingError implements Action {
  readonly type = APPLY_MAPPING_ERROR;
}

export class EditMapping implements Action {
  readonly type = EDIT_MAPPING;
}

export class CancelEditMapping implements Action {
  readonly type = CANCEL_EDIT_MAPPING;
}

export type Actions
  = LoadCompanyJobsToMapToByQuery
  | LoadCompanyJobsToMapToByQuerySuccess
  | LoadCompanyJobsToMapToByQueryError
  | SelectCompanyJob
  | ApplyMapping
  | ApplyMappingSuccess
  | ApplyMappingError
  | EditMapping
  | CancelEditMapping;
