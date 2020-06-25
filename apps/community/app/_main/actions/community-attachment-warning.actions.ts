import { Action } from '@ngrx/store';

export const OPEN_COMMUNITY_ATTACHMENTS_WARNING_MODAL = '[Community/Attachments] Open Community Attachments Warning Modal';
export const CLOSE_COMMUNITY_ATTACHMENTS_WARNING_MODAL = '[Community/Attachments] Close Community Attachments Warning Modal';

export class OpenCommunityAttachmentsWarningModal implements Action {
  readonly type = OPEN_COMMUNITY_ATTACHMENTS_WARNING_MODAL;
  constructor(public payload: string) {}
}

export class CloseCommunityAttachmentsWarningModal implements Action {
  readonly type = CLOSE_COMMUNITY_ATTACHMENTS_WARNING_MODAL;
  constructor() {}
}

export type Actions
  = OpenCommunityAttachmentsWarningModal
  | CloseCommunityAttachmentsWarningModal;
