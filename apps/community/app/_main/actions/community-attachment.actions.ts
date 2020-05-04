import { Action } from '@ngrx/store';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';

export const OPEN_COMMUNITY_ATTACHMENTS_MODAL = '[Community/Attachments] Open Community Attachments Modal';
export const CLOSE_COMMUNITY_ATTACHMENTS_MODAL = '[Community/Attachments] Close Community Attachments Modal';
export const SAVE_COMMUNITY_ATTACHMENTS_STATE = '[Community/Attachments] Save Community Attachments State';
export const CLEAR_COMMUNITY_ATTACHMENTS_STATE = '[Community/Attachments] Clear Community Attachments State';

export class OpenCommunityAttachmentsModal implements Action {
  readonly type = OPEN_COMMUNITY_ATTACHMENTS_MODAL;
  constructor() {}
}

export class CloseCommunityAttachmentsModal implements Action {
  readonly type = CLOSE_COMMUNITY_ATTACHMENTS_MODAL;
  constructor() {}
}

export class SaveCommunityAttachmentsState implements Action {
  readonly type = SAVE_COMMUNITY_ATTACHMENTS_STATE;
  constructor(public payload: CommunityAttachment[]) {}
}

export class ClearCommunityAttachmentsState implements Action {
  readonly type = CLEAR_COMMUNITY_ATTACHMENTS_STATE;
  constructor() {}
}

export type Actions
  = OpenCommunityAttachmentsModal
  | CloseCommunityAttachmentsModal
  | SaveCommunityAttachmentsState
  | ClearCommunityAttachmentsState;
