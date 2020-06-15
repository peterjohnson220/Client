import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { RoundingSettingsDataObj } from 'libs/models/structures';

import * as cloneDeep from 'lodash.clonedeep';

import * as fromSharedActions from '../actions/shared.actions';
import { RangeGroupMetadata } from '../models';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

export interface State {
  metadata: RangeGroupMetadata;
  roundingSettings: RoundingSettingsDataObj;
  removingRange: AsyncStateObj<boolean>;
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
  removingRange: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      return {
        ...state,
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
    case fromSharedActions.UPDATE_RANGE_DISTRIBUTION_TYPE: {
      const clonedMetadata = cloneDeep(state.metadata);
      clonedMetadata.RangeDistributionTypeId = action.payload.RangeDistributionTypeId;
      return {
        ...state,
        metadata: clonedMetadata
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

    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
export const getRoundingSettings = (state: State) => state.roundingSettings;
export const getRemovingRange = (state: State) => state.removingRange;
