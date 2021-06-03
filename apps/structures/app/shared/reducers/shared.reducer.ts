import cloneDeep from 'lodash/cloneDeep';

import {
  CompanyStructureRangeOverride,
  generateMockRoundingSettingsDataObj,
  RangeGroupMetadata,
  RoundingSetting,
  RoundingSettingsDataObj
} from 'libs/models/structures';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { AsyncStateObj, generateDefaultAsyncStateObj, GenericKeyValue } from 'libs/models';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import * as fromSharedActions from '../actions/shared.actions';
import { SelectedPeerExchangeModel } from '../models';

export interface State {
  metadata: RangeGroupMetadata;
  roundingSettings: RoundingSettingsDataObj;
  gettingExchanges: AsyncStateObj<GenericKeyValue<number, string>[]>;
  selectedPeerExchange: SelectedPeerExchangeModel;
  rangeOverrides: CompanyStructureRangeOverride[];
  overrideMessages: string[];
  comparingModels: boolean;
  compareEnabled: boolean;
  currentRangeGroup: AsyncStateObj<any>;
  gradeRangeDetails: AsyncStateObj<any>;
}

const initialState: State = {
  metadata: null,
  roundingSettings: generateMockRoundingSettingsDataObj(),
  gettingExchanges: generateDefaultAsyncStateObj<GenericKeyValue<number, string>[]>(null),
  selectedPeerExchange: null,
  rangeOverrides: [],
  overrideMessages: [],
  comparingModels: false,
  compareEnabled: false,
  currentRangeGroup: generateDefaultAsyncStateObj<any>(null),
  gradeRangeDetails: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      const newState = cloneDeep(state);
      const roundingSettings = generateMockRoundingSettingsDataObj();
      return {
        ...state,
        roundingSettings: roundingSettings,
        metadata: action.payload
      };
    case fromSharedActions.GET_OVERRIDDEN_RANGES_SUCCESS: {
      return {
        ...state,
        rangeOverrides: action.payload
      };
    }
    case fromSharedActions.GET_DISTINCT_OVERRIDE_MESSAGES_SUCCESS: {
      return {
        ...state,
        overrideMessages: action.payload
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
    case fromSharedActions.UPDATE_ROUNDING_SETTINGS: {
      return {
        ...state,
        roundingSettings: action.payload
      };
    }
    case fromSharedActions.RESET_ROUNDING_SETTING: {
      const initialSetting = generateMockRoundingSettingsDataObj(action.rate);
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
    } case fromSharedActions.GET_GRADE_RANGE_DETAILS: {
      const gradeRangeDetails = cloneDeep(state.gradeRangeDetails);

      gradeRangeDetails.loading = true;
      gradeRangeDetails.obj = null;
      gradeRangeDetails.loadingError = false;

      return {
        ...state,
        gradeRangeDetails: gradeRangeDetails
      };
    }
    case fromSharedActions.GET_GRADE_RANGE_DETAILS_SUCCESS: {
      const gradeRangeDetails = cloneDeep(state.gradeRangeDetails);

      gradeRangeDetails.loading = false;
      gradeRangeDetails.obj = action.payload;

      return {
        ...state,
        gradeRangeDetails: gradeRangeDetails
      };
    }
    case fromSharedActions.GET_GRADE_RANGE_DETAILS_ERROR: {
      const gradeRangeDetails = cloneDeep(state.gradeRangeDetails);

      gradeRangeDetails.loading = false;
      gradeRangeDetails.loadingError = true;

      return {
        ...state,
        gradeRangeDetails: gradeRangeDetails
      };
    }
    default:
      return state;
  }
}

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


export const getMetadata = (state: State) => state.metadata;
export const getRoundingSettings = (state: State) => state.roundingSettings;
export const getCompanyExchanges = (state: State) => state.gettingExchanges;
export const getSelectedPeerExchange = (state: State) => state.selectedPeerExchange;
export const getRangeOverrides = (state: State) => state.rangeOverrides;
export const getDistinctOverrideMessages  = (state: State) => state.overrideMessages;
export const getComparingModels = (state: State) => state.comparingModels;
export const getCompareEnabled = (state: State) => state.compareEnabled;
export const getCurrentRangeGroup = (state: State) => state.currentRangeGroup;
export const getGradeRangeDetails = (state: State) => state.gradeRangeDetails;
