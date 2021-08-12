import cloneDeep from 'lodash/cloneDeep';

import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';

import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';
import { PayfactorsApiModelMapper } from '../../_shared/helpers';

export interface State {
  compensableFactors: CompensableFactorsResponseModel[];
  loadingCompensableFactors: boolean;
  loadingCompensableFactorsError: boolean;
  educationTypes: string[];
  loadingEducationTypes: boolean;
  loadingEducationTypesError: boolean;
}

const initialState: State = {
  compensableFactors: null,
  loadingCompensableFactors: false,
  loadingCompensableFactorsError: false,
  educationTypes: [],
  loadingEducationTypes: false,
  loadingEducationTypesError: false
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
      const factorToUpdate = factorResults.find(x => x.Name === action.payload.Name);
      if (factorToUpdate != null) {
        factorToUpdate.Selected = !factorToUpdate.Selected;
      }

      return {
        ...state,
        compensableFactors: {
          ...state.compensableFactors,
          [action.payload.compensableFactor]: factorResults
        }
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
        loadingEducationTypes: false,
        educationTypes: PayfactorsApiModelMapper.mapEducationTypeValuesToArray(action.payload)
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
    default: {
      return state;
    }
  }
}

export const getCompensableFactorsLoading = (state: State) => state.loadingCompensableFactors;
export const getCompensableFactors = (state: State) => state.compensableFactors;
export const getEducationTypes = (state: State) => state.educationTypes;
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

