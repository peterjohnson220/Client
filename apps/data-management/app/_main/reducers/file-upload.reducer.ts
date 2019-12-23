import * as fromFileUploadActions from '../actions/file-upload.actions';
import {ColumnNameRequestModel} from '../models';

export interface State {
  gettingColumnNames: boolean;
  fileUploadColumnNames: ColumnNameRequestModel ;
  fileUploadColumnNamesError: boolean;
}

export const initialState: State = {
  gettingColumnNames: false,
  fileUploadColumnNames: null,
  fileUploadColumnNamesError: false
};

export function reducer(state = initialState, action: fromFileUploadActions.Actions): State {
  switch (action.type) {
    case fromFileUploadActions.GET_COLUMN_NAMES: {
      return {
        ...state,
        gettingColumnNames: true,
        fileUploadColumnNames: null,
        fileUploadColumnNamesError: false
      };
    }
    case fromFileUploadActions.GET_COLUMN_NAMES_SUCCESS: {
      return {
        ...state,
        gettingColumnNames: false,
        fileUploadColumnNames: action.payload,
        fileUploadColumnNamesError: false
      };
    }
    case fromFileUploadActions.GET_COLUMN_NAMES_ERROR: {
      return {
        ...state,
        gettingColumnNames: false,
        fileUploadColumnNames: null,
        fileUploadColumnNamesError: true
      };
    }

    default:
      return state;
  }
}

export const GetGettingColumnNames = (state: State) => state.gettingColumnNames;
export const GetColumnNames = (state: State) => state.fileUploadColumnNames;
export const GetColumnNamesError = (state: State) => state.fileUploadColumnNamesError;

