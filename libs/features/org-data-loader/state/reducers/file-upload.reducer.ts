import * as fromFileUploadActions from '../actions';
import {ColumnNameRequestModel} from '../../models';

export interface State {
  gettingColumnNames: boolean;
  fileUploadColumnNames: ColumnNameRequestModel[];
  fileUploadColumnNamesError: boolean;
}

export const initialState: State = {
  gettingColumnNames: false,
  fileUploadColumnNames: null,
  fileUploadColumnNamesError: false
};

function addToFileUploadColumnNames(payload: ColumnNameRequestModel, state: State) {
  let fileUploadColumnNames = [];
  if (state.fileUploadColumnNames !== null) {
    fileUploadColumnNames = state.fileUploadColumnNames.filter(item => item.entity !== payload.entity);
  }
  fileUploadColumnNames.push(payload);
  return fileUploadColumnNames;
}

export function reducer(state = initialState, action: fromFileUploadActions.Actions): State {
  switch (action.type) {
    case fromFileUploadActions.GET_COLUMN_NAMES: {
      return {
        ...state,
        gettingColumnNames: true,
        fileUploadColumnNamesError: false
      };
    }
    case fromFileUploadActions.GET_COLUMN_NAMES_SUCCESS: {
      return {
        ...state,
        gettingColumnNames: false,
        fileUploadColumnNames: addToFileUploadColumnNames(action.payload, state),
        fileUploadColumnNamesError: false
      };
    }
    case fromFileUploadActions.GET_COLUMN_NAMES_ERROR: {
      return {
        ...state,
        gettingColumnNames: false,
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

