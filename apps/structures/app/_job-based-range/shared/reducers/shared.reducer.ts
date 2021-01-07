import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { RoundingSettingsDataObj, RoundingSetting, CompanyStructureRangeOverride } from 'libs/models/structures';

import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, GenericKeyValue } from 'libs/models';
import { RangeGroupMetadata } from 'libs/models/structures';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromSharedActions from '../actions/shared.actions';
import { RangeDistributionTypeIds } from '../../../shared/constants/range-distribution-type-ids';
import { SelectedPeerExchangeModel } from '../models';

export interface State {
  metadata: RangeGroupMetadata;
  roundingSettings: RoundingSettingsDataObj;
  removingRange: AsyncStateObj<boolean>;
  rangeOverrides: CompanyStructureRangeOverride[];
  currentRangeGroup: AsyncStateObj<any>;
  comparingModels: boolean;
  compareEnabled: boolean;
  overrideMessages: string[];
  structureHasSettings: AsyncStateObj<any>;
  gettingExchanges: AsyncStateObj<GenericKeyValue<number, string>[]>;
  selectedPeerExchange: SelectedPeerExchangeModel;
}

const initialState: State = {
  metadata: null,
  roundingSettings: {
    'min': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'mid': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'max': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
  },
  removingRange: generateDefaultAsyncStateObj<boolean>(false),
  rangeOverrides: [],
  currentRangeGroup: generateDefaultAsyncStateObj<any>(null),
  comparingModels: false,
  compareEnabled: false,
  structureHasSettings: generateDefaultAsyncStateObj<any>(null),
  overrideMessages: [],
  gettingExchanges: generateDefaultAsyncStateObj<GenericKeyValue<number, string>[]>(null),
  selectedPeerExchange: null
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      const newState = cloneDeep(state);
      const roundingSettings = setRangeDistributionType(action.payload, newState);
      return {
        ...state,
        roundingSettings: roundingSettings,
        metadata: action.payload
      };
    case fromSharedActions.UPDATE_ROUNDING_TYPE: {
      return {
        ...state,
        roundingSettings: {
          ...state.roundingSettings,
          [action.payload.RoundingSetting]: {
            ...state.roundingSettings[action.payload.RoundingSetting],
            RoundingType: action.payload.RoundingType
          }
        }
      };
    }
    case fromSharedActions.UPDATE_ROUNDING_POINT: {
      return {
        ...state,
        roundingSettings: {
          ...state.roundingSettings,
          [action.payload.RoundingSetting]: {
            ...state.roundingSettings[action.payload.RoundingSetting],
            RoundingPoint: action.payload.RoundingPoint
          }
        }
      };
    }
    case fromSharedActions.SHOW_REMOVE_RANGE_MODAL: {
      return {
        ...state,
        removingRange: {
          ...state.removingRange,
          loadingError: false,
          loadingErrorResponse: null
        }
      };
    }
    case fromSharedActions.REMOVING_RANGE: {
      return AsyncStateObjHelper.loading(state, 'removingRange');
    }
    case fromSharedActions.REMOVING_RANGE_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'removingRange');
    }
    case fromSharedActions.REMOVING_RANGE_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'removingRange', action.error);
    }
    case fromSharedActions.RESET_ROUNDING_SETTING: {
      const initialSetting = setRangeDistributionType(state.metadata, cloneDeep(initialState));
      return {
        ...state,
        roundingSettings: initialSetting
      };
    }
    case fromSharedActions.UPDATE_ROUNDING_POINTS: {
      const newSetting = updateRoundingPoints(action.payload.RoundingPoint, cloneDeep(state.roundingSettings));
      return {
        ...state,
        roundingSettings: newSetting
      };
    }
    case fromSharedActions.GET_OVERRIDDEN_RANGES_SUCCESS: {
      return {
        ...state,
        rangeOverrides: action.payload
      };
    }
    case fromSharedActions.UPDATE_OVERRIDES: {
      const updatedRangeOverrides = updateOverrides(action.payload.rangeId, cloneDeep(state.rangeOverrides),
        action.payload.overrideToUpdate, action.payload.removeOverride);
      const overrideMessages = updateOverrideFiltersIfNeeded(cloneDeep(state.overrideMessages));
      return {
        ...state,
        rangeOverrides: updatedRangeOverrides,
        overrideMessages: overrideMessages
      };
    }
    case fromSharedActions.GET_CURRENT_RANGE_GROUP: {
      const currentRangeGroupClone = cloneDeep(state.currentRangeGroup);

      currentRangeGroupClone.loading = true;
      currentRangeGroupClone.obj = null;
      currentRangeGroupClone.loadingError = false;

      return {
        ...state,
        currentRangeGroup: currentRangeGroupClone
      };
    }
    case fromSharedActions.GET_CURRENT_RANGE_GROUP_SUCCESS: {
      const currentRangeGroupClone = cloneDeep(state.currentRangeGroup);

      currentRangeGroupClone.loading = false;
      currentRangeGroupClone.obj = action.payload;
      return {
        ...state,
        currentRangeGroup: currentRangeGroupClone
      };
    }
    case fromSharedActions.GET_CURRENT_RANGE_GROUP_ERROR: {
      const currentRangeGroupClone = cloneDeep(state.currentRangeGroup);

      currentRangeGroupClone.loading = false;
      currentRangeGroupClone.loadingError = true;

      return {
        ...state,
        currentRangeGroup: currentRangeGroupClone
      };
    }
    case fromSharedActions.COMPARING_MODELS: {
      return{
        ...state,
        comparingModels: true
      };
    }
    case fromSharedActions.END_COMPARING_MODELS: {
      return {
        ...state,
        comparingModels: false
      };
    }
    case fromSharedActions.ENABLE_COMPARE_FLAG: {
        return {
          ...state,
          compareEnabled: true
        };
    }
    case fromSharedActions.DISABLE_COMPARE_FLAG: {
      return {
        ...state,
        compareEnabled: false
      };
    }
    case fromSharedActions.GET_DISTINCT_OVERRIDE_MESSAGES_SUCCESS: {
      return {
        ...state,
        overrideMessages: action.payload
      };
    }
    case fromSharedActions.GET_STRUCTURE_HAS_SETTINGS: {
      const structureHasSettings = cloneDeep(state.structureHasSettings);

      structureHasSettings.loading = true;
      structureHasSettings.obj = null;
      structureHasSettings.loadingError = false;

      return {
        ...state,
        structureHasSettings: structureHasSettings
      };
    }
    case fromSharedActions.GET_STRUCTURE_HAS_SETTINGS_SUCCESS: {
      const structureHasSettings = cloneDeep(state.structureHasSettings);

      structureHasSettings.loading = false;
      structureHasSettings.obj = action.payload;

      return {
        ...state,
        structureHasSettings: structureHasSettings
      };
    }
    case fromSharedActions.GET_STRUCTURE_HAS_SETTINGS_ERROR: {
      const structureHasSettings = cloneDeep(state.structureHasSettings);

      structureHasSettings.loading = false;
      structureHasSettings.loadingError = true;

      return {
        ...state,
        structureHasSettings: structureHasSettings
      };
    }
    case fromSharedActions.GET_COMPANY_EXCHANGES: {
      const gettingExchangesClone = cloneDeep(state.gettingExchanges);

      gettingExchangesClone.loading = true;
      gettingExchangesClone.loadingError = false;

      return {
        ...state,
        gettingExchanges: gettingExchangesClone
      };
    }
    case fromSharedActions.GET_COMPANY_EXCHANGES_SUCCESS: {
      const gettingExchangesClone = cloneDeep(state.gettingExchanges);

      gettingExchangesClone.loading = false;
      gettingExchangesClone.obj = action.payload;

      return {
        ...state,
        gettingExchanges: gettingExchangesClone
      };
    }
    case fromSharedActions.GET_COMPANY_EXCHANGES_ERROR: {
      const gettingExchangesClone = cloneDeep(state.gettingExchanges);

      gettingExchangesClone.loading = false;
      gettingExchangesClone.loadingError = true;

      return {
        ...state,
        gettingExchanges: gettingExchangesClone
      };
    }
    case fromSharedActions.SET_SELECTED_PEER_EXCHANGE: {
      return {
        ...state,
        selectedPeerExchange: action.payload
      };
    }
    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
