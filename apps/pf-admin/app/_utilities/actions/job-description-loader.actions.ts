import { Action } from '@ngrx/store';

import { ValidateStepResultItem } from 'libs/models/jdm/validation-step-result-item.model';
import { CompanyDto } from 'libs/models/company';

import { JobDescriptionValidationRequest } from '../models/requests/job-description-validation-request.model';
import { LoadJobDescriptionRequest } from '../models/requests/job-description-load-request.model';
import { JobDescriptionDeleteByTemplateIdData } from '../models/requests/job-description-delete-by-template-id-data.model';

export const VALIDATE_JOB_DESCRIPTION_IMPORT = '[Pf-Admin/Job Description Loader] Validate Job Description Import';
export const VALIDATE_JOB_DESCRIPTION_IMPORT_SUCCESS = '[Pf-Admin/Job Description Loader] Validate Job Description Import Success';
export const LOAD_JOB_DESCRIPTIONS = '[Pf-Admin/Job Description Loader] Load Job Descriptions';
export const LOAD_JOB_DESCRIPTIONS_SUCCESS = '[Pf-Admin/Job Description Loader] Load Job Descriptions Success';
export const RESET_LOAD_JOB_DESCRIPTIONS = '[Pf-Admin/Job Description Loader] Reset Load Job Descriptions';
export const LOAD_COMPANY = '[Pf-Admin/Job Description Loader] Load Company';
export const LOAD_COMPANY_SUCCESS = '[Pf-Admin/Job Description Loader] Load Company Success';
export const DELETE_JOB_DESCRIPTIONS = '[Pf-Admin/Job Description Loader] Delete Job Descriptions';
export const DELETE_JOB_DESCRIPTIONS_SUCCESS = '[Pf-Admin/Job Description Loader] Delete Job Descriptions Success';
export const DELETE_JOB_DESCRIPTIONS_ERROR = '[Pf-Admin/Job Description Loader] Delete Job Descriptions Error';
export const CLEAR_DELETE_JOB_DESCRIPTIONS_ERROR = '[Pf-Admin/Job Description Loader] Clear Delete Job Descriptions Error';
export const PF_SUCCESS_FN = '[Pf-Admin/Job Description Loader] PF Success FN';

export class ValidateJobDescriptionImport implements Action {
  readonly type = VALIDATE_JOB_DESCRIPTION_IMPORT;

  constructor(public payload: JobDescriptionValidationRequest) {}
}

export class ValidateJobDescriptionImportSuccess implements Action {
  readonly type = VALIDATE_JOB_DESCRIPTION_IMPORT_SUCCESS;

  constructor(public payload: ValidateStepResultItem) {}
}

export class LoadJobDescriptions implements Action {
  readonly type = LOAD_JOB_DESCRIPTIONS;

  constructor(public payload: LoadJobDescriptionRequest) {}
}

export class LoadJobDescriptionsSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTIONS_SUCCESS;

  constructor(public payload: ValidateStepResultItem) {}
}

export class Reset implements Action {
  readonly type = RESET_LOAD_JOB_DESCRIPTIONS;
}

export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;

  constructor(public payload: number) {}
}

export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;

  constructor(public payload: CompanyDto) {}
}

export class DeleteJobDescriptions implements Action {
  readonly type = DELETE_JOB_DESCRIPTIONS;

  constructor(public payload: JobDescriptionDeleteByTemplateIdData) {}
}

export class DeleteJobDescriptionsSuccess implements Action {
  readonly type = DELETE_JOB_DESCRIPTIONS_SUCCESS;
}

export class DeleteJobDescriptionsError implements Action {
  readonly type = DELETE_JOB_DESCRIPTIONS_ERROR;
}

export class ClearDeleteJobDescriptionsError implements Action {
  readonly type = CLEAR_DELETE_JOB_DESCRIPTIONS_ERROR;
}

export class PfSuccessFN implements Action {
  readonly type = PF_SUCCESS_FN;

  constructor(public payload: any) { }
}

export type Actions
  = DeleteJobDescriptions
  | DeleteJobDescriptionsSuccess
  | DeleteJobDescriptionsError
  | ClearDeleteJobDescriptionsError
  | ValidateJobDescriptionImport
  | ValidateJobDescriptionImportSuccess
  | LoadJobDescriptions
  | LoadJobDescriptionsSuccess
  | Reset
  | LoadCompany
  | LoadCompanySuccess
  | PfSuccessFN;
