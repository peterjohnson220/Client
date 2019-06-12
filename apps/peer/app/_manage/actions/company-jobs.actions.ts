import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { CompanyJob } from 'libs/models/company';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

export const SET_EXCHANGE_ID = '[Peer Manage/Company Jobs] Set Exchange Id';
export const LOAD_COMPANY_JOBS = '[Peer Manage/Company Jobs] Load Company Jobs';
export const LOAD_COMPANY_JOBS_SUCCESS = '[Peer Manage/Company Jobs] Load Company Jobs Success';
export const LOAD_COMPANY_JOBS_ERROR = '[Peer Manage/Company Jobs] Load Company Jobs Error';
export const LOAD_COMPANY_JOBS_PAGING_ERROR = '[Peer Manage/Company Jobs] Load Company Jobs Paging Error';
export const UPDATE_COMPANY_JOBS_SEARCH_TERM = '[Peer Manage/Company Jobs] Update Company Jobs Search Term';
export const SET_SELECTED_COMPANY_JOB = '[Peer Manage/Company Jobs] Set Selected Company Job';
export const UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO = '[Peer Manage/Company Jobs] Update Page Row Index To Scroll To';

// exchange job mapped to selected company job
export const LOAD_MAPPED_EXCHANGE_JOBS = '[Peer Manage/Company Jobs] Load Mapped Exchange Jobs';
export const LOAD_MAPPED_EXCHANGE_JOBS_SUCCESS = '[Peer Manage/Company Jobs] Load Mapped Exchange Jobs Success';
export const LOAD_MAPPED_EXCHANGE_JOBS_ERROR = '[Peer Manage/Company Jobs] Load Mapped Exchange Jobs Error';

// Jdm PDF Download actions
export const LOAD_JDM_DESCRIPTION_IDS = '[Peer Manage/Company Jobs] Load Jdm Description Ids';
export const LOAD_JDM_DESCRIPTION_IDS_COMPLETE = '[Peer Manage/Company Jobs] Load Jdm Description Ids Complete';
export const DOWNLOAD_JDM_DESCRIPTION = '[Peer Job Manage Jobs] Download Jdm Description';
export const DOWNLOAD_JDM_DESCRIPTION_SUCCESS = '[Peer Manage/Company Jobs] Download Jdm Description Success';
export const DOWNLOAD_JDM_DESCRIPTION_ERROR = '[Peer Manage/Company Jobs] Download Jdm Description Error';

export class SetExchangeId implements Action {
  readonly type = SET_EXCHANGE_ID;
  constructor(public payload: number) {}
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
}

export class LoadCompanyJobsPagingError implements Action {
  readonly type = LOAD_COMPANY_JOBS_PAGING_ERROR;
  constructor(public payload: string) {}
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_COMPANY_JOBS_SEARCH_TERM;
  constructor(public payload: string) {}
}

export class SetSelectedCompanyJob implements Action {
  readonly type = SET_SELECTED_COMPANY_JOB;
  constructor(public payload: CompanyJob) {}
}

export class UpdatePageRowIndexToScrollTo implements Action {
  readonly type = UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO;
  constructor(public payload: number) {}
}

export class LoadMappedExchangeJobs implements Action {
  readonly type = LOAD_MAPPED_EXCHANGE_JOBS;
  constructor(public payload: number) {}
}

export class LoadMappedExchangeJobsSuccess implements Action {
  readonly type = LOAD_MAPPED_EXCHANGE_JOBS_SUCCESS;
  constructor(public payload: ExchangeJob[]) {}
}

export class LoadMappedExchangeJobsError implements Action {
  readonly type = LOAD_MAPPED_EXCHANGE_JOBS_ERROR;
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
  | SetExchangeId
  | LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | LoadCompanyJobsPagingError
  | UpdateSearchTerm
  | SetSelectedCompanyJob
  | UpdatePageRowIndexToScrollTo
  | LoadMappedExchangeJobs
  | LoadMappedExchangeJobsSuccess
  | LoadMappedExchangeJobsError
  | LoadJdmDescriptionIds
  | LoadJdmDescriptionIdsComplete
  | DownloadJdmDescription
  | DownloadJdmDescriptionSuccess
  | DownloadJdmDescriptionError;
