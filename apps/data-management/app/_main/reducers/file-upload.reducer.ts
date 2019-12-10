import * as fromFileUploadActions from '../actions/file-upload.actions';
import {ColumnNameRequestModel} from '../models';

export interface State {
  fileUploadColumnNames: ColumnNameRequestModel ;
  fileUploadColumnNamesError: boolean;
}

export const initialState: State = {
  fileUploadColumnNames: null,
  fileUploadColumnNamesError: false
};

export function reducer(state = initialState, action: fromFileUploadActions.Actions): State {
  switch (action.type) {
    case fromFileUploadActions.GET_COLUMN_NAMES: {
      return {
        ...state,
        fileUploadColumnNames: null,
        fileUploadColumnNamesError: false
      };
    }
    case fromFileUploadActions.GET_COLUMN_NAMES_SUCCESS: {
      return {
        ...state,
        fileUploadColumnNames: action.payload,
        fileUploadColumnNamesError: false
      };
    }
    case fromFileUploadActions.GET_COLUMN_NAMES_ERROR: {
      return {
        ...state,
        fileUploadColumnNames: null,
        fileUploadColumnNamesError: true
      };
    }

    default:
      return state;
  }
}

export const GetColumnNames = (state: State) => state.fileUploadColumnNames;
export const GetColumnNamesError = (state: State) => state.fileUploadColumnNamesError;

