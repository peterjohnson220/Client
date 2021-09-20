import cloneDeep from 'lodash/cloneDeep';

import { CompensableFactorsResponse } from 'libs/models/payfactors-api';

import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';

export interface State {
  compensableFactors: CompensableFactorsResponse[];
  loadingCompensableFactors: boolean;
  loadingCompensableFactorsError: boolean;
  loadingEducationTypes: boolean;
  loadingEducationTypesError: boolean;
  displayWarning: boolean;
  selectedCount: number;
}

const initialState: State = {
  compensableFactors: null,
  loadingCompensableFactors: false,
  loadingCompensableFactorsError: false,
  loadingEducationTypes: false,
  loadingEducationTypesError: false,
  displayWarning: false,
  selectedCount: 0
};

export function reducer(state = initialState, action: fromCompensableFactorsActions.Actions): State {
  switch (action.type) {
    case fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS: {
      return {
        ...state,
        compensableFactors: null,
        loadingCompensableFactors: true
      };
    }
    case fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS_SUCCESS: {
      return {
        ...state,
        compensableFactors: action.payload,
        loadingCompensableFactors: false,
      };
    }
    case fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS_ERROR: {
      return {
        ...state,
        loadingCompensableFactors: false,
        loadingCompensableFactorsError: true
      };
    }
    case fromCompensableFactorsActions.TOGGLE_SELECTED_COMPENSABLE_FACTOR: {
      const factorResults = cloneDeep(state.compensableFactors[action.payload.compensableFactor]);
      const factorToUpdate = factorResults.find(x => x.Name === action.payload.name);
      if (factorToUpdate != null) {
        factorToUpdate.Selected = !factorToUpdate.Selected;
      }

      return {
        ...state,
        displayWarning: true,
        compensableFactors: {
          ...state.compensableFactors,
          [action.payload.compensableFactor]: factorResults
        },
        selectedCount: factorToUpdate.Selected ? state.selectedCount + 1 : state.selectedCount - 1
      };
    }
    case fromCompensableFactorsActions.GET_EDUCATION_TYPES:
      return {
        ...state,
        loadingCompensableFactors: true
      };
    case fromCompensableFactorsActions.GET_EDUCATION_TYPES_SUCCESS:
      return {
        ...state,
        loadingEducationTypes: false
      };
    case fromCompensableFactorsActions.GET_EDUCATION_TYPES_ERROR:
      return {
        ...state,
        loadingEducationTypes: false,
        loadingEducationTypesError: true
      };
    case fromCompensableFactorsActions.ADD_DATA_TO_COMPENSABLE_FACTORS_LIST: {
      return {
        ...state,
        compensableFactors: {
          ...state.compensableFactors,
          [action.payload.compensableFactor]: action.payload.Data
        }
      };
    }
    case fromCompensableFactorsActions.INIT_JOB_INITIAL_PRICING: {
      const factors = cloneDeep(state.compensableFactors);
      Object.keys(factors).forEach(key => {
        factors[key].map(x => x.Selected = false);
      });
      return {
        ...state,
        displayWarning: false,
        compensableFactors: factors,
        selectedCount: 0
      };
    }
    case fromCompensableFactorsActions.DISABLE_WARNING: {
      return{
        ...state,
        displayWarning: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompensableFactorsLoading = (state: State) => state.loadingCompensableFactors;
export const getCompensableFactors = (state: State) => state.compensableFactors;
export const getSelectedFactors = (state: State) => {
  const selectedFactors = {};
  if (!!state.compensableFactors) {
    Object.keys(state.compensableFactors).forEach(key => {
      const selections = state.compensableFactors[key].filter(x => x.Selected === true);
      !!selections ? selectedFactors[key] = selections : selectedFactors[key] = [];
    });
  }
  return selectedFactors;
};
export const getDisplayWarning = (state: State) => state.displayWarning;
export const getSelectedCount = (state: State) => state.selectedCount;
