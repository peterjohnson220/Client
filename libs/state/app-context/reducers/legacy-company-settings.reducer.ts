import * as legacyCompanySettingsActions from '../actions/legacy-company-settings.actions';

import { LegacyCompanySettingDto } from '../../../models/company';

export interface State {
  gettingCompanySettings: boolean;
  gettingCompanySettingsError: boolean;
  gettingCompanySettingsAttempted: boolean;
  companySettings: LegacyCompanySettingDto[];
}

export const initialState: State = {
  gettingCompanySettings: false,
  gettingCompanySettingsError: false,
  gettingCompanySettingsAttempted: false,
  companySettings: null
};

export function reducer(state = initialState, action: legacyCompanySettingsActions.Actions): State {
  switch (action.type) {
    case legacyCompanySettingsActions.GET_COMPANY_SETTINGS: {
      return {
        ...state,
        gettingCompanySettings: true,
        gettingCompanySettingsError: false,
        companySettings: null
      };
    }
    case legacyCompanySettingsActions.GET_COMPANY_SETTINGS_SUCCESS: {
      return {
        ...state,
        gettingCompanySettings: false,
        gettingCompanySettingsAttempted: true,
        companySettings: action.payload
      };
    }
    case legacyCompanySettingsActions.GET_COMPANY_SETTINGS_ERROR: {
      return {
        ...state,
        gettingCompanySettings: false,
        gettingCompanySettingsAttempted: true,
        gettingCompanySettingsError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingCompanySettings = (state: State) => state.gettingCompanySettings;
export const getGettingCompanySettingsError = (state: State) => state.gettingCompanySettingsError;
export const getGettingCompanySettingsAttempted = (state: State) => state.gettingCompanySettingsAttempted;
export const getCompanySettings = (state: State) => state.companySettings;
