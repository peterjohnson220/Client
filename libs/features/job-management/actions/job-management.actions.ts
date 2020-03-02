import { Action } from '@ngrx/store';

import { CompanyJob, CompanyJobUdf, JobInfoResponse } from 'libs/models';

export const SHOW_JOB_MODAL = '[JobManagement] Show Job Modal';
export const SAVE_COMPANY_JOB = '[JobManagement] Save Company Job';
export const SAVE_COMPANY_JOB_SUCCESS = '[JobManagement] Save Company Job Success';
export const LOAD_JOB_OPTIONS = '[JobManagement] Load Job Options';
export const LOAD_JOB_OPTIONS_SUCCESS = '[JobManagement] Load Job Options Success';
export const LOAD_JOB = '[JobManagement] Load Job';
export const LOAD_JOB_SUCCESS = '[JobManagement] Load Job Success';
export const SET_DUPLICATE_JOB_CODE_ERROR = '[JobManagement] Set Duplicate Job Code Error';
export const UPDATE_COMPANY_JOB = '[JobManagement] Update Company Job';
export const HANDLE_API_ERROR = '[JobManagement] Handle API Error';

export class ShowJobModal implements Action {
  readonly type = SHOW_JOB_MODAL;
  constructor(public payload: boolean) { }
}

export class SaveCompanyJob implements Action {
  readonly type = SAVE_COMPANY_JOB;
  constructor() { }
}

export class SaveCompanyJobSuccess implements Action {
  readonly type = SAVE_COMPANY_JOB_SUCCESS;
  constructor() { }
}

export class LoadJobOptions implements Action {
  readonly type = LOAD_JOB_OPTIONS;
}

export class LoadJobOptionsSuccess implements Action {
  readonly type = LOAD_JOB_OPTIONS_SUCCESS;
  constructor(
    public jobFamilies: string[],
    public companyFlsaStatuses: string[],
    public companyJobUdfs: CompanyJobUdf[]) {}
}

export class LoadJob implements Action {
  readonly type = LOAD_JOB;
  constructor(public jobId: number) {}
}

export class LoadJobSuccess implements Action {
  readonly type = LOAD_JOB_SUCCESS;
  constructor(public payload: JobInfoResponse) {}
}

export class SetDuplicateJobCodeError implements Action {
    readonly type = SET_DUPLICATE_JOB_CODE_ERROR;
    constructor(public payload: boolean) { }
}

export class UpdateCompanyJob implements Action {
  readonly type = UPDATE_COMPANY_JOB;
  constructor(public payload: CompanyJob) { }
}

export class HandleApiError implements Action {
  readonly type = HANDLE_API_ERROR;
  constructor(public payload: string) { }
}

export type Actions
  = ShowJobModal
  | SaveCompanyJob
  | SaveCompanyJobSuccess
  | LoadJobOptions
  | LoadJobOptionsSuccess
  | LoadJob
  | LoadJobSuccess
  | SetDuplicateJobCodeError
  | UpdateCompanyJob
  | HandleApiError;
