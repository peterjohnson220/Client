import * as communityAttachmentActions from '../actions/community-attachment.actions';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';

export interface State {
  currentAttachments: CommunityAttachment[];
  showAttachmentModal: boolean;
}

export const initialState: State = {
  currentAttachments: [],
  showAttachmentModal: false
};

export function reducer(state = initialState, action: communityAttachmentActions.Actions): State {
  switch (action.type) {
    case communityAttachmentActions.OPEN_COMMUNITY_ATTACHMENTS_MODAL: {
      return {
        ...state,
        showAttachmentModal: true
      };
    }
    case communityAttachmentActions.CLOSE_COMMUNITY_ATTACHMENTS_MODAL: {
      return {
        ...state,
        showAttachmentModal: false
      };
    }
    case communityAttachmentActions.SAVE_COMMUNITY_ATTACHMENTS_STATE: {
      return {
        ...state,
        currentAttachments: action.payload
      };
    }
    case communityAttachmentActions.CLEAR_COMMUNITY_ATTACHMENTS_STATE: {
      return {
        ...state,
        currentAttachments: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getShowAttachmentModal = (state: State) => state.showAttachmentModal;
export const getCurrentAttachments = (state: State) => state.currentAttachments;
export const getCurrentAttachmentsCount = (state: State) => state.currentAttachments.length;
