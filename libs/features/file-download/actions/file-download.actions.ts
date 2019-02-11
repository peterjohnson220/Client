import { Action } from '@ngrx/store';
import { FileModel } from 'libs/models/file';

export const FILE_DOWNLOAD_ERROR = '[File Download] File Download Error';
export const FILE_DOWNLOAD_PROGRESS = '[File Download] File Download Progress';
export const FILE_DOWNLOAD_REMOVE = '[File Download] File Download Remove';
export const FILE_DOWNLOAD_START = '[File Download] File Download Start';
export const FILE_DOWNLOAD_SUCCESS = '[File Download] File Download Success';

export class FileDownloadError implements Action {
  readonly type = FILE_DOWNLOAD_ERROR;

  constructor(public payload: FileModel) {

  }
}

export class FileDownloadProgress implements Action {
  readonly type = FILE_DOWNLOAD_PROGRESS;

  constructor(public payload: FileModel) {

  }
}

export class FileDownloadRemove implements Action {
  readonly type = FILE_DOWNLOAD_REMOVE;

  constructor(public payload: FileModel) {

  }
}

export class FileDownloadStart implements Action {
  readonly type = FILE_DOWNLOAD_START;

  constructor(public payload: FileModel) {

  }
}

export class FileDownloadSuccess implements Action {
  readonly type = FILE_DOWNLOAD_SUCCESS;

  constructor(public payload: FileModel) {

  }
}

export type FileDownloadActions =
  FileDownloadError |
  FileDownloadProgress |
  FileDownloadRemove |
  FileDownloadStart |
  FileDownloadSuccess;
