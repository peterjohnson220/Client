import { Action } from '@ngrx/store';

import { AutoAssociateExchangeJobsRequest } from 'libs/models/peer/requests/auto-associate-exchange-jobs-request.model';

export const ASSOCIATE_JOBS = '[Peer Admin/Exchange Job Association Import/Associate Jobs] Associate Jobs';
export const ASSOCIATE_JOBS_SUCCESS = '[Peer Admin/Exchange Job Association Import/Associate Jobs] Associate Jobs Success';
export const ASSOCIATE_JOBS_ERROR = '[Peer Admin/Exchange Job Association Import/Associate Jobs] Associate Jobs Error';
export const DOWNLOAD_ASSOCIATIONS = '[Peer Admin/Exchange Job Association Import/Associate Jobs] Download Associations';
export const DOWNLOAD_ASSOCIATIONS_SUCCESS = '[Peer Admin/Exchange Job Association Import/Associate Jobs] Download Associations Success';
export const DOWNLOAD_ASSOCIATIONS_ERROR = '[Peer Admin/Exchange Job Association Import/Associate Jobs] Download Associations Failure';

export class AssociateJobs implements Action {
  readonly type = ASSOCIATE_JOBS;

  constructor(public payload: AutoAssociateExchangeJobsRequest) { }
}

export class AssociateJobsSuccess implements Action {
  readonly type = ASSOCIATE_JOBS_SUCCESS;

  constructor(public payload: number) { }
}

export class AssociateJobsError implements Action {
  readonly type = ASSOCIATE_JOBS_ERROR;
}

export class DownloadAssociations implements Action {
  readonly type = DOWNLOAD_ASSOCIATIONS;
  constructor(public payload: {entityId: number, entityType: string}) {}
}

export class DownloadAssociationsError implements Action {
  readonly type = DOWNLOAD_ASSOCIATIONS_ERROR;
}

export class DownloadAssociationsSuccess implements Action {
  readonly type = DOWNLOAD_ASSOCIATIONS_SUCCESS;
}

export type Actions
  = AssociateJobs
  | AssociateJobsSuccess
  | AssociateJobsError
  | DownloadAssociations
  | DownloadAssociationsSuccess
  | DownloadAssociationsError;
