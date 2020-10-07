import cloneDeep from 'lodash/cloneDeep';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { LoaderSetting, LoaderSettingKeyName } from 'libs/models/data-loads';

import * as fromUploadPricingFileActions from '../actions/upload-pricing-file.actions';
import { PricingLoaderSettingsHelper } from '../helpers';

export interface State {
  worksheetNames: AsyncStateObj<string[]>;
  fileUploadSettings: LoaderSetting[];
}

export const initialState: State = {
  worksheetNames: generateDefaultAsyncStateObj<string[]>([]),
  fileUploadSettings: PricingLoaderSettingsHelper.generateFileUploadSettings()
};

export function reducer(state: State = initialState, action: fromUploadPricingFileActions.Actions): State {
  switch (action.type) {
    case fromUploadPricingFileActions.GET_WORKSHEET_NAMES: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = true;
      worksheetNamesClone.loadingError = false;

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    case fromUploadPricingFileActions.GET_WORKSHEET_NAMES_SUCCESS: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = false;
      worksheetNamesClone.obj = action.payload.worksheetNames;

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    case fromUploadPricingFileActions.GET_WORKSHEET_NAMES_ERROR: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = false;
      worksheetNamesClone.loadingError = true;

      return {
        ...state,
        worksheetNames: worksheetNamesClone
      };
    }
    case fromUploadPricingFileActions.UPDATE_LOADER_SETTING: {
      const fileUploadSettingsClone: LoaderSetting[] = cloneDeep(state.fileUploadSettings);
      const settingToUpdate: LoaderSetting = fileUploadSettingsClone.find(x => x.KeyName === action.payload.keyName);
      if (settingToUpdate) {
        settingToUpdate.KeyValue = action.payload.keyValue;
      }
      return {
        ...state,
        fileUploadSettings: fileUploadSettingsClone
      };
    }
    case fromUploadPricingFileActions.RESET_UPLOAD_STATE: {
      const worksheetNamesClone: AsyncStateObj<string[]> = cloneDeep(state.worksheetNames);
      worksheetNamesClone.loading = false;
      worksheetNamesClone.loadingError = false;
      worksheetNamesClone.obj = [];

      return {
        ...state,
        worksheetNames: worksheetNamesClone,
        fileUploadSettings: PricingLoaderSettingsHelper.generateFileUploadSettings()
      };
    }
    default: {
      return state;
    }
  }
}

export const getWorksheetNames = (state: State) => state.worksheetNames;
export const getFileUploadSettings = (state: State) => state.fileUploadSettings;
export const getPricingsSheetName = (state: State) => {
  if (!state.fileUploadSettings) {
    return null;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.PricingsSheetName);
  return setting.KeyValue;
};
export const getPricingNotesSheetName = (state: State) => {
  if (!state.fileUploadSettings) {
    return null;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.PricingNotesSheetName);
  return setting.KeyValue;
};
export const getValidationOnly = (state: State) => {
  if (!state.fileUploadSettings) {
    return false;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.ValidateOnly);
  return setting.KeyValue === 'true' ? true : false;
};
