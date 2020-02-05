import { Action } from '@ngrx/store';

export const OPEN_ADD_JOBS_MODAL = '[AddJobs/JobBasedRangesAddJobsModal] Open Add Jobs Modal';
export const CLOSE_ADD_JOBS_MODAL = '[AddJobs/JobBasedRangesAddJobsModal] Close Add Jobs Modal';
export const SET_CONTEXT = '[AddJobs/JobBasedRangesAddJobsModal] Set Context';
export const ADD_SELECTED_JOBS = '[AddJobs/JobBasedRangesAddJobsModal] Add Selected Jobs';
export const ADD_SELECTED_JOBS_SUCCESS = '[AddJobs/JobBasedRangesAddJobsModal] Add Selected Jobs Success';
export const ADD_SELECTED_JOBS_ERROR = '[AddJobs/JobBasedRangesAddJobsModal] Add Selected Jobs Error';

export class OpenAddJobsModal implements Action {
  readonly type = OPEN_ADD_JOBS_MODAL;
}

export class CloseAddJobsModal implements Action {
  readonly type = CLOSE_ADD_JOBS_MODAL;
}

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: { PayMarketId: number, ProjectId: number}) {}
}

export class AddSelectedJobs implements Action {
  readonly type = ADD_SELECTED_JOBS;

  constructor() {}
}

export class AddSelectedJobsSuccess implements Action {
  readonly type = ADD_SELECTED_JOBS_SUCCESS;

  constructor() {}
}

export class AddSelectedJobsError implements Action {
  readonly type = ADD_SELECTED_JOBS_ERROR;

  constructor(public error: any) { }
}


export type AddJobsModalActions
  = OpenAddJobsModal
  | CloseAddJobsModal
  | SetContext
  | AddSelectedJobs
  | AddSelectedJobsSuccess
  | AddSelectedJobsError;

