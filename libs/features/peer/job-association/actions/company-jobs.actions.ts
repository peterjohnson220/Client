import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompanyJob } from '../models';

export const LOAD_COMPANY_JOBS  = '[Peer Job Association Modal/Company Jobs Grid] Load Company Jobs';
export const LOAD_COMPANY_JOBS_SUCCESS  = '[Peer Job Association Modal/Company Jobs Grid] Load Company Jobs Success';
export const LOAD_COMPANY_JOBS_ERROR  = '[Peer Job Association Modal/Company Jobs Grid] Load Company Jobs Error';
export const RESET_STATE  = '[Peer Job Association Modal/Company Jobs Grid] Reset State';
export const SEARCH_TERM_UPDATED = '[Peer Job Association Modal/Company Jobs Grid] Search Term Updated';
export const SELECT_COMPANY_JOBS = '[Peer Job Association Modal/Company Jobs Grid] Select Company Jobs';
export const SELECT_COMPANY_JOB_FOR_DETAIL_PANEL = '[Peer Job Association Modal/Company Jobs Grid] Select Company Job For Detail Panel';
export const TOGGLE_DETAIL_PANEL = '[Peer Job Association Modal/Company Jobs Grid] Toggle Detail Panel';
export const CLOSE_DETAIL_PANEL = '[Peer Job Association Modal/Company Jobs Grid] Close Detail Panel';

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

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class SearchTermUpdated implements Action {
  readonly type = SEARCH_TERM_UPDATED;
  constructor(public payload: string) {}
}

export class SelectCompanyJobs implements Action {
  readonly type = SELECT_COMPANY_JOBS;
  constructor(public payload: CompanyJob[]) {}
}

export class SelectJobTitleOrCode implements Action {
  readonly type = SELECT_COMPANY_JOB_FOR_DETAIL_PANEL;
  constructor(public payload: CompanyJob) {}
}

export class ToggleDetailPanel implements Action {
  readonly type = TOGGLE_DETAIL_PANEL;
}

export class CloseDetailPanel implements Action {
  readonly type = CLOSE_DETAIL_PANEL;
}

export type Actions
  = LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | ResetState
  | SearchTermUpdated
  | SelectCompanyJobs
  | SelectJobTitleOrCode
  | ToggleDetailPanel
  | CloseDetailPanel;
