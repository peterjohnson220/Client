import * as uiPersistenceSettingsActions from '../actions/ui-persistence-settings.actions';
import { UiPersistenceFeatureSettingsModel } from '../../../models/common/ui-persistence-feature-settings.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  lastAttemptedSavedSettingName: string;
  uiPersistenceSettings: UiPersistenceFeatureSettingsModel[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  lastAttemptedSavedSettingName: null,
  uiPersistenceSettings: null
};

export function reducer(state = initialState, action: uiPersistenceSettingsActions.Actions): State {
  switch (action.type) {
    case uiPersistenceSettingsActions.GET_UI_PERSISTENCE_SETTINGS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        uiPersistenceSettings: null
      };
    }
    case uiPersistenceSettingsActions.GET_UI_PERSISTENCE_SETTINGS_SUCCESS: {
      return {
        ...state,
        loading: false,
        uiPersistenceSettings: action.payload
      };
    }
    case uiPersistenceSettingsActions.GET_UI_PERSISTENCE_SETTINGS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case uiPersistenceSettingsActions.SAVE_UI_PERSISTENCE_SETTING: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false,
        lastAttemptedSavedSettingName: action.payload.SettingName
      };
    }
    case uiPersistenceSettingsActions.SAVE_UI_PERSISTENCE_SETTING_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true,
        savingError: false,
        uiPersistenceSettings: action.payload
      };
    }
    case uiPersistenceSettingsActions.SAVE_UI_PERSISTENCE_SETTING_ERROR: {
      return {
        ...state,
        saving: false,
        savingSuccess: false,
        savingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getUiPersistenceSettings = (state: State) => state.uiPersistenceSettings;
export const getSaving = (state: State) => state.saving;
export const getSavingSuccess = (state: State) => state.savingSuccess;
export const getSavingError = (state: State) => state.savingError;
export const getLastAttemptedSaveSettingName = (state: State) => state.lastAttemptedSavedSettingName;
