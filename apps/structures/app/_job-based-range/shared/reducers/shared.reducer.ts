import * as fromSharedActions from '../actions/shared.actions';
import { RangeGroupMetadata } from '../models';
import { RoundingSettingsDataObj } from '../models/rounding-setting.model';

import { RoundingTypes } from 'libs/constants/structures/rounding-type';


export interface State {
  metadata: RangeGroupMetadata;
  isNewModelAddJobs: boolean;
  isNewModelModelSettings: boolean;
  roundingSettings: RoundingSettingsDataObj;
}

const initialState: State = {
  metadata: null,
  isNewModelAddJobs: false,
  isNewModelModelSettings: false,
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
  }
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      return {
        ...state,
        metadata: action.payload
      };
    case fromSharedActions.SET_IS_NEW_MODEL_ADD_JOBS: {
      return {
        ...state,
        isNewModelAddJobs: action.payload || false
      };
    }
    case fromSharedActions.SET_IS_NEW_MODEL_MODEL_SETTINGS: {
      return {
        ...state,
        isNewModelModelSettings: action.payload || false
      };
    }
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
    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
export const getIsNewModelAddJobs = (state: State) => state.isNewModelAddJobs;
export const getIsNewModelModelSettings = (state: State) => state.isNewModelModelSettings;
export const getRoundingSettings = (state: State) => state.roundingSettings;
