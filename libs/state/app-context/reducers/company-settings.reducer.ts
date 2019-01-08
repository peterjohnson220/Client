import * as companySettingsActions from '../actions/company-settings.actions';

import { CompanySetting } from 'libs/models/company';

export interface State {
  loading: boolean;
  loadingError: boolean;
  loadAttempted: boolean;
  companySettings: CompanySetting[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  loadAttempted: false,
  companySettings: null
};

export function reducer(state = initialState, action: companySettingsActions.Actions): State {
  switch (action.type) {
    case companySettingsActions.LOAD_COMPANY_SETTINGS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        companySettings: null
      };
    }
    case companySettingsActions.LOAD_COMPANY_SETTINGS_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadAttempted: true,
        companySettings: action.payload
      };
    }
    case companySettingsActions.LOAD_COMPANY_SETTINGS_ERROR: {
      return {
        ...state,
        loading: false,
        loadAttempted: true,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanySettingsLoading = (state: State) => state.loading;
export const getCompanySettingsLoadingError = (state: State) => state.loadingError;
export const getCompanySettingsLoadAttempted = (state: State) => state.loadAttempted;
export const getCompanySettings = (state: State) => state.companySettings;
