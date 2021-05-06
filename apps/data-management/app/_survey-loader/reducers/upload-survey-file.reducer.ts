import cloneDeep from 'lodash/cloneDeep';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { LoaderSetting, LoaderSettingKeyName } from 'libs/models/data-loads';
import { AsyncStateObjHelper } from 'libs/core';
import * as fromUploadSurveyFileActions from '../actions/upload-survey-file.actions';
import { SurveyLoaderSettingsHelper } from '../helpers';
import { SurveySheetModel } from '../models';

export interface State {
  worksheetNames: AsyncStateObj<string[]>;
  fileUploadSettings: LoaderSetting[];
}

export const initialState: State = {
  worksheetNames: generateDefaultAsyncStateObj<string[]>([]),
  fileUploadSettings: SurveyLoaderSettingsHelper.generateFileUploadSettings()
};

export function reducer(state: State = initialState, action: fromUploadSurveyFileActions.Actions): State {
  switch (action.type) {
    case fromUploadSurveyFileActions.GET_WORKSHEET_NAMES: {
      return AsyncStateObjHelper.loading(state, 'worksheetNames');
    }
    case fromUploadSurveyFileActions.GET_WORKSHEET_NAMES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'worksheetNames', action.payload.worksheetNames);
    }
    case fromUploadSurveyFileActions.GET_WORKSHEET_NAMES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'worksheetNames');
    }
    case fromUploadSurveyFileActions.UPDATE_LOADER_SETTING: {
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
    case fromUploadSurveyFileActions.RESET_UPLOAD_STATE: {
      return {
        ...state,
        worksheetNames: generateDefaultAsyncStateObj<string[]>([]),
        fileUploadSettings: SurveyLoaderSettingsHelper.generateFileUploadSettings()
      };
    }
    default: {
      return state;
    }
  }
}

export const getWorksheetNames = (state: State) => state.worksheetNames;
export const getFileUploadSettings = (state: State) => {
  let surveySheet: SurveySheetModel[];
  const fileUploadSettingsClone: LoaderSetting[] = cloneDeep(state.fileUploadSettings);
  return fileUploadSettingsClone.map(fus => {
    if (fus.KeyValue !== null && fus.KeyName !== LoaderSettingKeyName.ValidateOnly && fus.KeyName !== LoaderSettingKeyName.FileFormat) {
     surveySheet = JSON.parse(fus.KeyValue);
     fus.KeyValue = JSON.stringify(surveySheet.filter(ss => ss.Value !== null).map(ss => ss.Value));
    }
    return fus;
  });
};
export const getSurveyJobSheetName = (state: State) => {
  if (!state.fileUploadSettings) {
    return null;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.SurveyJobsSheetName);
  return setting.KeyValue;
};
export const getSurveyDataSheetName = (state: State) => {
  if (!state.fileUploadSettings) {
    return null;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.SurveyDataSheetName);
  return setting.KeyValue;
};
export const getSurveyParticipationSheetName = (state: State) => {
  if (!state.fileUploadSettings) {
    return null;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.SurveyParticipationSheetName);
  return setting.KeyValue;
};
export const getValidationOnly = (state: State) => {
  if (!state.fileUploadSettings) {
    return false;
  }
  const setting = state.fileUploadSettings.find(x => x.KeyName === LoaderSettingKeyName.ValidateOnly);
  return setting.KeyValue === 'true' ? true : false;
};
