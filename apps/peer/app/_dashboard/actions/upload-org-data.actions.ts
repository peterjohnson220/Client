import { Action } from '@ngrx/store';

export const UPLOAD_FILE = '[Peer Dashboard/Upload Org Data] Upload File';
export const UPLOAD_FILE_SUCCESS = '[Peer Dashboard/Upload Org Data] Upload File Success';
export const UPLOAD_FILE_ERROR = '[Peer Dashboard/Upload Org Data] Upload File Error';
export const OPEN_UPLOAD_ORG_DATA_MODAL = '[Peer Dashboard/Upload Org Data] Open Upload Org Data Modal';
export const CLOSE_UPLOAD_ORG_DATA_MODAL = '[Peer Dashboard/Upload Org Data] Close Upload Org Data Modal';

export class UploadFile implements Action {
  readonly type = UPLOAD_FILE;

  constructor(public payload: any) {}
}

export class UploadFileSuccess implements Action {
  readonly type = UPLOAD_FILE_SUCCESS;
}

export class UploadFileError implements Action {
  readonly type = UPLOAD_FILE_ERROR;
}

export class OpenUploadOrgDataModal implements Action {
  readonly type = OPEN_UPLOAD_ORG_DATA_MODAL;
}

export class CloseUploadOrgDataModal implements Action {
  readonly type = CLOSE_UPLOAD_ORG_DATA_MODAL;
}

export type Actions
  = UploadFile
  | UploadFileSuccess
  | UploadFileError
  | OpenUploadOrgDataModal
  | CloseUploadOrgDataModal;

