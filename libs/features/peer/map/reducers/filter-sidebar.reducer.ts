import { FilterAggregateGroup } from 'libs/models/peer/aggregate-filters/index';
import { PayMarket } from 'libs/models/paymarket/index';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import { FilterSidebarHelper } from '../helpers';
import { ExchangeJobPayMarketFilter } from '../../../../models';
import { ExcludedFilterAggregateGroup } from '../models';

// Extended entity state
export interface State {
  loading: boolean;
  loadingError: boolean;
  limitToPayMarket: boolean;
  payMarket: PayMarket;
  filterAggregateGroups: FilterAggregateGroup[];
  excludedFilterAggregateGroup: ExcludedFilterAggregateGroup[];
  selections: any;
  previewLimit: number;
  exchangeJobPayMarketFilter: ExchangeJobPayMarketFilter;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,
  limitToPayMarket: false,
  payMarket: null,
  filterAggregateGroups: [],
  excludedFilterAggregateGroup: [],
  selections: {},
  previewLimit: FilterSidebarHelper.PreviewLimit,
  exchangeJobPayMarketFilter: null
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
      const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(state.filterAggregateGroups,
        action.payload, state.excludedFilterAggregateGroup);

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
        selections: FilterSidebarHelper.buildSelections(newAggGroups, state.excludedFilterAggregateGroup)
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
        selections: FilterSidebarHelper.buildSelections(newAggGroups, state.excludedFilterAggregateGroup)
      };
    }
    case fromFilterSidebarActions.LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER_SUCCESS: {
      return {
        ...state,
        exchangeJobPayMarketFilter: action.payload
      };
    }
    case fromFilterSidebarActions.SET_EXCLUDED_AGGREGRATE_GROUPS: {
      return {
        ...state,
        excludedFilterAggregateGroup: action.payload,
        selections: FilterSidebarHelper.buildSelections([], action.payload)
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
export const getExchangeJobPayMarketFilter = (state: State) => state.exchangeJobPayMarketFilter;
