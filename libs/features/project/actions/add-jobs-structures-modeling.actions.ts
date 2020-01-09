import { Action } from '@ngrx/store';

export const OPEN_ADD_JOBS_MODAL = '[Project/AddJobsStructuresModelingModal] Open Add Jobs Modal';
export const CLOSE_ADD_JOBS_MODAL = '[Project/AddJobsStructuresModelingModal] Close Add Jobs Modal';

export class OpenAddJobsModal implements Action {
  readonly type = OPEN_ADD_JOBS_MODAL;
}

export class CloseAddJobsModal implements Action {
  readonly type = CLOSE_ADD_JOBS_MODAL;
}

export type AddJobsStructuresModelingActions
  = OpenAddJobsModal
  | CloseAddJobsModal;
