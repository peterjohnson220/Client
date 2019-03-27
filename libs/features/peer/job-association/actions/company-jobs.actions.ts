import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompanyJob } from '../models';

export const CLOSE_DETAIL_PANEL = '[Peer Job Association/Company Jobs] Close Detail Panel';
export const LOAD = '[Peer Job Association/Company Jobs] Load';
export const LOAD_COMPANY_JOBS  = '[Peer Job Association/Company Jobs] Load Company Jobs';
export const LOAD_COMPANY_JOBS_ERROR  = '[Peer Job Association/Company Jobs] Load Company Jobs Error';
export const LOAD_COMPANY_JOBS_SUCCESS  = '[Peer Job Association/Company Jobs] Load Company Jobs Success';
export const RESET = '[Peer Job Association/Company Jobs] Reset';
export const SELECT_COMPANY_JOB_FOR_DETAIL_PANEL = '[Peer Job Association/Company Jobs] Select Company Job For Detail Panel';
export const SELECT_COMPANY_JOBS_TO_ASSOCIATE = '[Peer Job Association/Company Jobs] Select Company Jobs to Associate';
export const TOGGLE_DETAIL_PANEL = '[Peer Job Association/Company Jobs] Toggle Detail Panel';
export const UPDATE_COMPANY_JOB_ID_FILTERS = '[Peer Job Association/Company Jobs] Update Company Job ID Filters';
export const UPDATE_SEARCH_TERM = '[Peer Job Association/Company Jobs] Update Search Term';

export class Load implements Action {
  readonly type = LOAD;
}

export class LoadCompanyJobs implements Action {
  readonly type = LOAD_COMPANY_JOBS;
}

export class LoadCompanyJobsError implements Action {
  readonly type = LOAD_COMPANY_JOBS_ERROR;
}

export class LoadCompanyJobsSuccess implements Action {
  readonly type = LOAD_COMPANY_JOBS_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export class SelectJobTitleOrCode implements Action {
  readonly type = SELECT_COMPANY_JOB_FOR_DETAIL_PANEL;
  constructor(public payload: CompanyJob) {}
}

export class SelectCompanyJobsToAssociate implements Action {
  readonly type = SELECT_COMPANY_JOBS_TO_ASSOCIATE;
  constructor(public payload: CompanyJob[]) {}
}

export class  UpdateCompanyJobIdFilters implements Action {
  readonly type = UPDATE_COMPANY_JOB_ID_FILTERS;
  constructor(public payload: number[]) {}
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) {}
}

export class ToggleDetailPanel implements Action {
  readonly type = TOGGLE_DETAIL_PANEL;
}

export class CloseDetailPanel implements Action {
  readonly type = CLOSE_DETAIL_PANEL;
}

export type Actions
  = CloseDetailPanel
  | Load
  | LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | Reset
  | SelectJobTitleOrCode
  | SelectCompanyJobsToAssociate
  | UpdateCompanyJobIdFilters
  | UpdateSearchTerm
  | ToggleDetailPanel;
