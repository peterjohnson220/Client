import { Action } from '@ngrx/store';
import { CommunityAttachmentModalState } from 'libs/models';

export const OPEN_COMMUNITY_ATTACHMENTS_MODAL = '[Community/Attachments] Open Community Attachments Modal';
export const CLOSE_COMMUNITY_ATTACHMENTS_MODAL = '[Community/Attachments] Close Community Attachments Modal';
export const SAVE_COMMUNITY_ATTACHMENTS_STATE = '[Community/Attachments] Save Community Attachments State';
export const CLEAR_COMMUNITY_ATTACHMENTS_STATE = '[Community/Attachments] Clear Community Attachments State';
export const ATTACHMENT_SCAN_SUCCESS = '[Community/Attachments] Attachment Scan Sucess';
export const ATTACHMENT_SCAN_FAILURE = '[Community/Attachments] Attachment Scan Failure';

export class OpenCommunityAttachmentsModal implements Action {
  readonly type = OPEN_COMMUNITY_ATTACHMENTS_MODAL;
  constructor(public payload: string) {}
}

export class CloseCommunityAttachmentsModal implements Action {
  readonly type = CLOSE_COMMUNITY_ATTACHMENTS_MODAL;
  constructor(public payload: string) {}
}

export class SaveCommunityAttachmentsState implements Action {
  readonly type = SAVE_COMMUNITY_ATTACHMENTS_STATE;
  constructor(public payload: CommunityAttachmentModalState) {}
}

export class ClearCommunityAttachmentsState implements Action {
  readonly type = CLEAR_COMMUNITY_ATTACHMENTS_STATE;
  constructor(public payload: string) {}
}

export class AttachmentScanSuccess implements Action {
  readonly type = ATTACHMENT_SCAN_SUCCESS;
  constructor(public attachmentModalId: string, public attachmentId: string) {}
}

export class AttachmentScanFailure implements Action {
  readonly type = ATTACHMENT_SCAN_FAILURE;
  constructor(public attachmentModalId: string, public attachmentId: string) {}
}

export type Actions
  = OpenCommunityAttachmentsModal
  | CloseCommunityAttachmentsModal
  | SaveCommunityAttachmentsState
  | ClearCommunityAttachmentsState
  | AttachmentScanSuccess
  | AttachmentScanFailure;
