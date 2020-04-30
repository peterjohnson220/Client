import { Action } from '@ngrx/store';

import {
  CompanyJob,
  CompanyJobUdf,
  JobInfoResponse,
  CompanyJobAttachment,
  CompanyStructure,
  CompanyStructurePaymarketGrade,
  CompanyStructureInfo
} from 'libs/models';

export const RESET_STATE = '[JobManagement] Reset State';
export const SHOW_JOB_MODAL = '[JobManagement] Show Job Modal';
export const SAVE_COMPANY_JOB = '[JobManagement] Save Company Job';
export const SAVE_COMPANY_JOB_SUCCESS = '[JobManagement] Save Company Job Success';
export const UPLOAD_ATTACHMENTS = '[JobManagement] Upload Attachemnts';
export const UPLOAD_ATTACHMENTS_SUCCESS = '[JobManagement] Upload Attachemnts Success';
export const LOAD_JOB_OPTIONS = '[JobManagement] Load Job Options';
export const LOAD_JOB_OPTIONS_SUCCESS = '[JobManagement] Load Job Options Success';
export const LOAD_STRUCTURE_PAYMARKET_GRADE = '[JobManagement] Load StructurePaymarketGrade';
export const LOAD_STRUCTURE_PAYMARKET_GRADE_SUCCESS = '[JobManagement] Load StructurePaymarketGrade Success';
export const LOAD_JOB = '[JobManagement] Load Job';
export const LOAD_JOB_SUCCESS = '[JobManagement] Load Job Success';
export const SET_SELECTED_STRUCTURE_ID = '[JobManagement] Set Selected StructureId';
export const ADD_STRUCTURE_MAPPING = '[JobManagement] Add Structure Mapping';
export const DELETE_STRUCTURE_MAPPING = '[JobManagement] Delete Structure Mapping';
export const SAVE_STRUCTURE_MAPPINGS = '[JobManagement] Save Structure Mappings';
export const SET_DUPLICATE_JOB_CODE_ERROR = '[JobManagement] Set Duplicate Job Code Error';
export const UPDATE_STANDARD_FIELDS = '[JobManagement] Update Standard Fields';
export const UPDATE_JOB_DESCRIPTION = '[JobManagement] Update Job Description';
export const UPDATE_USER_DEFINED_FIELDS = '[JobManagement] Update User Defined Fields';
export const REMOVE_ATTACHMENT = '[JobManagement] Remove Attachment';
export const HANDLE_API_ERROR = '[JobManagement] Handle API Error';

export class ResetState implements Action {
  readonly type = RESET_STATE;
  constructor() { }
}

export class SaveCompanyJob implements Action {
  readonly type = SAVE_COMPANY_JOB;
  constructor() { }
}

export class SaveCompanyJobSuccess implements Action {
  readonly type = SAVE_COMPANY_JOB_SUCCESS;
  constructor() { }
}

export class UploadAttachments implements Action {
  readonly type = UPLOAD_ATTACHMENTS;
  constructor(public attachments: File[]) { }
}

export class UploadAttachmentsSuccess implements Action {
  readonly type = UPLOAD_ATTACHMENTS_SUCCESS;
  constructor(public uploadedAttachments: CompanyJobAttachment[]) { }
}

export class LoadJobOptions implements Action {
  readonly type = LOAD_JOB_OPTIONS;
}

export class LoadJobOptionsSuccess implements Action {
  readonly type = LOAD_JOB_OPTIONS_SUCCESS;
  constructor(
    public jobFamilies: string[],
    public companyFlsaStatuses: string[],
    public companyJobUdfs: CompanyJobUdf[],
    public structures: CompanyStructure[]) { }
}

export class LoadStructurePaymarketGrade implements Action {
  readonly type = LOAD_STRUCTURE_PAYMARKET_GRADE;
}

export class LoadStructurePaymarketGradeSuccess implements Action {
  readonly type = LOAD_STRUCTURE_PAYMARKET_GRADE_SUCCESS;
  constructor(public structurePaymarketGrade: CompanyStructurePaymarketGrade[]) { }
}

export class LoadJob implements Action {
  readonly type = LOAD_JOB;
  constructor(public jobId: number) { }
}

export class LoadJobSuccess implements Action {
  readonly type = LOAD_JOB_SUCCESS;
  constructor(public payload: JobInfoResponse) { }
}

export class SetSelectedStructureId implements Action {
  readonly type = SET_SELECTED_STRUCTURE_ID;
  constructor(public payload: number) { }
}

export class AddStructureMapping implements Action {
  readonly type = ADD_STRUCTURE_MAPPING;
  constructor(public payload: CompanyStructureInfo) { }
}
export class DeleteStructureMapping implements Action {
  readonly type = DELETE_STRUCTURE_MAPPING;
  constructor(public payload: number) { }
}

export class SaveStructureMappings implements Action {
  readonly type = SAVE_STRUCTURE_MAPPINGS;
  constructor(public jobId: number) { }
}

export class SetDuplicateJobCodeError implements Action {
  readonly type = SET_DUPLICATE_JOB_CODE_ERROR;
  constructor(public payload: boolean) { }
}

export class UpdateStandardFields implements Action {
  readonly type = UPDATE_STANDARD_FIELDS;
  constructor(public payload: CompanyJob) { }
}

export class UpdateJobDescription implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION;
  constructor(public payload: string) { }
}

export class UpdateUserDefinedFields implements Action {
  readonly type = UPDATE_USER_DEFINED_FIELDS;
  constructor(public payload: CompanyJob) { }
}


export class RemoveAttachment implements Action {
  readonly type = REMOVE_ATTACHMENT;
  constructor(public fileName: string) { }
}

export class HandleApiError implements Action {
  readonly type = HANDLE_API_ERROR;
  constructor(public payload: string) { }
}

export type Actions
  = ResetState
  | SaveCompanyJob
  | SaveCompanyJobSuccess
  | UploadAttachments
  | UploadAttachmentsSuccess
  | LoadJobOptions
  | LoadJobOptionsSuccess
  | LoadStructurePaymarketGrade
  | LoadStructurePaymarketGradeSuccess
  | LoadJob
  | LoadJobSuccess
  | SetSelectedStructureId
  | AddStructureMapping
  | DeleteStructureMapping
  | SaveStructureMappings
  | SetDuplicateJobCodeError
  | UpdateStandardFields
  | UpdateJobDescription
  | UpdateUserDefinedFields
  | RemoveAttachment
  | HandleApiError;
