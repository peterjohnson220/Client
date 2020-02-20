import { Action } from '@ngrx/store';

import { CompanyJob } from 'libs/models/company';
import { CompanyJobUdfColumn } from 'libs/models/jdm/company-job-udf-column';

export const CREATE_COMPANY_JOB = '[job-description-management / Add Job Modal] Create Company Job';
export const CREATE_COMPANY_JOB_ERROR = '[job-description-management / Add Job Modal] Create Company Job Error';
export const CREATE_COMPANY_JOB_SUCCESS = '[job-description-management / Add Job Modal] Create Company Job Success';
export const LOAD_COMPANY_JOB_UDF_COLUMNS = '[job-description-management / Add Job Modal] Load Company Job Udf Columns';
export const LOAD_COMPANY_JOB_UDF_COLUMNS_ERROR = '[job-description-management / Add Job Modal] Load Company Job Udf Columns Error';
export const LOAD_COMPANY_JOB_UDF_COLUMNS_SUCCESS = '[job-description-management / Add Job Modal] Load Company Job Udf Columns Success';
export const SET_DUPLICATE_COMPANY_JOB_MESSAGE = '[job-description-management / Add Job Modal] Set Duplicate Company Job Message';
export const UPDATE_COMPANY_JOB = '[job-description-management / Add Job Modal] Update Company Job';

export class CreateCompanyJob implements Action {
  readonly type = CREATE_COMPANY_JOB;

  constructor(public payload: CompanyJob) {}
}

export class CreateCompanyJobError implements Action {
  readonly type = CREATE_COMPANY_JOB_ERROR;

  constructor(public payload: any) {}
}

export class CreateCompanyJobSuccess implements Action {
  readonly type = CREATE_COMPANY_JOB_SUCCESS;

  constructor(public payload: CompanyJob) {}
}

export class LoadCompanyJobUdfColumns implements Action {
  readonly type = LOAD_COMPANY_JOB_UDF_COLUMNS;
}

export class LoadCompanyJobUdfColumnsError implements Action {
  readonly type = LOAD_COMPANY_JOB_UDF_COLUMNS_ERROR;
}

export class LoadCompanyJobUdfColumnsSuccess implements Action {
  readonly type = LOAD_COMPANY_JOB_UDF_COLUMNS_SUCCESS;

  constructor(public payload: CompanyJobUdfColumn[]) {}
}

export class SetDuplicateCompanyJobMessage implements Action {
  readonly type = SET_DUPLICATE_COMPANY_JOB_MESSAGE;

  constructor(public payload: {errorMessage: string}) {}
}

export class UpdateCompanyJob implements Action {
  readonly type = UPDATE_COMPANY_JOB;

  constructor(public payload: CompanyJob) {}
}

export type Actions
  = CreateCompanyJob
  | CreateCompanyJobError
  | CreateCompanyJobSuccess
  | LoadCompanyJobUdfColumns
  | LoadCompanyJobUdfColumnsError
  | LoadCompanyJobUdfColumnsSuccess
  | SetDuplicateCompanyJobMessage
  | UpdateCompanyJob;
