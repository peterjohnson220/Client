import cloneDeep from 'lodash/cloneDeep';

import { TemplateSettings, TemplateSettingsSection, TemplateSettingsControl, SaveError } from 'libs/models';

import * as fromTemplateSettingsActions from '../actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  loadingErrorMessage: string;
  saving: boolean;
  savingError: SaveError;
  templateSettings: TemplateSettings;
}

const initialState: State = {
  loading: false,
  loadingError: false,
  loadingErrorMessage: '',
  saving: false,
  templateSettings: null,
  savingError: null
};

export function reducer(state = initialState, action: fromTemplateSettingsActions.TemplateSettingsAction): State {
  switch (action.type) {
    case fromTemplateSettingsActions.CREATE_SETTINGS:

      const defaultTemplateSettings: TemplateSettings = {
        TemplateId: action.payload.templateId,
        CompanyId: 0,
        Export: {
          Controls: [],
          Sections: []
        }
      };

      return {
          ...state,
        loading: false,
        saving: false,
        templateSettings: defaultTemplateSettings
      };
    case fromTemplateSettingsActions.LOAD_SETTINGS: {
      return {
          ...state,
        loading: true,
        loadingError: false,
      };
    }
    case fromTemplateSettingsActions.LOAD_SETTINGS_SUCCESS: {
      return {
          ...state,
        loading: false,
        loadingError: false,
        templateSettings: action.payload
      };
    }
    case fromTemplateSettingsActions.LOAD_SETTINGS_ERROR: {
      return {
          ...state,
        loading: false,
        loadingError: true,
        loadingErrorMessage: action.payload.errorMessage
      };
    }
    case fromTemplateSettingsActions.SAVE_SETTINGS: {
      return {
          ...state,
        saving: true,
        savingError: null
      };
    }
    case fromTemplateSettingsActions.SAVE_SETTINGS_SUCCESS: {
      const newState = cloneDeep(state);

      newState.saving = false;
      newState.savingError = null;
      newState.templateSettings = action.payload;

      return newState;
    }
    case fromTemplateSettingsActions.SAVE_SETTINGS_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: action.payload.error
      };
    }
    case fromTemplateSettingsActions.UPDATE_SECTION_SETTING: {
      const templateSettingsSection: TemplateSettingsSection = action.payload;
      const newState = cloneDeep(state);
      let index = -1;

      index = newState.templateSettings.Export.Sections.findIndex(section => section.Id === templateSettingsSection.Id);

      if (index > -1) {
        newState.templateSettings.Export.Sections[index] = templateSettingsSection;
      } else {
        newState.templateSettings.Export.Sections.push(templateSettingsSection);
      }

      return newState;
    }
    case fromTemplateSettingsActions.UPDATE_CONTROL_SETTING: {
      const templateSettingsControl: TemplateSettingsControl = action.payload;
      const newState = cloneDeep(state);
      let index = -1;

      index = newState.templateSettings.Export.Controls.findIndex(control => control.Id === templateSettingsControl.Id);

      if (index > -1) {
        newState.templateSettings.Export.Controls[index] = templateSettingsControl;
      } else {
        newState.templateSettings.Export.Controls.push(templateSettingsControl);
      }

      return newState;
    }
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getLoadingErrorMessage = (state: State) => state.loadingErrorMessage;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
export const getTemplateSettings = (state: State) => state.templateSettings;
