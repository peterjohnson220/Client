import { cloneDeep } from 'lodash';

import * as fromDefaultSettingsActions from '../actions/default-settings.actions';
import { PricingLoaderSetting } from '../models';
import { PricingLoaderSettingsHelper } from '../helpers';

export interface State {
  defaultSettings: PricingLoaderSetting[];
}

const initialState: State = {
  defaultSettings: PricingLoaderSettingsHelper.generateDefaultSettings()
};

export function reducer(state = initialState, action: fromDefaultSettingsActions.Actions): State {
  switch (action.type) {
    case fromDefaultSettingsActions.UPDATE_DEFAULT_SETTING: {
      const defaultSettingsClone: PricingLoaderSetting[] = cloneDeep(state.defaultSettings);
      const settingToUpdate: PricingLoaderSetting = defaultSettingsClone.find(x => x.KeyName === action.payload.keyName);
      if (settingToUpdate) {
        settingToUpdate.NumericValue = action.payload.numericValue;
        settingToUpdate.KeyValue = action.payload.numericValue.toString();
      }
      return {
        ...state,
        defaultSettings: defaultSettingsClone
      };
    }
    case fromDefaultSettingsActions.RESET_DEFAULT_SETTINGS_STATE: {
      return {
        ...state,
        defaultSettings: PricingLoaderSettingsHelper.generateDefaultSettings()
      };
    }
    default: {
      return state;
    }
  }
}

export const getDefaultSettings = (state: State) => state.defaultSettings;