export const getRoundingSettings = (state: State) => state.roundingSettings;
export const getRemovingRange = (state: State) => state.removingRange;
export const getRangeOverrides = (state: State) => state.rangeOverrides;
export const getCurrentRangeGroup = (state: State) => state.currentRangeGroup;
export const getComparingModels = (state: State) => state.comparingModels;
export const getCompareEnabled = (state: State) => state.compareEnabled;
export const getDistinctOverrideMessages  = (state: State) => state.overrideMessages;
export const getStructureHasSettings = (state: State) => state.structureHasSettings;
export const getCompanyExchanges = (state: State) => state.gettingExchanges;
export const getSelectedPeerExchange = (state: State) => state.selectedPeerExchange;

export const addRoundingSetting = (name: string, setting: RoundingSetting, settings: RoundingSettingsDataObj) => {
  return settings[name] = setting;
};

function updateRoundingPoints(roundingPoint: number, settings: RoundingSettingsDataObj) {
  for (const key in settings) {
    if (!!settings[key]) {
      settings[key].RoundingPoint = roundingPoint;
    }
  }
  return settings;
}

function updateOverrides(rangeId: number, overrides: CompanyStructureRangeOverride[],
                         overrideToUpdate: CompanyStructureRangeOverride, remove: boolean): CompanyStructureRangeOverride[] {
  const rangeOverride = overrides.find(ro => ro.CompanyStructuresRangesId === rangeId);
  if (!!rangeOverride && !remove) {
    overrides.splice(overrides.indexOf(rangeOverride), 1, overrideToUpdate);
  } else if (!!rangeOverride && remove) {
    overrides.splice(overrides.indexOf(rangeOverride), 1);
  } else {
    overrides.push(overrideToUpdate);
  }
  return overrides;
}

