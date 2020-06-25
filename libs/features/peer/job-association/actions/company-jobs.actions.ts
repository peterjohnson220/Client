import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompanyJob, CompanyJobWithMatches } from '../models';

export const LOAD = '[Peer Job Association/Company Jobs] Load';
export const LOAD_COMPANY_JOBS  = '[Peer Job Association/Company Jobs] Load Company Jobs';
export const LOAD_COMPANY_JOBS_ERROR  = '[Peer Job Association/Company Jobs] Load Company Jobs Error';
export const LOAD_COMPANY_JOBS_BAD_REQUEST = '[Peer Job Association/Company Jobs] Load Company Jobs Bad Request';
export const LOAD_COMPANY_JOBS_SUCCESS  = '[Peer Job Association/Company Jobs] Load Company Jobs Success';
export const RESET = '[Peer Job Association/Company Jobs] Reset';
export const SELECT_COMPANY_JOB_FOR_DETAIL_PANEL = '[Peer Job Association/Company Jobs] Select Company Job For Detail Panel';
export const SELECT_COMPANY_JOBS_TO_ASSOCIATE = '[Peer Job Association/Company Jobs] Select Company Jobs to Associate';
export const TOGGLE_DETAIL_PANEL = '[Peer Job Association/Company Jobs] Toggle Detail Panel';
export const CLOSE_DETAIL_PANEL = '[Peer Job Association/Company Jobs] Close Detail Panel';
export const UPDATE_COMPANY_JOB_ID_FILTERS = '[Peer Job Association/Company Jobs] Update Company Job ID Filters';
export const UPDATE_SEARCH_TERM = '[Peer Job Association/Company Jobs] Update Search Term';

// Jdm PDF Download actions
export const LOAD_JDM_DESCRIPTION_IDS = '[Peer Job Association/Company Jobs] Load Jdm Description Ids';
export const LOAD_JDM_DESCRIPTION_IDS_COMPLETE = '[Peer Job Association/Company Jobs] Load Jdm Description Ids Complete';
export const DOWNLOAD_JDM_DESCRIPTION = '[Peer Job Association/Company Jobs] Download Jdm Description';
export const DOWNLOAD_JDM_DESCRIPTION_SUCCESS = '[Peer Job Association/Company Jobs] Download Jdm Description Success';
export const DOWNLOAD_JDM_DESCRIPTION_ERROR = '[Peer Job Association/Company Jobs] Download Jdm Description Error';

export class Load implements Action {
  readonly type = LOAD;
}

export class LoadCompanyJobs implements Action {
  readonly type = LOAD_COMPANY_JOBS;
}

export class LoadCompanyJobsSuccess implements Action {
  readonly type = LOAD_COMPANY_JOBS_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class LoadCompanyJobsError implements Action {
  readonly type = LOAD_COMPANY_JOBS_ERROR;
  constructor(public payload: any) {}
}

export class LoadCompanyJobsBadRequest implements Action {
  readonly type = LOAD_COMPANY_JOBS_BAD_REQUEST;
  constructor(public payload: string) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export class SelectJobTitleOrCode implements Action {
  readonly type = SELECT_COMPANY_JOB_FOR_DETAIL_PANEL;
  constructor(public payload: CompanyJob) {}
}

export class SelectCompanyJobsToAssociate implements Action {
  readonly type = SELECT_COMPANY_JOBS_TO_ASSOCIATE;
  constructor(public payload: CompanyJobWithMatches[]) {}
}

export class  UpdateCompanyJobIdFilters implements Action {
  readonly type = UPDATE_COMPANY_JOB_ID_FILTERS;
  constructor(public payload: number[]) {}
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;
  constructor(public payload: string) {}
}

export class ToggleDetailPanel implements Action {
  readonly type = TOGGLE_DETAIL_PANEL;
}

export class CloseDetailPanel implements Action {
  readonly type = CLOSE_DETAIL_PANEL;
}

export class LoadJdmDescriptionIds implements Action {
  readonly type = LOAD_JDM_DESCRIPTION_IDS;
}

export class LoadJdmDescriptionIdsComplete implements Action {
  readonly type = LOAD_JDM_DESCRIPTION_IDS_COMPLETE;
  constructor(public payload: number[]) {}
}

export class DownloadJdmDescription implements Action {
  readonly type = DOWNLOAD_JDM_DESCRIPTION;
}

export class DownloadJdmDescriptionSuccess implements Action {
  readonly type = DOWNLOAD_JDM_DESCRIPTION_SUCCESS;
}

export class DownloadJdmDescriptionError implements Action {
  readonly type = DOWNLOAD_JDM_DESCRIPTION_ERROR;
}

export type Actions =
  | Load
  | LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | LoadCompanyJobsBadRequest
  | Reset
  | SelectJobTitleOrCode
  | SelectCompanyJobsToAssociate
  | UpdateCompanyJobIdFilters
  | UpdateSearchTerm
  | ToggleDetailPanel
  | CloseDetailPanel
  | LoadJdmDescriptionIds
  | LoadJdmDescriptionIdsComplete
  | DownloadJdmDescription
  | DownloadJdmDescriptionSuccess
  | DownloadJdmDescriptionError;
