import { Action } from '@ngrx/store';

import { ADD_JOB_PAGE } from 'libs/features/add-jobs/constants/add-jobs-modal.constants';

export const OPEN_ADD_JOBS_MODAL_PAGE = '[AddJobs/JobBasedRangesAddJobsModalPage] Open Add Jobs Modal Page';
export const CLOSE_ADD_JOBS_MODAL_PAGE = '[AddJobs/JobBasedRangesAddJobsModalPage] Close Add Jobs Modal Page';
export const SET_CONTEXT = '[AddJobs/JobBasedRangesAddJobsModalPage] Set Context';
export const ADD_SELECTED_JOBS = '[AddJobs/JobBasedRangesAddJobsModalPage] Add Selected Jobs';
export const ADD_SELECTED_JOBS_SUCCESS = '[AddJobs/JobBasedRangesAddJobsModalPage] Add Selected Jobs Success';
export const ADD_SELECTED_JOBS_ERROR = '[AddJobs/JobBasedRangesAddJobsModalPage] Add Selected Jobs Error';

export class OpenAddJobsModalPage implements Action {
  readonly type = OPEN_ADD_JOBS_MODAL_PAGE;
}

export class CloseAddJobsModalPage implements Action {
  readonly type = CLOSE_ADD_JOBS_MODAL_PAGE;

  constructor(public source = ADD_JOB_PAGE.DEFAULT) { }
}

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: { PayMarketId: number, ProjectId: number, IsFromAddStructureModal: boolean }) {}
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


export type JobBasedRangesAddJobsModalPageActions
  = OpenAddJobsModalPage
  | CloseAddJobsModalPage
  | SetContext
  | AddSelectedJobs
  | AddSelectedJobsSuccess
  | AddSelectedJobsError;

