import { Action } from '@ngrx/store';
import { JobDescriptionSummary } from 'libs/models';
import { JobDescriptionExportRequest } from 'libs/models/payfactors-api';

export const LOAD_JOB_DESCRIPTION = '[Job Description] Load Job Description';
export const LOAD_JOB_DESCRIPTION_SUCCESS = '[Job Description] Load Job Description Success';
export const LOAD_JOB_DESCRIPTION_ERROR = '[Job Description] Load Job Description Error';
export const CHANGE_JOB_DESCRIPTION = '[Job Description] Change Job Description';
export const SAVE_JOB_DESCRIPTION = '[Job Description] Save Job Description';
export const SAVE_JOB_DESCRIPTION_SUCCESS = '[Job Description] Save Job Description Success';
export const SAVE_JOB_DESCRIPTION_ERROR = '[Job Description] Save Job Description Error';
export const EXPORT_JOB_DESCRIPTION = '[Job Description] Export Job Description';
export const EXPORT_JOB_DESCRIPTION_SUCCESS = '[Job Description] Export Job Description Success';
export const EXPORT_JOB_DESCRIPTION_ERROR = '[Job Description] Export Job Description Error';

export class LoadJobDescription implements Action {
  readonly type = LOAD_JOB_DESCRIPTION;
  constructor(public payload: number) {}
}

export class LoadJobDescriptionSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_SUCCESS;
  constructor(public payload: JobDescriptionSummary) {}
}

export class LoadJobDescriptionError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_ERROR;
  constructor() {}
}

export class ChangeJobDescription implements Action {
  readonly type = CHANGE_JOB_DESCRIPTION;
  constructor(public payload: string) {}
}

export class SaveJobDescription implements Action {
  readonly type = SAVE_JOB_DESCRIPTION;
  constructor() {}
}

export class SaveJobDescriptionSuccess  implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_SUCCESS;
  constructor(public payload: string) {}
}

export class SaveJobDescriptionError  implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_ERROR;
  constructor() {}
}

export class ExportJobDescription implements Action {
  readonly type = EXPORT_JOB_DESCRIPTION;
  constructor(public payload: JobDescriptionExportRequest) {}
}

export class ExportJobDescriptionSuccess implements Action {
  readonly type = EXPORT_JOB_DESCRIPTION_SUCCESS;
  constructor() {}
}

export class ExportJobDescriptionError implements Action {
  readonly type = EXPORT_JOB_DESCRIPTION_ERROR;
  constructor() {}
}

export type JobDescriptionActions
  = LoadJobDescription
  | LoadJobDescriptionSuccess
  | LoadJobDescriptionError
  | ChangeJobDescription
  | SaveJobDescription
  | SaveJobDescriptionSuccess
  | SaveJobDescriptionError
  | ExportJobDescription
  | ExportJobDescriptionSuccess
  | ExportJobDescriptionError;
