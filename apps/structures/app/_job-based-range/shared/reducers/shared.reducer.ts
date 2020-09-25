import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { RoundingSettingsDataObj, RoundingSetting, CompanyStructureRangeOverride } from 'libs/models/structures';

import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

import * as fromSharedActions from '../actions/shared.actions';
import { AdvancedSettings, RangeGroupMetadata } from '../models';
import { RangeDistributionTypeIds } from '../constants/range-distribution-type-ids';

export interface State {
  metadata: RangeGroupMetadata;
  roundingSettings: RoundingSettingsDataObj;
  removingRange: AsyncStateObj<boolean>;
  advancedSettings: AdvancedSettings;
  rangeOverrides: CompanyStructureRangeOverride[];
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
  advancedSettings: {
    PreventMidsBelowCurrent: false,
    Rounding: {
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
      'firstTertile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'secondTertile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'firstQuartile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'secondQuartile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'firstQuintile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'secondQuintile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'thirdQuintile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      },
      'fourthQuintile': {
        RoundingType: RoundingTypes.Round,
        RoundingPoint: 0
      }
    },
    PreventMidsFromIncreasingWithinPercentOfNextLevel: {
      Enabled: false,
      Percentage: 0
    },
    PreventMidsFromIncreasingMoreThanPercent: {
      Enabled: false,
      Percentage: 0
    },
    MissingMarketDataType: {
      Type: MissingMarketDataTypes.UsePublishedRange,
      Percentage: 0
    }
  },
  rangeOverrides: []
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      const newState = cloneDeep(state);
      const setting = setRangeDistributionType(action.payload, newState);
      return {
        ...state,
        roundingSettings: setting,
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
    case fromSharedActions.UPDATE_ADVANCED_SETTINGS: {
      return {
        ...state,
        advancedSettings: action.payload.advancedSettings
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
      return {
        ...state,
        rangeOverrides: updatedRangeOverrides
      };
    }

    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
export const getRoundingSettings = (state: State) => state.roundingSettings;
export const getAdvancedSettings = (state: State) => state.advancedSettings;
export const getRemovingRange = (state: State) => state.removingRange;
export const getRangeOverrides = (state: State) => state.rangeOverrides;

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
