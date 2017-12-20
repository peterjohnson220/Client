import { Action } from '@ngrx/store';

import { ExchangeJobsValidationResultModel, ImportExchangeJobsRequest, ValidateExchangeJobsRequest } from 'libs/models';

export const UPLOADING_FILE  = '[Peer Admin/Import Exchange Jobs] Uploading File';
export const UPLOADING_FILE_SUCCESS  = '[Peer Admin/Import Exchange Jobs] Uploading File Success';
export const UPLOADING_FILE_ERROR  = '[Peer Admin/Import Exchange Jobs] Uploading File Error';
export const FILE_CLEARED = '[Peer Admin/Import Exchange Jobs] File Cleared';
export const IMPORTING_EXCHANGE_JOBS  = '[Peer Admin/Import Exchange Jobs] Importing Exchange Jobs';
export const IMPORTING_EXCHANGE_JOBS_SUCCESS  = '[Peer Admin/Import Exchange Jobs] Importing Exchange Jobs Success';
export const IMPORTING_EXCHANGE_JOBS_ERROR  = '[Peer Admin/Import Exchange Jobs] Importing Exchange Jobs Error';
export const OPENING_IMPORT_EXCHANGE_JOBS_MODAL  = '[Peer Admin/Import Exchange Jobs] Opening Import Exchange Jobs Modal';
export const CLOSING_IMPORT_EXCHANGE_JOBS_MODAL  = '[Peer Admin/Import Exchange Jobs] Closing Import Exchange Jobs Modal';

export class UploadingFile implements Action {
  readonly type = UPLOADING_FILE;

  constructor(public payload: ValidateExchangeJobsRequest) {}
}

export class UploadingFileSuccess implements Action {
  readonly type = UPLOADING_FILE_SUCCESS;

  constructor(public payload: ExchangeJobsValidationResultModel) {}
}

export class UploadingFileError implements Action {
  readonly type = UPLOADING_FILE_ERROR;
}

export class FileCleared implements Action {
  readonly type = FILE_CLEARED;
}

export class ImportingExchangeJobs implements Action {
  readonly type = IMPORTING_EXCHANGE_JOBS;

  constructor(public payload: ImportExchangeJobsRequest) {}
}

export class ImportingExchangeJobsSuccess implements Action {
  readonly type = IMPORTING_EXCHANGE_JOBS_SUCCESS;

  constructor(public payload: ExchangeJobsValidationResultModel) {}
}

export class ImportingExchangeJobsError implements Action {
  readonly type = IMPORTING_EXCHANGE_JOBS_ERROR;
}

export class OpeningImportExchangeJobsModal implements Action {
  readonly type = OPENING_IMPORT_EXCHANGE_JOBS_MODAL;
}

export class ClosingImportExchangeJobsModal implements Action {
  readonly type = CLOSING_IMPORT_EXCHANGE_JOBS_MODAL;
}

export type Actions
  = UploadingFile
  | UploadingFileSuccess
  | UploadingFileError
  | FileCleared
  | ImportingExchangeJobs
  | ImportingExchangeJobsSuccess
  | ImportingExchangeJobsError
  | OpeningImportExchangeJobsModal
  | ClosingImportExchangeJobsModal;



