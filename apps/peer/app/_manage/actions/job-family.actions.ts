import { Action } from '@ngrx/store';

export const LOAD_JOB_FAMILIES  = '[Peer Main/Manage] Load Job Families';
export const LOAD_JOB_FAMILIES_SUCCESS  = '[Peer Main/Manage] Load Job Families Success';
export const LOAD_JOB_FAMILIES_ERROR  = '[Peer Main/Manage] Load Job Families Error';

export class LoadJobFamilies implements Action {
  readonly type = LOAD_JOB_FAMILIES;
}

export class LoadJobFamiliesSuccess implements Action {
  readonly type = LOAD_JOB_FAMILIES_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadJobFamiliesError implements Action {
  readonly type = LOAD_JOB_FAMILIES_ERROR;
}

export type Actions
  = LoadJobFamilies
  | LoadJobFamiliesSuccess
  | LoadJobFamiliesError;
