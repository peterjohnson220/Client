import * as cloneDeep from 'lodash.clonedeep';

import * as fromResultsHeaderActions from '../actions/results-header.actions';
import { SavedFilter } from '../models/saved-filter.model';

export interface State {
  loadingSavedFilters: boolean;
  savedFilters: SavedFilter[];
  savingFilter: boolean;
  savingFilterConflict: boolean;
  savingFilterError: boolean;
  deletingSavedFilter: boolean;
  filterIdToDelete: string;
  savedFilterModalOpen: boolean;
}

const initialState: State = {
  loadingSavedFilters: false,
  savedFilters: [],
  savingFilter: false,
  savingFilterConflict: false,
  savingFilterError: false,
  deletingSavedFilter: false,
  filterIdToDelete: '',
  savedFilterModalOpen: false
};

// Reducer function
export function reducer(state = initialState, action: fromResultsHeaderActions.Actions): State {
  switch (action.type) {
    case fromResultsHeaderActions.GET_SAVED_FILTERS: {
      return {
        ...state,
        loadingSavedFilters: true
      };
    }
    case fromResultsHeaderActions.GET_SAVED_FILTERS_SUCCESS: {
      return {
        ...state,
        loadingSavedFilters: false,
        savedFilters: action.payload
      };
    }
    case fromResultsHeaderActions.CLEAR_SAVED_FILTERS: {
      return {
        ...state,
        loadingSavedFilters: false,
        savedFilters: []
      };
    }
    case fromResultsHeaderActions.SAVE_FILTER: {
      return {
        ...state,
        savingFilter: true,
        savingFilterError: false,
        savingFilterConflict: false
      };
    }
    case fromResultsHeaderActions.SAVE_FILTER_SUCCESS: {
      return {
        ...state,
        savingFilter: false,
        savedFilterModalOpen: false
      };
    }
    case fromResultsHeaderActions.MARK_FILTER_TO_DELETE: {
      return {
        ...state,
        filterIdToDelete: action.payload.filterId
      };
    }
    case fromResultsHeaderActions.UNMARK_FILTER_TO_DELETE: {
      return {
        ...state,
        filterIdToDelete: ''
      };
    }
    case fromResultsHeaderActions.DELETE_SAVED_FILTER: {
      return {
        ...state,
        deletingSavedFilter: true
      };
    }
    case fromResultsHeaderActions.DELETE_SAVED_FILTER_SUCCESS: {
      return {
        ...state,
        deletingSavedFilter: false,
        filterIdToDelete: ''
      };
    }
    case fromResultsHeaderActions.SELECT_SAVED_FILTER: {
      const savedFiltersCopy = cloneDeep(state.savedFilters);
      savedFiltersCopy.map(sf => sf.Selected = false);
      savedFiltersCopy.find(sf => sf.Id === action.payload.Id).Selected = true;

      return {
        ...state,
        savedFilters: savedFiltersCopy
      };
    }
    case fromResultsHeaderActions.UNSELECT_SAVED_FILTER: {
      const savedFiltersCopy = cloneDeep(state.savedFilters);
      savedFiltersCopy.map(sf => sf.Selected = false);

      return {
        ...state,
        savedFilters: savedFiltersCopy
      };
    }
    case fromResultsHeaderActions.SAVED_FILTER_SAVE_ERROR: {
      return {
        ...state,
        savingFilterError: true,
        savingFilter: false
      };
    }
    case fromResultsHeaderActions.SAVED_FILTER_SAVE_CONFLICT: {
      return {
        ...state,
        savingFilter: false,
        savingFilterConflict: true
      };
    }
    case fromResultsHeaderActions.OPEN_SAVE_FILTER_MODAL: {
      return {
        ...state,
        savedFilterModalOpen: true
      };
    }
    case fromResultsHeaderActions.CLOSE_SAVE_FILTER_MODAL: {
      return {
        ...state,
        savedFilterModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoadingSavedFilters = (state: State) => state.loadingSavedFilters;
export const getSavedFilters = (state: State) => state.savedFilters;
export const getSavingFilter = (state: State) => state.savingFilter;
export const getSavingFilterConflict = (state: State) => state.savingFilterConflict;
export const getSavingFilterError = (state: State) => state.savingFilterError;
export const getFilterIdToDelete = (state: State) => state.filterIdToDelete;
export const getDeletingSavedFilter = (state: State) => state.deletingSavedFilter;
export const getSaveFilterModalOpen = (state: State) => state.savedFilterModalOpen;
