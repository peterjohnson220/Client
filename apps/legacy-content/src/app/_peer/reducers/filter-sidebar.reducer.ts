import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { FilterAggregateGroup } from 'libs/models/peer/aggregate-filters';
import { FilterAggregateSelections } from 'libs/models/peer';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';

// Extended entity state
export interface State extends EntityState<FilterAggregateGroup> {
  loading: boolean;
  loadingError: boolean;
  limitToPayMarket: boolean;
  payMarket: any;
  selections: FilterAggregateSelections;
}

// Create entity adapter
export const adapter: EntityAdapter<FilterAggregateGroup> = createEntityAdapter<FilterAggregateGroup>({
  selectId: (filter: FilterAggregateGroup) => filter.MetaData.PeerFilter
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  limitToPayMarket: true,
  payMarket: null,
  selections: {
    Exchanges: [],
    States: [],
    Cities: [],
    Companies: [],
    CompanyIndustries: [],
    ExchangeJobFamilies: [],
    ExchangeJobLevels: [],
    ExchangeJobFLSAStatuses: []
  }
});

// Reducer
export function reducer(state = initialState, action: fromFilterSidebarActions.Actions): State {
  switch (action.type) {
    case fromFilterSidebarActions.LOADING_FILTER_AGGREGATES: {
      return {
        ...adapter.removeAll(state),
        loading: true
      };
    }
    case fromFilterSidebarActions.LOADING_FILTER_AGGREGATES_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
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
      const selectionInfo = action.payload;

      // Make a new selections object and group array (immutable)
      const selectionsCopy = { ...state.selections };
      let selectionsGroupCopy = [...selectionsCopy[selectionInfo.AggregateGroup]];

      // If aggregate item exists, filter it out, otherwise add it to selection group
      if (selectionsGroupCopy.some(s => s === selectionInfo.AggregateItem)) {
        selectionsGroupCopy = selectionsGroupCopy.filter(s => s !== selectionInfo.AggregateItem);
      } else {
        selectionsGroupCopy.push(selectionInfo.AggregateItem);
      }

      // Overwrite selection group
      selectionsCopy[selectionInfo.AggregateGroup] = selectionsGroupCopy;

      return {
        ...state,
        selections: selectionsCopy
      };
    }
    case fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET: {
      return {
        ...state,
        limitToPayMarket: !state.limitToPayMarket
      };
    }
    case fromFilterSidebarActions.LOAD_PAYMARKET_INFORMATION_SUCCESS: {
      return {
        ...state,
        payMarket: action.payload
      };
    }
    case fromFilterSidebarActions.CLEAR_SELECTIONS: {
      return {
        ...state,
        selections: initialState.selections
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
export const getSelections = (state: State) => state.selections;
export const getLimitToPayMarket = (state: State) => state.limitToPayMarket;
export const getPayMarket = (state: State) => state.payMarket;
