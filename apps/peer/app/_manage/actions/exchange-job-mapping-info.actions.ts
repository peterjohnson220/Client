import { Action } from '@ngrx/store';

import { CompanyJobToMapTo, UpsertExchangeJobMapRequest } from 'libs/models/peer';

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
export const OPEN_DELETE_CONFIRMATION_MODAL = '[Peer Main/Exchange Job Mapping Info] Open Delete Confirmation Modal';
export const CLOSE_DELETE_CONFIRMATION_MODAL = '[Peer Main/Exchange Job Mapping Info] Close Delete Confirmation Modal';
export const DELETE_MAPPING = '[Peer Main/Exchange Job Mapping Info] Delete Mapping';
export const DELETE_MAPPING_SUCCESS = '[Peer Main/Exchange Job Mapping Info] Delete Mapping Success';
export const DELETE_MAPPING_ERROR = '[Peer Main/Exchange Job Mapping Info] Delete Mapping Error';

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

export class OpenDeleteConfirmationModal implements Action {
  readonly type = OPEN_DELETE_CONFIRMATION_MODAL;
}

export class CloseDeleteConfirmationModal implements Action {
  readonly type = CLOSE_DELETE_CONFIRMATION_MODAL;
}

export class DeleteMapping implements Action {
  readonly type = DELETE_MAPPING;

  constructor(public payload: any) {}
}

export class DeleteMappingSuccess implements Action {
  readonly type = DELETE_MAPPING_SUCCESS;
}

export class DeleteMappingError implements Action {
  readonly type = DELETE_MAPPING_ERROR;
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
  | CancelEditMapping
  | OpenDeleteConfirmationModal
  | CloseDeleteConfirmationModal
  | DeleteMapping
  | DeleteMappingSuccess
  | DeleteMappingError;
