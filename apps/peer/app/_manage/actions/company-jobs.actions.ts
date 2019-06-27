import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_COMPANY_JOBS  = '[Peer Company Jobs] Load Company Jobs';
export const LOAD_COMPANY_JOBS_SUCCESS  = '[Peer Company Jobs] Load Company Jobs Success';
export const LOAD_COMPANY_JOBS_ERROR  = '[Peer Company Jobs] Load Company Jobs Error';
export const LOAD_COMPANY_JOBS_PAGING_ERROR  = '[Peer Company Jobs] Load Company Jobs Paging Error';
export const UPDATE_COMPANY_JOBS_SEARCH_TERM = '[Peer Company Jobs] Update Company Jobs Search Term';

export class LoadCompanyJobs implements Action {
  readonly type = LOAD_COMPANY_JOBS;
}

export class LoadCompanyJobsSuccess implements Action {
  readonly type = LOAD_COMPANY_JOBS_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class LoadCompanyJobsError implements Action {
  readonly type = LOAD_COMPANY_JOBS_ERROR;
}

export class LoadCompanyJobsPagingError implements Action {
  readonly type = LOAD_COMPANY_JOBS_PAGING_ERROR;
  constructor(public payload: string) {}
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_COMPANY_JOBS_SEARCH_TERM;
  constructor(public payload: string) {}
}

export type Actions =
  | LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | LoadCompanyJobsPagingError
  | UpdateSearchTerm;
