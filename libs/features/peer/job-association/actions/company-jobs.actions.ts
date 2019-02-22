import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_COMPANY_JOBS  = '[Peer Job Association Modal/Company Jobs Grid] Load Company Jobs';
export const LOAD_COMPANY_JOBS_SUCCESS  = '[Peer Job Association Modal/Company Jobs Grid] Load Company Jobs Success';
export const LOAD_COMPANY_JOBS_ERROR  = '[Peer Job Association Modal/Company Jobs Grid] Load Company Jobs Error';
export const SEARCH_TERM_UPDATED = '[Peer Job Association Modal/Company Jobs Grid] Search Term Updated';

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

export class SearchTermUpdated implements Action {
  readonly type = SEARCH_TERM_UPDATED;
  constructor(public payload: string) {}
}

export type Actions
  = LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | SearchTermUpdated;
