import { Action } from '@ngrx/store';

export const LOAD_JOB_DESCRIPTION = '[Job Description] Load Job Description';
export const LOAD_JOB_DESCRIPTION_SUCCESS = '[Job Description] Load Job Description Success';
export const SAVE_JOB_DESCRIPTION = '[Job Description] Save Job Description';
export const CHANGE_JOB_DESCRIPTION = '[Job Description] Change Job Description';
export const SAVE_JOB_DESCRIPTION_SUCCESS = '[Job Description] Save Job Description Success';


export class LoadJobDescription implements Action {
  readonly type = LOAD_JOB_DESCRIPTION;
  constructor(public payload: number) {}
}
export class LoadJobDescriptionSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_SUCCESS;
  constructor(public payload: any) {}
}
export class SaveJobDescription implements Action {
  readonly type = SAVE_JOB_DESCRIPTION;
  constructor(public payload: { jobId: number, jobDescription: string} ) {}
}

export class ChangeJobDescription implements Action {
  readonly type = CHANGE_JOB_DESCRIPTION;
  constructor(public payload: string) {}
}

export class SaveJobDescriptionSuccess  implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_SUCCESS;
  constructor() {}
}

export type JobDescriptionActions
  = LoadJobDescription
  | LoadJobDescriptionSuccess
  | SaveJobDescription
  | ChangeJobDescription
  | SaveJobDescriptionSuccess;
