import { ExchangeDataSearchFilterContext, ExchangeScopeItem } from 'libs/models';

import * as fromExchangeExplorerActions from '../actions/exchange-filter-context.actions';

// Extended entity state
export interface State extends ExchangeDataSearchFilterContext {
  hasBeenSet: boolean;
  selectedScope: ExchangeScopeItem;
}

// Initial State
export const initialState: State = {
  hasBeenSet: false,
  selectedScope: null,

  ClusterPrecision: 0,
  ZoomLevel: 0,
  BottomRight: undefined,
  TopLeft: undefined,

  ExchangeId: 0,
  ExchangeJobId: 0,
  LockedExchangeJobId: 0,
  ExchangeJobIds: [],
  IncludeUntaggedIncumbents: false,
  IsFilteredBySimilarExchangeJobIds: false,
  LimitToPayMarket: false,
  PayMarketLocation: null,
  ScopeGUID: null,
  SimilarExchangeJobIds: []
};

// Reducer
export function reducer(state = initialState, action: fromExchangeExplorerActions.Actions): State {
  switch (action.type) {
    case fromExchangeExplorerActions.SET_FILTER_CONTEXT:
    case fromExchangeExplorerActions.SET_FILTER_CONTEXT_SILENTLY: {
      const filterContext: ExchangeDataSearchFilterContext = action.payload;
      return {
        ...state,
        ...filterContext,
        hasBeenSet: true
      };
    }
    case fromExchangeExplorerActions.TOGGLE_LIMIT_TO_PAYMARKET: {
      return {
        ...state,
        LimitToPayMarket: !state.LimitToPayMarket
      };
    }
    case fromExchangeExplorerActions.TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES: {
      return {
        ...state,
        IsFilteredBySimilarExchangeJobIds: !state.IsFilteredBySimilarExchangeJobIds
      };
    }
    case fromExchangeExplorerActions.TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES: {
      return {
        ...state,
        IncludeUntaggedIncumbents: !state.IncludeUntaggedIncumbents
      };
    }
    case fromExchangeExplorerActions.SET_EXCHANGE_SCOPE_SELECTION: {
      return {
        ...state,
        selectedScope: action.payload,
        ScopeGUID: action.payload.Id
      };
    }
    case fromExchangeExplorerActions.CLEAR_EXCHANGE_SCOPE_SELECTION: {
      return {
        ...state,
        selectedScope: null,
        ScopeGUID: null
      };
    }
    case fromExchangeExplorerActions.SET_EXCHANGE_JOB_SELECTION: {
      return {
        ...state,
        ExchangeJobIds: [action.payload.exchangeJobId],
        ExchangeJobId: action.payload.exchangeJobId,
        SimilarExchangeJobIds: action.payload.similarExchangeJobIds,
        selectedScope: null,
        ScopeGUID: null
      };
    }
    case fromExchangeExplorerActions.RESET_STATE: {
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
export const getHasAppliedContext = (state: State) => state.hasBeenSet;
export const getScopeSelection = (state: State) => state.selectedScope;
export const getLimitToPayMarket = (state: State) => state.LimitToPayMarket;
export const getIncludeUntaggedIncumbents = (state: State) => state.IncludeUntaggedIncumbents;
export const getExcludeIndirectJobMatches = (state: State) => !state.IsFilteredBySimilarExchangeJobIds;
export const getHasSimilarJobLevels = (state: State) => {
  if (!state.SimilarExchangeJobIds) {
    return false;
  }

  return state.SimilarExchangeJobIds.some(x => !!state.ExchangeJobIds && !state.ExchangeJobIds.includes(x));
};
export const getFilterContext = (state: State) => {
  const filterContext: ExchangeDataSearchFilterContext = {
    ...state
  };
  return filterContext;
};
