import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

import { ConverterSettings } from 'libs/models/hris-api';

import * as fromConverterSettingsActions from '../actions/converter-settings.actions';
import { ConverterSettingsHelper } from '../helpers';

export interface State {
  converterSettings: ConverterSettings[];
  globalDateSetting: ConverterSettings;
}

export const initialState: State = {
  converterSettings: null,
  globalDateSetting: null
};

export function reducer(state = initialState, action: fromConverterSettingsActions.Actions): State {
  switch (action.type) {
    case fromConverterSettingsActions.GET_CONVERTER_SETTINGS_SUCCESS: {
      const defaultGlobalDateSettings = action.payload.filter(setting =>
        setting.entityType.toLowerCase() === 'employees'
        && setting.dataType === 'Date'
      );
      const globalDateSetting = defaultGlobalDateSettings.find(setting =>
        setting.connection_ID !== null &&
        setting.fieldName === null
      );
      return {
        ...state,
        converterSettings: action.payload,
        globalDateSetting: globalDateSetting ? globalDateSetting : defaultGlobalDateSettings[0]
      };
    }
    case fromConverterSettingsActions.ADD_CONVERTER_SETTING: {
      return {
        ...state,
        converterSettings: ConverterSettingsHelper.addOrUpdateConvertSettings(state.converterSettings, action.payload)
      };
    }
    default:
      return state;
  }
}

export const getConverterSettings = (state: State) => state.converterSettings;
export const getGlobalDateSetting = (state: State) => state.globalDateSetting;
