import * as communityFileDownloadSecurityWarningActions from '../actions/community-file-download-security-warning.actions';

export interface State {
  isModalOpen: boolean;
  downloadId: string;
  downloadType: string;
}

export const initialState: State = {
  isModalOpen: false,
  downloadId: null,
  downloadType: null
};

export function reducer(state = initialState, action: communityFileDownloadSecurityWarningActions.Actions): State {
  switch (action.type) {
    case communityFileDownloadSecurityWarningActions.OPEN_COMMUNITY_FILE_DOWNLOAD_SECURITY_WARNING_MODAL: {
      return {
        ...state,
        isModalOpen: true,
        downloadId: action.payload.downloadId,
        downloadType: action.payload.downloadType
      };
    }
    case communityFileDownloadSecurityWarningActions.CLOSE_COMMUNITY_FILE_DOWNLOAD_SECURITY_WARNING_MODAL: {
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

export const getCurrentWarningModalOpen = (state: State) => !state ? false : state.isModalOpen;
export const getCurrentDownloadId = (state: State) => !state ? null : state.downloadId;
export const getCurrentDownloadType = (state: State) => !state ? null : state.downloadType;
