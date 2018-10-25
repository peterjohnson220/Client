import * as fromOrgDataFieldMappingsActions from '../actions/org-data-field-mappings.actions';

export interface State {
  savingFieldMappings: boolean;
  savingFieldMappingsError: boolean;
  savingFieldMappingsSuccess: boolean;
}

const initialState: State = {
  savingFieldMappings: false,
  savingFieldMappingsError: false,
  savingFieldMappingsSuccess: false
};

export function reducer( state = initialState, action: fromOrgDataFieldMappingsActions.Actions): State {
  switch (action.type) {
    case fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS: {
      return {
        ...state,
        savingFieldMappings: true
      };
    }
    case fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS_ERROR: {
      return {
        ...state,
        savingFieldMappings: false,
        savingFieldMappingsError: true,
        savingFieldMappingsSuccess: false
      };
    }
    case fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS_SUCCESS: {
      return {
        ...state,
        savingFieldMappings: false,
        savingFieldMappingsSuccess: true,
        savingFieldMappingsError: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getSavingFieldMappings = (state: State) => state.savingFieldMappings;
export const getSavingFieldMappingsError = (state: State) => state.savingFieldMappingsError;
export const getSavingFieldMappingsSuccess = (state: State) => state.savingFieldMappingsSuccess;
