import {
  PayMarket,
  SystemFilter,
  ExchangeScopeItem, GeoCoordinates
} from 'libs/models';

import * as fromExchangeExplorerActions from '../actions/exchange-filter-context.actions';

// Extended entity state
export interface State {
  loading: boolean;
  loadingError: boolean;
  limitToPayMarket: boolean;
  includeUntaggedEmployees: boolean;
  excludeIndirectJobMatches: boolean;
  payMarket: PayMarket;
  systemFilter: SystemFilter;
  scopeSelection: ExchangeScopeItem;
  untaggedIncumbentCount: number;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,
  limitToPayMarket: false,
  payMarket: null,
  systemFilter: null,
  scopeSelection: null,
  includeUntaggedEmployees: false,
  excludeIndirectJobMatches: true,
  untaggedIncumbentCount: 0
};

// Reducer
export function reducer(state = initialState, action: fromExchangeExplorerActions.Actions): State {
  switch (action.type) {
    case fromExchangeExplorerActions.TOGGLE_LIMIT_TO_PAYMARKET: {
      return {
        ...state,
        limitToPayMarket: !state.limitToPayMarket
      };
    }
    case fromExchangeExplorerActions.TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES: {
      return {
        ...state,
        excludeIndirectJobMatches: !state.excludeIndirectJobMatches
      };
    }
    case fromExchangeExplorerActions.TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES: {
      return {
        ...state,
        includeUntaggedEmployees: !state.includeUntaggedEmployees
      };
    }
    case fromExchangeExplorerActions.LOAD_PAYMARKET_INFORMATION: {
      return {
        ...state,
        limitToPayMarket: true
      };
    }
    case fromExchangeExplorerActions.LOAD_PAYMARKET_INFORMATION_SUCCESS: {
      return {
        ...state,
        payMarket: action.payload
      };
    }
    case fromExchangeExplorerActions.LOAD_SYSTEM_FILTER_SUCCESS: {
      return {
        ...state,
        systemFilter: action.payload
      };
    }
    case fromExchangeExplorerActions.LIMIT_TO_EXCHANGE: {
      return {
        ...state,
        includeUntaggedEmployees: true,
        systemFilter: {...state.systemFilter, ExchangeId: action.payload }
      };
    }
    case fromExchangeExplorerActions.APPLY_CUT_CRITERIA: {
      // TODO: Editing Cuts
      // const cutCriteria: PeerMapScopeSystemSideBarInfo = action.payload;
      // const systemFilter = cutCriteria.SystemFilter;
      // const aggSelections = FilterSidebarHelper.mapAggregateGroupSelections(cutCriteria.FilterAggregateSelections);
      // const limitingToExchange = systemFilter && !!systemFilter.ExchangeId;
      // const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(
      //   aggSelections, cutCriteria.FilterAggregateGroups, limitingToExchange);
      return {
        ...state,
        // limitToPayMarket: cutCriteria.LimitToPayMarket,
        // payMarket: cutCriteria.PayMarket,
        // systemFilter: cutCriteria.SystemFilter,
        // selections: cutCriteria.Selections,
        // selectionsCount: cutCriteria.SelectionsCount,
        // filterAggregateGroups: newAggGroups,
        // includeUntaggedEmployees: cutCriteria.IncludeUntaggedIncumbents,
        // excludeIndirectJobMatches: !cutCriteria.IsFilteredBySimilarExchangeJobIds
      };
    }
    case fromExchangeExplorerActions.APPLY_SCOPE_CRITERIA: {

      // TODO: Applying Scopes
      // const cutCriteria: PeerMapScopeSideBarInfo = action.payload;
      // const aggSelections = FilterSidebarHelper.mapAggregateGroupSelections(cutCriteria.FilterAggregateSelections);
      // const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(
      //   aggSelections, cutCriteria.FilterAggregateGroups, false);
      return {
        ...state,
        // selections: cutCriteria.Selections,
        // selectionsCount: cutCriteria.SelectionsCount,
        // filterAggregateGroups: newAggGroups,
        // includeUntaggedEmployees: cutCriteria.IncludeUntaggedIncumbents
      };
    }
    case fromExchangeExplorerActions.SET_EXCHANGE_SCOPE_SELECTION: {
      return {
        ...state,
        scopeSelection: action.payload
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
export const getPayMarket = (state: State) => state.payMarket;
export const getSystemFilter = (state: State) => state.systemFilter;
export const getScopeSelection = (state: State) => state.scopeSelection;
export const getCountUntaggedIncumbents = (state: State) => state.untaggedIncumbentCount;
export const getLimitToPayMarket = (state: State) => state.limitToPayMarket;
export const getIncludeUntaggedIncumbents = (state: State) => state.includeUntaggedEmployees;
export const getExcludeIndirectJobMatches = (state: State) => state.excludeIndirectJobMatches;
export const getHasSimilarJobLevels = (state: State) => state.systemFilter && state.systemFilter.SimilarExchangeJobIds
  && state.systemFilter.SimilarExchangeJobIds.some(x => !state.systemFilter.ExchangeJobIds.includes(x));

export const getFilterContext = (state: State) => {
return {
  ...state.systemFilter,
  PayMarket: state.payMarket,
  LimitToPayMarket: state.limitToPayMarket,
  IncludeUntaggedIncumbents: state.includeUntaggedEmployees,
  IsFilteredBySimilarExchangeJobIds: state.excludeIndirectJobMatches
};
};
