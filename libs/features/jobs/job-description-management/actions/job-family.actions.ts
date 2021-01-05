import { Action } from '@ngrx/store';

export const LOAD_JOB_FAMILIES = '[job-description-management / Job Family] Load Job Families';
export const LOAD_JOB_FAMILIES_ERROR = '[job-description-management / Job Family] Load Job Families Error';
export const LOAD_JOB_FAMILIES_SUCCESS = '[job-description-management / Job Family] Load Job Families Success';

export class LoadJobFamilies implements Action {
  readonly type = LOAD_JOB_FAMILIES;
}

export class LoadJobFamiliesError implements Action {
  readonly type = LOAD_JOB_FAMILIES_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class LoadJobFamiliesSuccess implements Action {
  readonly type = LOAD_JOB_FAMILIES_SUCCESS;

  constructor(public payload: string[]) {}
}

export type Actions
  = LoadJobFamilies
  | LoadJobFamiliesError
  | LoadJobFamiliesSuccess;
