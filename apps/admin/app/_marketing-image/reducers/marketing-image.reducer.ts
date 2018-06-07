import * as fromMarketingImageActions from '../actions/marketing-image.actions';

export interface State {
  uploadingFile: boolean;
  uploadingFileError: boolean;
  uploadingFileSuccess: boolean;
  imageFile: any;
  hasImageFile: boolean;
}

export const initialState: State = {
  uploadingFile: false,
  uploadingFileError: false,
  uploadingFileSuccess: false,
  imageFile: null,
  hasImageFile: false
};

export function reducer(state = initialState, action: fromMarketingImageActions.Actions): State {
  switch (action.type) {
    case fromMarketingImageActions.SAVING_MARKETING_IMAGE: {
      return {
        ...state,
        uploadingFile: true
      };
    }
    case fromMarketingImageActions.SAVING_MARKETING_IMAGE_SUCCESS: {
      return {
        ...state,
        uploadingFile: false,
        hasImageFile: true
       // imageFile: action.payload,
       // hasImageFile: action.payload != null
      };
    }
    case fromMarketingImageActions.SAVING_MARKETING_IMAGE_ERROR: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getSavingFile = (state: State) => state.uploadingFile;
export const getSavingFileError = (state: State) => state.uploadingFileError;
export const getSavingFileSuccess = (state: State) => state.uploadingFileSuccess;

export const getImageFile = (state: State) => state.imageFile;
export const hasImageFile = (state: State) => state.hasImageFile;

