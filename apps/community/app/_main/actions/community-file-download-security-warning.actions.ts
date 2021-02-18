import { Action } from '@ngrx/store';

export const OPEN_COMMUNITY_FILE_DOWNLOAD_SECURITY_WARNING_MODAL = '[Community/File Download Security] Open Community File Download Security Warning Modal';
export const CLOSE_COMMUNITY_FILE_DOWNLOAD_SECURITY_WARNING_MODAL = '[Community/File Download Security] Close Community File Download Security Warning Modal';

export class OpenCommunityFileDownloadSecurityWarningModal implements Action {
  readonly type = OPEN_COMMUNITY_FILE_DOWNLOAD_SECURITY_WARNING_MODAL;
  constructor(public payload: any) {}
}

export class CloseCommunityFileDownloadSecurityWarningModal implements Action {
  readonly type = CLOSE_COMMUNITY_FILE_DOWNLOAD_SECURITY_WARNING_MODAL;
  constructor() {}
}

export type Actions
  = OpenCommunityFileDownloadSecurityWarningModal
  | CloseCommunityFileDownloadSecurityWarningModal;
