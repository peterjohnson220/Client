import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, GenericKeyValue } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromSharedActions from '../actions/shared.actions';

export interface State {
  removingRange: AsyncStateObj<boolean>;
  currentRangeGroup: AsyncStateObj<any>;
  comparingModels: boolean;
  compareEnabled: boolean;
  structureHasSettings: AsyncStateObj<any>;
}

const initialState: State = {
  removingRange: generateDefaultAsyncStateObj<boolean>(false),
  currentRangeGroup: generateDefaultAsyncStateObj<any>(null),
  comparingModels: false,
  compareEnabled: false,
  structureHasSettings: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
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
    default:
      return state;
  }
}

export const getRemovingRange = (state: State) => state.removingRange;
export const getCurrentRangeGroup = (state: State) => state.currentRangeGroup;
export const getComparingModels = (state: State) => state.comparingModels;
export const getCompareEnabled = (state: State) => state.compareEnabled;
export const getStructureHasSettings = (state: State) => state.structureHasSettings;


