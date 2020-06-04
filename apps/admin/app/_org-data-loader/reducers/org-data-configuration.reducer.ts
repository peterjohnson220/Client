import * as fromOrgDataConfigurationActions from '../actions/org-data-loader-configuration.actions';

export interface State {
  saving: boolean;
  savingError: boolean;
  savingSuccess: boolean;
}

const initialState: State = {
  saving: false,
  savingSuccess: false,
  savingError: false
};

export function reducer(state = initialState, action: fromOrgDataConfigurationActions.Actions): State {
  switch (action.type) {
    case fromOrgDataConfigurationActions.SAVE_CONFIGURATION: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false
      };
    }
    case fromOrgDataConfigurationActions.SAVE_CONFIGURATION_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true
      };
    }
    case fromOrgDataConfigurationActions.SAVE_CONFIGURATION_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getSavingConfiguration = (state: State) => state.saving;
export const getSavingConfigurationSuccess = (state: State) => state.savingSuccess;
export const getSavingConfigurationError = (state: State) => state.savingError;
