import { ExchangeDataSearchFilterContext, ExchangeScopeItem } from 'libs/models';
import { WeightType } from 'libs/data/data-sets';

import * as fromExchangeExplorerActions from '../actions/exchange-filter-context.actions';

// Extended entity state
export interface State extends Partial<ExchangeDataSearchFilterContext> {
  hasBeenSet: boolean;
  selectedScope: ExchangeScopeItem;
  hasDefaultScope: boolean;
}

// Initial State
export const initialState: State = {
  hasBeenSet: false,
  hasDefaultScope: false,
  selectedScope: null,
  ExchangeId: 0,
  ExchangeJobId: 0,
  LockedExchangeJobId: 0,
  ExchangeJobIds: [],
  IncludeUntaggedIncumbents: false,
  IsFilteredBySimilarExchangeJobIds: false,
  LimitToPayMarket: false,
  PayMarketLocation: null,
  ScopeGUID: null,
  SimilarExchangeJobIds: [],
  WeightingType: WeightType.Inc
};

export let initialLoadCompleteState: State = null;

// Reducer
export function reducer(state = initialState, action: fromExchangeExplorerActions.Actions): State {
  switch (action.type) {
    case fromExchangeExplorerActions.SET_FILTER_CONTEXT: {
      const filterContext: ExchangeDataSearchFilterContext = action.payload;
      const defaultScopeId = (<any>action).defaultScopeId;
      const hasDefaultScope = state.ScopeGUID === defaultScopeId;
      const scopeGuid = hasDefaultScope ? defaultScopeId : filterContext.ScopeGUID;
      const newState = {
        ...state,
        ...filterContext,
        hasBeenSet: true,
        hasDefaultScope: hasDefaultScope,
        ScopeGUID: scopeGuid
      };

      if (!initialLoadCompleteState) {
        initialLoadCompleteState = newState;
      }

      return newState;
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
        hasDefaultScope: action.payload.IsDefault,
        ScopeGUID: action.payload.ExchangeScopeGuid
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
      initialLoadCompleteState = null;
      return {
        ...initialState
      };
    }
    case fromExchangeExplorerActions.RESET_INITIALLY_LOADED_STATE: {
      return !!initialLoadCompleteState ? {...initialLoadCompleteState} : {...state};
    }
    case fromExchangeExplorerActions.SET_WEIGHTING_TYPE: {
      return {
        ...state,
        WeightingType: action.payload.weightingType
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getHasAppliedContext = (state: State) => state.hasBeenSet;
export const getScopeGuid = (state: State) => state.ScopeGUID;
export const getLimitToPayMarket = (state: State) => state.LimitToPayMarket;
export const getIncludeUntaggedIncumbents = (state: State) => state.IncludeUntaggedIncumbents;
export const getExcludeIndirectJobMatches = (state: State) => !state.IsFilteredBySimilarExchangeJobIds;
export const getHasSimilarJobLevels = (state: State) => {
  if (!state.SimilarExchangeJobIds) {
    return false;
  }

  if (!!state.ExchangeJobId) {
    return state.SimilarExchangeJobIds.some(x => x !== state.ExchangeJobId);
  }
  // TODO: ExchangeJobIds should be deprecated in favor of ExchangeJobId [JP]
  return state.SimilarExchangeJobIds.some(x => !!state.ExchangeJobIds && !state.ExchangeJobIds.includes(x));
};
export const getFilterContext = (state: State) => {
  const filterContext: Partial<ExchangeDataSearchFilterContext> = {
    ...state
  };
  return filterContext;
};
export const getWeightingType = (state: State) => state.WeightingType;
export const getHasDefaultScope = (state: State) => state.hasDefaultScope;
