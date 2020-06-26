import * as communityAttachmentWarningActions from '../actions/community-attachment-warning.actions';

export interface State {
  isModalOpen: boolean;
  attachmentDownloadUrl: string;
}

export const initialState: State = {
  isModalOpen: false,
  attachmentDownloadUrl: null
};

export function reducer(state = initialState, action: communityAttachmentWarningActions.Actions): State {
  switch (action.type) {
    case communityAttachmentWarningActions.OPEN_COMMUNITY_ATTACHMENTS_WARNING_MODAL: {
      return {
        ...state,
        isModalOpen: true,
        attachmentDownloadUrl: action.payload
      };
    }
    case communityAttachmentWarningActions.CLOSE_COMMUNITY_ATTACHMENTS_WARNING_MODAL: {
      return {
        ...state,
        isModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getCurrentAttachmentWarningModalOpen = (state: State) => !state ? false : state.isModalOpen;
export const getCurrentAttachmentDownloadUrl = (state: State) => !state ? null : state.attachmentDownloadUrl;
