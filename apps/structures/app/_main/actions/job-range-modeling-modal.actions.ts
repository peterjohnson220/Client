import { Action } from '@ngrx/store';

import { JobRangeModelingModalPage } from '../constants/structures.constants';

export const OPEN_MODAL = '[Structures / Job Range Modeling Modal] Open Modal';
export const CLOSE_MODAL = '[Structures / Job Range Modeling Modal] Close Modal';
export const UPDATE_TITLE = '[Structures / Job Range Modeling Modal] Update Title';
export const CHANGE_PAGE = '[AddJobs/JobBasedRangesAddJobsModalStructures / Job Range Modeling Modal] Change Page';

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;

  constructor(public payload: JobRangeModelingModalPage) {}
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class UpdateTitle implements Action {
  readonly type = UPDATE_TITLE;

  constructor(public payload: string) {}
}

export class ChangePage implements Action {
  readonly type = CHANGE_PAGE;

  constructor(public payload: JobRangeModelingModalPage) {}
}


export type JobRangeModelingModalActions
  = OpenModal
  | CloseModal
  | UpdateTitle
  | ChangePage;

