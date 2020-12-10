import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export const INITIATE_JOB_DESCRIPTION_EXPORT = '[Data Management / Job Description] Initiate Job Description Export';
export const INITIATE_JOB_DESCRIPTION_EXPORT_SUCCESS = '[Data Management / Job Description] Initiate Job Description Export Success';
export const INITIATE_JOB_DESCRIPTION_EXPORT_ERROR = '[Data Management / Job Description] Initiate Job Description Export Error';

export class InitiateJobDescriptionExport implements Action {
  readonly type = INITIATE_JOB_DESCRIPTION_EXPORT;

  constructor() {}
}

export class InitiateJobDescriptionExportSuccess {
    readonly type = INITIATE_JOB_DESCRIPTION_EXPORT_SUCCESS;

    constructor() {}
}

export class InitiateJobDescriptionExportError {
    readonly type = INITIATE_JOB_DESCRIPTION_EXPORT_ERROR;

    constructor(public payload: HttpErrorResponse) {}
}

export type Actions
  = InitiateJobDescriptionExport
  | InitiateJobDescriptionExportSuccess
  | InitiateJobDescriptionExportError;
