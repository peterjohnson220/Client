import cloneDeep from 'lodash/cloneDeep';

import * as fromUserFilterActions from '../actions/user-filter.actions';
import { SavedFilter } from '../models';

export interface State {
  loadingSavedFilters: boolean;
  loadingError: boolean;
  savedFilters: SavedFilter[];
  savingFilter: boolean;
  savingFilterConflict: boolean;
  savingFilterError: boolean;
  deletingSavedFilter: boolean;
  filterIdToSelect: string;
  defaultFilterId: string;
}

const initialState: State = {
  loadingSavedFilters: false,
  loadingError: false,
  savedFilters: [],
  savingFilter: false,
  savingFilterConflict: false,
  savingFilterError: false,
  deletingSavedFilter: false,
  filterIdToSelect: '',
  defaultFilterId: ''
};

// Reducer function
export function reducer(state = initialState, action: fromUserFilterActions.Actions): State {
  switch (action.type) {
    case fromUserFilterActions.INIT: {
      return {
        ...state,
        filterIdToSelect: ''
      };
    }
    case fromUserFilterActions.RESET: {
      return {
        ...state,
        loadingSavedFilters: false,
        savedFilters: []
      };
    }
    case fromUserFilterActions.GET_ALL: {
      return {
        ...state,
        loadingSavedFilters: true,
        loadingError: false
      };
    }
    case fromUserFilterActions.GET_ONE: {
      return {
        ...state,
        loadingSavedFilters: true,
        loadingError: false
      };
    }
    case fromUserFilterActions.GET_SUCCESS: {
      const savedFiltersCopy = cloneDeep(action.payload);
      if (!!state.filterIdToSelect) {
        savedFiltersCopy.find(sf => sf.Id === state.filterIdToSelect).Selected = true;
      }
      return {
        ...state,
        loadingSavedFilters: false,
        savedFilters: savedFiltersCopy
      };
    }
    case fromUserFilterActions.GET_ERROR: {
      return {
        ...state,
        loadingError: true
      };
    }
    case fromUserFilterActions.UPSERT: {
      return {
        ...state,
        savingFilter: true,
        savingFilterError: false,
        savingFilterConflict: false
      };
    }
    case fromUserFilterActions.UPSERT_SUCCESS: {
      const filterIdToSelect = action.payload.isNew ? action.payload.savedFilterId : state.filterIdToSelect;
      return {
        ...state,
        savingFilter: false,
        filterIdToSelect: filterIdToSelect
      };
    }
    case fromUserFilterActions.UPSERT_ERROR: {
      return {
        ...state,
        savingFilterError: true,
        savingFilter: false
      };
    }
    case fromUserFilterActions.UPSERT_CONFLICT: {
      return {
        ...state,
        savingFilter: false,
        savingFilterConflict: true
      };
    }
    case fromUserFilterActions.CLEAR_UPSERT_ERROR: {
      return {
        ...state,
        savingFilterConflict: false,
        savingFilterError: false
      };
    }
    case fromUserFilterActions.DELETE: {
      return {
        ...state,
        deletingSavedFilter: true
      };
    }
    case fromUserFilterActions.DELETE_SUCCESS: {
      return {
        ...state,
        deletingSavedFilter: false
      };
    }
    case fromUserFilterActions.SET_SELECTED: {
      const savedFiltersCopy = cloneDeep(state.savedFilters);
      let filterIdToSelect = '';
      savedFiltersCopy.map(sf => sf.Selected = false);
      if (!!action.payload.id && action.payload.selected === true) {
        savedFiltersCopy.find(sf => sf.Id === action.payload.id).Selected = true;
        filterIdToSelect = action.payload.id;
      }
      return {
        ...state,
        savedFilters: savedFiltersCopy,
        filterIdToSelect: filterIdToSelect
      };
    }
    case fromUserFilterActions.SET_DEFAULT: {
      return {
        ...state,
        defaultFilterId: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loadingSavedFilters;
export const getLoadingError = (state: State) => state.loadingError;
export const getSavedFilters = (state: State) => state.savedFilters;
export const getUpserting = (state: State) => state.savingFilter;
export const getUpsertingConflict = (state: State) => state.savingFilterConflict;
export const getUpsertingError = (state: State) => state.savingFilterError;
export const getDeleting = (state: State) => state.deletingSavedFilter;
export const getSelectedSavedFilter = (state: State) => state.savedFilters.find(sf => sf.Selected === true);
export const getFilterIdToSelect = (state: State) => state.filterIdToSelect;
export const getDefaultFilterId = (state: State) => state.defaultFilterId;
