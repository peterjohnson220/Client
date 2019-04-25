import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_COMPANY_JOBS  = '[Peer Main/Map/Exchange Company Jobs] Load Exchange Company Jobs';
export const LOAD_EXCHANGE_COMPANY_JOBS_SUCCESS  = '[Peer Main/Map/Exchange Company Jobs] Load Exchange Company Jobs Success';
export const LOAD_EXCHANGE_COMPANY_JOBS_ERROR = '[Peer Main/Map/Exchange Company Jobs] Load Exchange Company Jobs Error';
export const LOAD_EXCHANGE_COMPANY_JOBS_IDS  = '[Peer Main/Map/Exchange Company Jobs] Load Exchange Company Jobs Ids';
export const LOAD_EXCHANGE_COMPANY_JOBS_IDS_SUCCESS  = '[Peer Main/Map/Exchange Company Jobs] Load Exchange Company Jobs Ids Success';
export const LOAD_EXCHANGE_COMPANY_JOBS_IDS_ERROR = '[Peer Main/Map/Exchange Company Jobs] Load Exchange Company Jobs Ids Error';

export class LoadExchangeCompanyJobs implements Action {
  readonly type = LOAD_EXCHANGE_COMPANY_JOBS;
}

export class LoadExchangeCompanyJobsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_COMPANY_JOBS_SUCCESS;

  constructor(public payload: GridDataResult, public exchangeJobIds: number[]) {}
}

export class LoadExchangeCompanyJobsError implements Action {
  readonly type = LOAD_EXCHANGE_COMPANY_JOBS_ERROR;
}

export class LoadExchangeCompanyJobsIds implements Action {
  readonly type = LOAD_EXCHANGE_COMPANY_JOBS_IDS;
}

export class LoadExchangeCompanyJobsIdsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_COMPANY_JOBS_IDS_SUCCESS;

  constructor(public exchangeJobToCompanyJobIds: number[]) {}
}

export class LoadExchangeCompanyJobsIdsError implements Action {
  readonly type = LOAD_EXCHANGE_COMPANY_JOBS_IDS_ERROR;
}

export type Actions
  = LoadExchangeCompanyJobs
  | LoadExchangeCompanyJobsSuccess
  | LoadExchangeCompanyJobsError
  | LoadExchangeCompanyJobsIds
  | LoadExchangeCompanyJobsIdsSuccess
  | LoadExchangeCompanyJobsIdsError;
