import * as fromUploadOrgDataActions from '../actions/upload-org-data.actions';

export interface State {
  uploadingFile: boolean;
  uploadingFileSuccess: boolean;
  uploadingFileError: boolean;
  uploadOrgDataModalOpen: boolean;
}

const initialState: State = {
  uploadingFile: false,
  uploadingFileSuccess: false,
  uploadingFileError: false,
  uploadOrgDataModalOpen: false
};

export function reducer(
  state = initialState,
  action: fromUploadOrgDataActions.Actions
): State {
  switch (action.type) {
    case fromUploadOrgDataActions.UPLOAD_FILE: {
      return {
        ...state,
        uploadingFile: true
      };
    }
    case fromUploadOrgDataActions.UPLOAD_FILE_SUCCESS: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileSuccess: true,
        uploadingFileError: false
      };
    }
    case fromUploadOrgDataActions.UPLOAD_FILE_ERROR: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileSuccess: false,
        uploadingFileError: true
      };
    }
    case fromUploadOrgDataActions.OPEN_UPLOAD_ORG_DATA_MODAL: {
      return {
        ...state,
        uploadOrgDataModalOpen: true
      };
    }
    case fromUploadOrgDataActions.CLOSE_UPLOAD_ORG_DATA_MODAL: {
      return {
        ...state,
        uploadOrgDataModalOpen: false,
        uploadingFileSuccess: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getUploadingFile = (state: State) => state.uploadingFile;
export const getUploadingFileSuccess = (state: State) => state.uploadingFileSuccess;
export const getUploadingFileError = (state: State) => state.uploadingFileError;
export const getUploadOrgDataModalOpen = (state: State) => state.uploadOrgDataModalOpen;
