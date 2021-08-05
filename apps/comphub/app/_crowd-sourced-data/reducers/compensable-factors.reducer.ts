import { cloneDeep } from 'lodash/cloneDeep';

import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';

import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';

export interface State {
  compensableFactors: CompensableFactorsResponseModel[];
  loadingCompensableFactors: boolean;
  loadingCompensableFactorsError: boolean;
  selectedFactors: {[Name: string]: string[]};
}

const initialState: State = {
  compensableFactors: null,
  loadingCompensableFactors: false,
  loadingCompensableFactorsError: false,
  selectedFactors: null
};

export function reducer(state = initialState, action: fromCompensableFactorsActions.Actions): State {
  switch (action.type) {
    case fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS: {
      return {
        ...state,
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
    case fromCompensableFactorsActions.ADD_SELECTED_COMPENSABLE_FACTOR: {
      return {
        ...state,
      selectedFactors: {
          ...state.selectedFactors,
        [action.payload.compensableFactor]: action.payload.selectedFactors
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
export const getSelectedFactors = (state: State) => state.selectedFactors;
