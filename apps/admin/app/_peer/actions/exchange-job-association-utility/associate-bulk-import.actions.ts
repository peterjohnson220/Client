import { Action } from '@ngrx/store';

export const IMPORT_BULK_ASSOCIATE_JOBS = '[Peer Admin/Exchange Job Association Import/ Bulk Import] Import Bulk Associate Jobs';
export const IMPORT_BULK_ASSOCIATE_JOBS_SUCCESS = '[Peer Admin/Exchange Job Association Import/ Bulk Import] Import Bulk Associate Jobs Success';
export const IMPORT_BULK_ASSOCIATE_JOBS_ERROR = '[Peer Admin/Exchange Job Association Import/ Bulk Import] Import Bulk Associate Jobs Error';
export const RESET_IMPORT_BULK_JOBS = '[Peer Admin/ Exchange Job Association Import / Bulk Import] Reset Import Bulk Associate Jobs';

export class ImportBulkAssociateJobs implements Action {
  readonly type = IMPORT_BULK_ASSOCIATE_JOBS;

  constructor(public payload: string) {}
}

export class ImportBulkAssociateJobsSuccess implements Action {
  readonly type = IMPORT_BULK_ASSOCIATE_JOBS_SUCCESS;

  constructor(public payload: any) {}
}

export class ImportBulkAssociateJobsError implements Action {
  readonly type = IMPORT_BULK_ASSOCIATE_JOBS_ERROR;
}

export class ResetImportBulkAssociateJobs implements Action {
  readonly type = RESET_IMPORT_BULK_JOBS;
}

export type Actions
  = ImportBulkAssociateJobs
  | ImportBulkAssociateJobsSuccess
  | ImportBulkAssociateJobsError
  | ResetImportBulkAssociateJobs;
