import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { UpsertExchangeJobMapRequest } from 'libs/models/peer/requests/upsert-exchange-job-map.request.model';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';

// main grid, misc
export const RESET = '[Peer Manage/Company Jobs] Reset';
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

// jdm PDF Download actions
export const LOAD_JDM_DESCRIPTION_IDS = '[Peer Manage/Company Jobs] Load Jdm Description Ids';
export const LOAD_JDM_DESCRIPTION_IDS_COMPLETE = '[Peer Manage/Company Jobs] Load Jdm Description Ids Complete';
export const DOWNLOAD_JDM_DESCRIPTION = '[Peer Job Manage Jobs] Download Jdm Description';
export const DOWNLOAD_JDM_DESCRIPTION_SUCCESS = '[Peer Manage/Company Jobs] Download Jdm Description Success';
export const DOWNLOAD_JDM_DESCRIPTION_ERROR = '[Peer Manage/Company Jobs] Download Jdm Description Error';

// exchange job search
export const SEARCH_EXCHANGE_JOBS = '[Peer Manage/Company Jobs] Search Exchange Jobs';
export const SEARCH_EXCHANGE_JOBS_SUCCESS = '[Peer Manage/Company Jobs] Search Exchange Jobs Success';
export const SEARCH_EXCHANGE_JOBS_ERROR = '[Peer Manage/Company Jobs] Search Exchange Jobs Error';
export const UPDATE_EXCHANGE_JOBS_TITLE_SEARCH_TERM = '[Peer Manage/Company Jobs] Update Exchange Jobs Title Search Term';
export const UPDATE_EXCHANGE_JOBS_DESCRIPTION_SEARCH_TERM = '[Peer Manage/Company Jobs] Update Exchange Jobs Description Search Term';

// exchange job search, create new association
export const CREATE_ASSOCIATION = '[Peer Manage/Company Jobs] Create Association';
export const CREATE_ASSOCIATION_SUCCESS = '[Peer Manage/Company Jobs] Create Association Success';
export const CREATE_ASSOCIATION_ERROR = '[Peer Manage/Company Jobs] Create Association Error';

// exchange job search, approve/reject/unmatch
export const APPROVE_PENDING_MATCH = '[Peer Manage/Company Jobs] Approve Pending Match';
export const APPROVE_PENDING_MATCH_SUCCESS = '[Peer Manage/Company Jobs] Approve Pending Match Success';
export const APPROVE_PENDING_MATCH_ERROR = '[Peer Manage/Company Jobs] Approve Pending Match Error';
export const UNMATCH = '[Peer Manage/Company Jobs] Unmatch';
export const UNMATCH_SUCCESS = '[Peer Manage/Company Jobs] Unmatch Success';
export const UNMATCH_ERROR = '[Peer Manage/Company Jobs] Unmatch Error';
export const CONFIRM_UNMATCH = '[Peer Manage/Company Jobs] Confirm Unmatch';
export const CANCEL_UNMATCH = '[Peer Manage/Company Jobs] Cancel Unmatch';

export class Reset implements Action {
  readonly type = RESET;
}

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

export class UpdateCompanyJobsSearchTerm implements Action {
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

// jdm PDF download
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

// exchange job search
export class SearchExchangeJobs implements Action {
  readonly type = SEARCH_EXCHANGE_JOBS;
}

export class SearchExchangeJobsSuccess implements Action {
  readonly type = SEARCH_EXCHANGE_JOBS_SUCCESS;
  constructor(public payload: ExchangeJob[]) {}
}

export class SearchExchangeJobsError implements Action {
  readonly type = SEARCH_EXCHANGE_JOBS_ERROR;
}

export class UpdateExchangeJobsTitleSearchTerm implements Action {
  readonly type = UPDATE_EXCHANGE_JOBS_TITLE_SEARCH_TERM;
  constructor(public payload: string) {}
}

export class UpdateExchangeJobsDescriptionSearchTerm implements Action {
  readonly type = UPDATE_EXCHANGE_JOBS_DESCRIPTION_SEARCH_TERM;
  constructor(public payload: string) {}
}

export class CreateAssociation implements Action {
  readonly type = CREATE_ASSOCIATION;
  constructor(public payload: UpsertExchangeJobMapRequest) {}
}

export class CreateAssociationSuccess implements Action {
  readonly type = CREATE_ASSOCIATION_SUCCESS;
}

export class CreateAssociationError implements Action {
  readonly type = CREATE_ASSOCIATION_ERROR;
}

export class ApprovePendingMatch implements Action {
  readonly type = APPROVE_PENDING_MATCH;
  constructor(public payload: UpsertExchangeJobMapRequest) {}
}

export class ApprovePendingMatchSuccess implements Action {
  readonly type = APPROVE_PENDING_MATCH_SUCCESS;
}

export class ApprovePendingMatchError implements Action {
  readonly type = APPROVE_PENDING_MATCH_ERROR;
}

export class Unmatch implements Action {
  readonly type = UNMATCH;
  constructor(public payload: UpsertExchangeJobMapRequest) {}
}

export class UnmatchSuccess implements Action {
  readonly type = UNMATCH_SUCCESS;
}

export class UnmatchError implements Action {
  readonly type = UNMATCH_ERROR;
}

export class ConfirmUnmatch implements Action {
  readonly type = CONFIRM_UNMATCH;
}

export class CancelUnmatch implements Action {
  readonly type = CANCEL_UNMATCH;
}

export type Actions =
  // main grid, misc
  | Reset
  | SetExchangeId
  | LoadCompanyJobs
  | LoadCompanyJobsSuccess
  | LoadCompanyJobsError
  | LoadCompanyJobsPagingError
  | UpdateCompanyJobsSearchTerm
  | SetSelectedCompanyJob
  | UpdatePageRowIndexToScrollTo
  // mapped exchange job in detail panel
  | LoadMappedExchangeJobs
  | LoadMappedExchangeJobsSuccess
  | LoadMappedExchangeJobsError
  // jdm PDF download
  | LoadJdmDescriptionIds
  | LoadJdmDescriptionIdsComplete
  | DownloadJdmDescription
  | DownloadJdmDescriptionSuccess
  | DownloadJdmDescriptionError
  // exchange job search
  | SearchExchangeJobs
  | SearchExchangeJobsSuccess
  | SearchExchangeJobsError
  | UpdateExchangeJobsTitleSearchTerm
  | UpdateExchangeJobsDescriptionSearchTerm
  // create match
  | CreateAssociation
  | CreateAssociationSuccess
  | CreateAssociationError
  // approve/deny/unmatch
  | ApprovePendingMatch
  | ApprovePendingMatchSuccess
  | ApprovePendingMatchError
  | Unmatch
  | UnmatchSuccess
  | UnmatchError
  | ConfirmUnmatch
  | CancelUnmatch;
