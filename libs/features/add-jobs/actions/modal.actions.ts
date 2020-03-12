import { Action } from '@ngrx/store';

export const OPEN_ADD_JOBS_MODAL = '[Add Jobs/Modal] Open Add Jobs Modal';
export const OPEN_ADD_JOBS_MODAL_ERROR = '[Add Jobs/Modal] Open Add Jobs Modal Error';
export const CLOSE_ADD_JOBS_MODAL = '[Add Jobs/Modal] Close Add Jobs Modal';
export const HANDLE_PAGE_COMPLETE = '[Add Jobs/Modal] Handle Page Complete';
export const CHANGE_PAGE = '[Add Jobs/Modal] Change Page';
export const SET_MODAL_TITLE = '[Add Jobs/Modal] Set Modal Title';

export class OpenAddJobsModal implements Action {
  readonly type = OPEN_ADD_JOBS_MODAL;

  constructor(public pageWorkflow: string[] = null, public modalTitlePrefix: string = '') { }
}

export class OpenAddJobsModalError implements Action {
  readonly type = OPEN_ADD_JOBS_MODAL_ERROR;

  constructor() { }
}

export class CloseAddJobsModal implements Action {
  readonly type = CLOSE_ADD_JOBS_MODAL;

  constructor() { }
}

export class HandlePageComplete implements Action {
  readonly type = HANDLE_PAGE_COMPLETE;

  constructor() { }
}

export class ChangePage implements Action {
  readonly type = CHANGE_PAGE;

  constructor(public page: string = null) {}
}

export class SetModalTitle implements Action {
  readonly type = SET_MODAL_TITLE;

  constructor(public payload: string) { }
}

export type Actions
  = OpenAddJobsModal
  | OpenAddJobsModalError
  | CloseAddJobsModal
  | HandlePageComplete
  | ChangePage
  | SetModalTitle;

