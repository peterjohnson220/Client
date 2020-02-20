import { CompanySetting } from 'libs/models/company';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

import * as fromPasswordSettingActions from '../actions/security-settings.action';

export interface State {
  loading: boolean;
  loadingError: boolean;
  settings: CompanySetting[];
  savingModalOpen: boolean;
  saving: boolean;
  savingError: boolean;
  saveRequest: CompanySettingsSaveRequest;
}

const initialState: State = {
  loading: true,
  loadingError: false,
  settings: [],
  savingModalOpen: false,
  saving: false,
  savingError: false,
  saveRequest: null
};

export function reducer(state = initialState, action: fromPasswordSettingActions.PasswordSettingActions): State {
  switch (action.type) {
    case fromPasswordSettingActions.LOAD_PASSWORD_SETTINGS:
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    case fromPasswordSettingActions.LOAD_PASSWORD_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        settings: action.payload
      };
    case fromPasswordSettingActions.LOAD_PASSWORD_SETTINGS_ERROR:
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    case fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS_PROMPT_OPEN:
      return {
        ...state,
        savingModalOpen: true,
        savingError: false
      };
    case fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS_PROMPT_CLOSE:
      return {
        ...state,
        savingModalOpen: false,
        saveRequest: null
      };
    case fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS:
      return {
        ...state,
        saving: true,
        saveRequest: action.payload
      };
    case fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS_SUCCESS:
      return {
        ...state,
        savingModalOpen: false,
        saving: false,
        saveRequest: null
      };
    case fromPasswordSettingActions.SAVE_PASSWORD_SETTINGS_ERROR:
      return {
        ...state,
        savingError: true,
        saveRequest: null
      };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getPasswordSettings = (state: State) => state.settings;
export const getSaveModalOpen = (state: State) => state.savingModalOpen;
export const getSaveRequest = (state: State) => state.saveRequest;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;