function updateOverrideFiltersIfNeeded(overrideMessages: string[]) {
  const genericOverrideMessage = 'One or more fields in this range have been manually changed.';
  if (!overrideMessages.includes(genericOverrideMessage)) {
    overrideMessages.push(genericOverrideMessage);
  }
  return overrideMessages;
}

function setRangeDistributionType(metadata: RangeGroupMetadata, state) {
  const defaultRoundingSetting: RoundingSetting = {
    RoundingPoint: 0,
    RoundingType: RoundingTypes.Round
  };

  if (metadata.Rate && metadata.Rate.toLowerCase() === 'hourly') {
    defaultRoundingSetting.RoundingPoint = 2;
  }

  addRoundingSetting('min', defaultRoundingSetting, state.roundingSettings);
  addRoundingSetting('mid', defaultRoundingSetting, state.roundingSettings);
  addRoundingSetting('max', defaultRoundingSetting, state.roundingSettings);

  switch (metadata.RangeDistributionTypeId) {
    case RangeDistributionTypeIds.Tertile: {
      addRoundingSetting('firstTertile', defaultRoundingSetting, state.roundingSettings);
      addRoundingSetting('secondTertile', defaultRoundingSetting, state.roundingSettings);
      return state.roundingSettings;
    }
    case RangeDistributionTypeIds.Quartile: {
      addRoundingSetting('firstQuartile', defaultRoundingSetting, state.roundingSettings);
      addRoundingSetting('secondQuartile', defaultRoundingSetting, state.roundingSettings);
      return state.roundingSettings;
    }
    case RangeDistributionTypeIds.Quintile: {
      addRoundingSetting('firstQuintile', defaultRoundingSetting, state.roundingSettings);
      addRoundingSetting('secondQuintile', defaultRoundingSetting, state.roundingSettings);
      addRoundingSetting('thirdQuintile', defaultRoundingSetting, state.roundingSettings);
      addRoundingSetting('fourthQuintile', defaultRoundingSetting, state.roundingSettings);
      return state.roundingSettings;
    }
    case RangeDistributionTypeIds.MinMidMax: {
      return state.roundingSettings;
    }
  }
}
