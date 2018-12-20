import { Action } from '@ngrx/store';

export const GET_JDM_STATUS = '[Project Add Jobs/Create New Job Page] Get Jdm Status';
export const GET_JDM_STATUS_SUCCESS = '[Project Add Jobs/Create New Job Page] Get Jdm Status Success';
export const GET_JDM_STATUS_ERROR = '[Project Add Jobs/Create New Job Page] Get Jdm Status Error';
export const GET_JOB_FAMILIES = '[Project Add Jobs/Create New Job Page] Get Job Families';
export const GET_JOB_FAMILIES_SUCCESS = '[Project Add Jobs/Create New Job Page] Get Job Families Success';
export const GET_JOB_FAMILIES_ERROR = '[Project Add Jobs/Create New Job Page] Get Job Families Error';
export const CREATE_JOB = '[Project Add Jobs/Create New Job Page] Create Job';
export const CREATE_JOB_SUCCESS = '[Project Add Jobs/Create New Job Page] Create Job Success';
export const CREATE_JOB_ERROR = '[Project Add Jobs/Create New Job Page] Create Job Error';
export const RESET = '[Project Add Jobs/Create New Job Page] Reset';
export const JOB_CODE_EXISTS_ERROR = '[Project Add Jobs/Create New Job Page] Job Code Exists Error';
export const CLEAR_JOB_CODE_EXISTS_ERROR = '[Project Add Jobs/Create New Job Page] Clear Job Code Exists Error';

export class GetJdmStatus implements Action {
  readonly type = GET_JDM_STATUS;

  constructor() {}
}

export class GetJdmStatusSuccess implements Action {
  readonly type = GET_JDM_STATUS_SUCCESS;

  constructor(public payload: boolean) {}
}

export class GetJdmStatusError implements Action {
  readonly type = GET_JDM_STATUS_ERROR;

  constructor() {}
}

export class GetJobFamilies implements Action {
  readonly type = GET_JOB_FAMILIES;

  constructor() {}
}

export class GetJobFamiliesSuccess implements Action {
  readonly type = GET_JOB_FAMILIES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetJobFamiliesError implements Action {
  readonly type = GET_JOB_FAMILIES_ERROR;

  constructor() {}
}

export class CreateJob implements Action {
  readonly type = CREATE_JOB;

  constructor(public payload: any) {}
}

export class CreateJobSuccess implements Action {
  readonly type = CREATE_JOB_SUCCESS;

  constructor() {}
}

export class CreateJobError implements Action {
  readonly type = CREATE_JOB_ERROR;

  constructor() {}
}

export class Reset implements Action {
  readonly type = RESET;

  constructor() {}
}

export class JobCodeExistsError implements Action {
  readonly type = JOB_CODE_EXISTS_ERROR;

  constructor() {}
}

export class ClearJobCodeExistsError implements Action {
  readonly type = CLEAR_JOB_CODE_EXISTS_ERROR;

  constructor() {}
}

export type Actions
  = GetJdmStatus
  | GetJdmStatusSuccess
  | GetJdmStatusError
  | GetJobFamilies
  | GetJobFamiliesSuccess
  | GetJobFamiliesError
  | CreateJob
  | CreateJobSuccess
  | CreateJobError
  | Reset
  | JobCodeExistsError
  | ClearJobCodeExistsError;
