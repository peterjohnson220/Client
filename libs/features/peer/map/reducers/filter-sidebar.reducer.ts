import { FilterAggregateGroup } from 'libs/models/peer/aggregate-filters';
import { PayMarket } from 'libs/models/paymarket';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import { FilterSidebarHelper } from '../helpers';
import { SystemFilter } from '../../../../models';

// Extended entity state
export interface State {
  loading: boolean;
  loadingError: boolean;
  limitToPayMarket: boolean;
  payMarket: PayMarket;
  filterAggregateGroups: FilterAggregateGroup[];
  selections: any;
  previewLimit: number;
  systemFilter: SystemFilter;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,
  limitToPayMarket: false,
  payMarket: null,
  filterAggregateGroups: [],
  selections: {},
  previewLimit: FilterSidebarHelper.PreviewLimit,
  systemFilter: null
};

// Reducer
export function reducer(state = initialState, action: fromFilterSidebarActions.Actions): State {
  switch (action.type) {
    case fromFilterSidebarActions.LOADING_FILTER_AGGREGATES: {
      return {
        ...state,
        loading: true
      };
    }
    case fromFilterSidebarActions.LOADING_FILTER_AGGREGATES_SUCCESS: {
      const limitingToExchange = state.systemFilter && !!state.systemFilter.ExchangeId;
      const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(
        state.filterAggregateGroups, action.payload, limitingToExchange);

      return {
        ...state,
        filterAggregateGroups: newAggGroups,
        loading: false
      };
    }
    case fromFilterSidebarActions.LOADING_FILTER_AGGREGATES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromFilterSidebarActions.TOGGLE_AGGREGATE_SELECTED: {
      const newAggGroups = FilterSidebarHelper.toggleAggregateItemSelected(action.payload, state.filterAggregateGroups);

      return {
        ...state,
        filterAggregateGroups: newAggGroups,
        selections: FilterSidebarHelper.buildSelections(newAggGroups)
      };
    }
    case fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET: {
      return {
        ...state,
        limitToPayMarket: !state.limitToPayMarket
      };
    }
    case fromFilterSidebarActions.LOAD_PAYMARKET_INFORMATION: {
        return {
          ...state,
          limitToPayMarket: true
        };
    }
    case fromFilterSidebarActions.LOAD_PAYMARKET_INFORMATION_SUCCESS: {
      return {
        ...state,
        payMarket: action.payload
      };
    }
    case fromFilterSidebarActions.CLEAR_ALL_SELECTIONS: {
      return {
        ...state,
        selections: initialState.selections,
        filterAggregateGroups: FilterSidebarHelper.clearAllSelections(state.filterAggregateGroups)
      };
    }
    case fromFilterSidebarActions.CLEAR_GROUP_SELECTIONS: {
      const newAggGroups = FilterSidebarHelper.clearGroupSelections(state.filterAggregateGroups, action.payload.MetaData.FilterProp);

      return {
        ...state,
        filterAggregateGroups: newAggGroups,
        selections: FilterSidebarHelper.buildSelections(newAggGroups)
      };
    }
    case fromFilterSidebarActions.LOAD_SYSTEM_FILTER_SUCCESS: {
      return {
        ...state,
        systemFilter: action.payload
      };
    }
    case fromFilterSidebarActions.LIMIT_TO_EXCHANGE: {
      return {
        ...state,
        systemFilter: {...state.systemFilter, ExchangeId: action.payload }
      };
    }
    case fromFilterSidebarActions.RESET_STATE: {
      return {
        ...initialState
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getFilterAggregateGroups = (state: State) => state.filterAggregateGroups;
export const getSelections = (state: State) => state.selections;
export const getLimitToPayMarket = (state: State) => state.limitToPayMarket;
export const getPayMarket = (state: State) => state.payMarket;
export const getPreviewLimit = (state: State) => state.previewLimit;
export const getSystemFilter = (state: State) => state.systemFilter;
