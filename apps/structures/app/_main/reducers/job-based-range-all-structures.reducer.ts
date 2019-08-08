import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { CompanyStructureView, generateDefaultCompanyStructureView } from 'libs/models/structures/company-structure-view.model';

import * as fromJobBasedRangeAllStructuresActions from '../actions/job-based-range-all-structures.actions';

export interface State {
  companyStructureViewsAsync: AsyncStateObj<CompanyStructureView[]>;
}

const initialState: State = {
  companyStructureViewsAsync: generateDefaultAsyncStateObj<CompanyStructureView[]>([]),
};

export function reducer(state = initialState, action: fromJobBasedRangeAllStructuresActions.Actions): State {
  switch (action.type) {
    case fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS: {
      const companyStructuresAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructuresAsyncClone.loading = true;
      companyStructuresAsyncClone.loadingError = false;

      return {
        ...state,
        companyStructureViewsAsync: companyStructuresAsyncClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS_SUCCESS: {
      const companyStructuresAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.obj = action.payload.map((structure) => generateDefaultCompanyStructureView(structure));

      return {
        ...state,
        companyStructureViewsAsync: companyStructuresAsyncClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS_ERROR: {
      const companyStructuresAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructuresAsyncClone.loading = false;
      companyStructuresAsyncClone.loadingError = true;

      return {
        ...state,
        companyStructureViewsAsync: companyStructuresAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyStructureViewsAsync = (state: State) => state.companyStructureViewsAsync;
export const getFilteredCompanyStructures = (state: State) => state.companyStructureViewsAsync.obj;
