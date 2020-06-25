import * as fromAssociateBulkImportActions from '../../actions/exchange-job-association-utility/associate-bulk-import.actions';

export interface State {
  importing: boolean;
  importingError: boolean;
  importingSuccess: boolean;
  validationErrors: any[];
}

// Initial State
export const initialState: State = {
  importing: false,
  importingError: false,
  importingSuccess: false,
  validationErrors: []
};

// Reducer
export function reducer(
  state = initialState,
  action: fromAssociateBulkImportActions.Actions
): State {

  switch (action.type) {
    case fromAssociateBulkImportActions.IMPORT_BULK_ASSOCIATE_JOBS: {
      return {
        ...state,
        importing: true,
        importingSuccess: false,
        importingError: false
      };
    }

    case fromAssociateBulkImportActions.IMPORT_BULK_ASSOCIATE_JOBS_SUCCESS: {
      if (action.payload.Success) {
        return {
          ...state,
          importing: false,
          importingSuccess: true
        };
      }

      return {
        ...state,
        importing: false,
        importingSuccess: false,
        validationErrors: action.payload.Errors
      };
    }

    case fromAssociateBulkImportActions.IMPORT_BULK_ASSOCIATE_JOBS_ERROR: {
      return {
        ...state,
        importing: false,
        importingError: true
      };
    }

    case fromAssociateBulkImportActions.RESET_IMPORT_BULK_JOBS: {
      return {
        ...state,
        importing: false,
        importingSuccess: false,
        importingError: false,
        validationErrors: []
      }
    }
    default: {
      return state;
    }
  }
}

export const getImporting = (state: State) => state.importing;
export const getValidationErrors = (state: State) => state.validationErrors;
export const getImportingError = (state: State) => state.importingError;
export const getImportingSuccess = (state: State) => state.importingSuccess;
