import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { CompanyStructure } from 'libs/models/structures/company-structure.model';

import * as fromStructuresActions from '../actions/structures.actions';

export interface State {
  companyStructureAsync: AsyncStateObj<CompanyStructure[]>;
}

const initialState: State = {
  companyStructureAsync: generateDefaultAsyncStateObj<CompanyStructure[]>([])
};

export function reducer(state = initialState, action: fromStructuresActions.Actions): State {
  switch (action.type) {
    case fromStructuresActions.GET_COMPANY_STRUCTURES: {
      const companyStructuresAsyncClone = cloneDeep(state.companyStructureAsync);

      companyStructuresAsyncClone.loading = true;
      companyStructuresAsyncClone.loadingError = false;

      return {
        ...state,
        companyStructureAsync: companyStructuresAsyncClone
      };
    }
    case fromStructuresActions.GET_COMPANY_STRUCTURES_SUCCESS: {
      const companyStructuresAsyncClone = cloneDeep(state.companyStructureAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.obj = action.payload;

      return {
        ...state,
        companyStructureAsync: companyStructuresAsyncClone
      };
    }
    case fromStructuresActions.GET_COMPANY_STRUCTURES_ERROR: {
      const companyStructuresAsyncClone = cloneDeep(state.companyStructureAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.loadingError = true;

      return {
        ...state,
        companyStructureAsync: companyStructuresAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyStructuresAsync = (state: State) => state.companyStructureAsync;

