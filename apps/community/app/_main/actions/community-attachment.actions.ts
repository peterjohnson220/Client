import { Action } from '@ngrx/store';
import { CommunityAttachmentModalState } from 'libs/models';

export const OPEN_COMMUNITY_ATTACHMENTS_MODAL = '[Community/Attachments] Open Community Attachments Modal';
export const CLOSE_COMMUNITY_ATTACHMENTS_MODAL = '[Community/Attachments] Close Community Attachments Modal';
export const SAVE_COMMUNITY_ATTACHMENTS_STATE = '[Community/Attachments] Save Community Attachments State';
export const CLEAR_COMMUNITY_ATTACHMENTS_STATE = '[Community/Attachments] Clear Community Attachments State';

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

export type Actions
  = OpenCommunityAttachmentsModal
  | CloseCommunityAttachmentsModal
  | SaveCommunityAttachmentsState
  | ClearCommunityAttachmentsState;
