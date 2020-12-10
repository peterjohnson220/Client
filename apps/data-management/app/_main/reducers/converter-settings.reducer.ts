import cloneDeep from 'lodash/cloneDeep';

import { ConverterSettings } from 'libs/models/hris-api';

import * as fromConverterSettingsActions from '../actions/converter-settings.actions';
import { ConverterSettingsHelper } from '../helpers';

export interface State {
  converterSettings: ConverterSettings[];
  removedConverterSettings: ConverterSettings[];
  globalDateSetting: ConverterSettings;
  dataConverterModalOpen: boolean;
  dataConverterModalInfo: {
    fieldName: string,
    connectionId: number,
    dataType: string,
    entityType: string,
    provider: string
  };
}

export const initialState: State = {
  converterSettings: null,
  removedConverterSettings: [],
  globalDateSetting: null,
  dataConverterModalOpen: false,
  dataConverterModalInfo: null,
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
      // This is a hack for outbound sales demo purposes
      // remove this when we no longer have the outbound saled-demo code
      // don't do this...
      if (action.payload.connectionId === -12345) {
        return {
          ...state
        };
      }

      if (action.payload.converterSetting) {
        return {
          ...state,
          converterSettings: ConverterSettingsHelper.addOrUpdateConvertSettings(state.converterSettings, action.payload.converterSetting)
        };
      } else {
        const currentRemovedConverterSettings = cloneDeep(state.removedConverterSettings);
        const removedSettingToAdd = currentRemovedConverterSettings.splice(
          currentRemovedConverterSettings.findIndex(setting =>
            setting.connectionId === action.payload.connectionId &&
            setting.fieldName === action.payload.fieldName &&
            setting.entityType === action.payload.entityType),
          1);

        return {
          ...state,
          converterSettings: state.converterSettings.concat(removedSettingToAdd),
          removedConverterSettings: currentRemovedConverterSettings
        };
      }
    }
    case fromConverterSettingsActions.OPEN_DATA_CONVERTER_MODAL: {
      return {
        ...state,
        dataConverterModalOpen: action.payload.open,
        dataConverterModalInfo: action.payload.modalInfo
      };
    }
    case fromConverterSettingsActions.REMOVE_CONVERTER_SETTING: {
            // This is a hack for outbound sales demo purposes
      // remove this when we no longer have the outbound saled-demo code
      // don't do this...
      if (action.payload.connectionId === -12345) {
        return {
          ...state
        };
      }

      const currentConverterSetting = cloneDeep(state.converterSettings);
      const removedConverterSetting = currentConverterSetting.splice(
        currentConverterSetting.findIndex(setting => setting.connection_ID ===  action.payload.connectionId &&
          setting.fieldName === action.payload.fieldName &&
          setting.entityType === action.payload.entityType ),
        1);
      return {
        ...state,
        converterSettings: currentConverterSetting,
        removedConverterSettings: state.removedConverterSettings.concat(removedConverterSetting)
      };
    }
    case fromConverterSettingsActions.SAVE_CONVERTER_SETTINGS_SUCCESS: {
      return {
        ...state,
        removedConverterSettings: []
      };
    }
    default:
      return state;
  }
}

export const getConverterSettings = (state: State) => state.converterSettings;
export const getGlobalDateSetting = (state: State) => state.globalDateSetting;
export const isDataConverterModalOpen = (state: State) => state.dataConverterModalOpen;
export const getDataConverterModalInfo = (state: State) => state.dataConverterModalInfo;
export const getRemovedConverterSettings = (state: State) => state.removedConverterSettings;
