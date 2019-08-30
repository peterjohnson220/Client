import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';

import * as fromJobBasedRangeAllStructuresActions from '../actions/job-based-range-all-structures.actions';

export interface State {
  companyStructureViewsAsync: AsyncStateObj<CompanyStructureView[]>;
  filteredCompanyStructureViews: CompanyStructureView[];
  companyStructureAddFavoriteError?: number;
  companyStructureRemoveFavoriteError?: number;
}

const initialState: State = {
  companyStructureViewsAsync: generateDefaultAsyncStateObj<CompanyStructureView[]>([]),
  filteredCompanyStructureViews: [],
  companyStructureAddFavoriteError: null,
  companyStructureRemoveFavoriteError: null
};

export function reducer(state = initialState, action: fromJobBasedRangeAllStructuresActions.Actions): State {
  switch (action.type) {
    case fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS: {
      const companyStructureViewsAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructureViewsAsyncClone.loading = true;
      companyStructureViewsAsyncClone.loadingError = false;

      return {
        ...state,
        companyStructureViewsAsync: companyStructureViewsAsyncClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS_SUCCESS: {
      const companyStructureViewsAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructureViewsAsyncClone.loading = false;
      companyStructureViewsAsyncClone.obj = action.payload;

      const filteredCompanyStructureViewsClone = cloneDeep(companyStructureViewsAsyncClone.obj);

      return {
        ...state,
        companyStructureViewsAsync: companyStructureViewsAsyncClone,
        filteredCompanyStructureViews: filteredCompanyStructureViewsClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.GET_COMPANY_STRUCTURE_VIEWS_ERROR: {
      const companyStructureViewsAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructureViewsAsyncClone.loading = false;
      companyStructureViewsAsyncClone.loadingError = true;

      return {
        ...state,
        companyStructureViewsAsync: companyStructureViewsAsyncClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.ADD_STRUCTURE_FAVORITE_SUCCESS: {
      const companyStructureViewsAsyncClone = cloneDeep(state.companyStructureViewsAsync);

      companyStructureViewsAsyncClone.obj.find(sv => sv.Structure.CompanyStructuresId === action.payload).IsFavorite = true;

      return {
        ...state,
        companyStructureViewsAsync: companyStructureViewsAsyncClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.ADD_STRUCTURE_FAVORITE_ERROR: {
      return {
        ...state,
        companyStructureAddFavoriteError: action.payload
      };
    }
    case fromJobBasedRangeAllStructuresActions.REMOVE_STRUCTURE_FAVORITE_SUCCESS: {
      const companyStructureViewsAsyncClone = cloneDeep(state.companyStructureViewsAsync);
      companyStructureViewsAsyncClone.obj.find(sv => sv.Structure.CompanyStructuresId === action.payload).IsFavorite = false;
      return {
        ...state,
        companyStructureViewsAsync: companyStructureViewsAsyncClone
      };
    }
    case fromJobBasedRangeAllStructuresActions.REMOVE_STRUCTURE_FAVORITE_ERROR: {
      return {
        ...state,
        companyStructureRemoveFavoriteError: action.payload
      };
    }
    case fromJobBasedRangeAllStructuresActions.CLEAR_STRUCTURE_FAVORITE_ERRORS: {
      return {
        ...state,
        companyStructureAddFavoriteError: null,
        companyStructureRemoveFavoriteError: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyStructureViewsAsync = (state: State) => state.companyStructureViewsAsync;
export const getFilteredCompanyStructureViews = (state: State) => state.filteredCompanyStructureViews;
export const getFilteredCompanyStructureFavorites = (state: State) =>
  state.filteredCompanyStructureViews.filter(csv => csv.IsFavorite).map(csv => csv.Structure);
export const getCompanyStructureAddFavoriteError = (state: State) => state.companyStructureAddFavoriteError;
export const getCompanyStructureRemoveFavoriteError = (state: State) => state.companyStructureRemoveFavoriteError;


