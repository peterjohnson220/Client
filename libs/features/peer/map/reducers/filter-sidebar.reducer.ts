import * as cloneDeep from 'lodash.clonedeep';

import {
  PayMarket, PeerMapScopeSystemSideBarInfo, SystemFilter,
  ExchangeScopeItem, PeerMapScopeSideBarInfo, FilterAggregateGroup,
  ToggleAggregateGroupSelections, PeerFilterEnum
} from 'libs/models';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import { FilterSidebarHelper } from '../helpers';
import { ExchangeJobExchangeDetail } from '../../models';

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
  selectionsCount: number;
  scopeSelection: ExchangeScopeItem;
  includeUntaggedEmployees: boolean;
  excludeIndirectJobMatches: boolean;
  associatedExchangeJobs: ExchangeJobExchangeDetail[];
  lockedExchangeJobExchangeDetail: ExchangeJobExchangeDetail;
  searchingAggregate: boolean;
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
  systemFilter: null,
  selectionsCount: 0,
  scopeSelection: null,
  includeUntaggedEmployees: false,
  excludeIndirectJobMatches: true,
  associatedExchangeJobs: [],
  searchingAggregate: false,
  lockedExchangeJobExchangeDetail: null
};

// Reducer
export function reducer(state = initialState, action: fromFilterSidebarActions.Actions): State {
  switch (action.type) {
    case fromFilterSidebarActions.LOAD_FILTER_AGGREGATES: {
      return {
        ...state,
        loading: true
      };
    }
    case fromFilterSidebarActions.LOAD_FILTER_AGGREGATES_SUCCESS: {
      const limitingToExchange = state.systemFilter && !!state.systemFilter.ExchangeId;
      const serverAggGroups = action.payload.aggregateGroups;
      const shouldReplaceAggs = action.payload.shouldReplaceAggs;
      const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(
        state.filterAggregateGroups, serverAggGroups, limitingToExchange, shouldReplaceAggs);

      return {
        ...state,
        filterAggregateGroups: newAggGroups,
        loading: false
      };
    }
    case fromFilterSidebarActions.LOAD_FILTER_AGGREGATES_ERROR: {
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
        selections: FilterSidebarHelper.buildSelections(newAggGroups),
        selectionsCount: FilterSidebarHelper.getSelectionsCount(newAggGroups),
        scopeSelection: null
      };
    }
    case fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET: {
      return {
        ...state,
        limitToPayMarket: !state.limitToPayMarket
      };
    }
    case fromFilterSidebarActions.TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES: {
      return {
        ...state,
        excludeIndirectJobMatches: !state.excludeIndirectJobMatches
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
        filterAggregateGroups: FilterSidebarHelper.clearAllSelections(state.filterAggregateGroups),
        selectionsCount: initialState.selectionsCount,
        scopeSelection: null
      };
    }
    case fromFilterSidebarActions.TOGGLE_GROUP_SELECTIONS: {
      const toggleGroupSelectionsPayload: ToggleAggregateGroupSelections = action.payload;
      const newAggGroupSelections = FilterSidebarHelper.toggleGroupOptions(
        state.filterAggregateGroups,
        toggleGroupSelectionsPayload.FilterProp,
        toggleGroupSelectionsPayload.ShouldSelect
      );

      return {
        ...state,
        filterAggregateGroups: newAggGroupSelections,
        selections: FilterSidebarHelper.buildSelections(newAggGroupSelections),
        selectionsCount: FilterSidebarHelper.getSelectionsCount(newAggGroupSelections),
        scopeSelection: null
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
        includeUntaggedEmployees: true,
        systemFilter: {...state.systemFilter, ExchangeId: action.payload }
      };
    }
    case fromFilterSidebarActions.RESET_STATE: {
      return {
        ...initialState
      };
    }
    case fromFilterSidebarActions.APPLY_CUT_CRITERIA: {
      const cutCriteria: PeerMapScopeSystemSideBarInfo = action.payload;
      const systemFilter = cutCriteria.SystemFilter;
      const aggSelections = FilterSidebarHelper.mapAggregateGroupSelections(cutCriteria.FilterAggregateSelections);
      const limitingToExchange = systemFilter && !!systemFilter.ExchangeId;
      const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(
        aggSelections, cutCriteria.FilterAggregateGroups, limitingToExchange, true, true);
      return {
        ...state,
        limitToPayMarket: cutCriteria.LimitToPayMarket,
        payMarket: cutCriteria.PayMarket,
        systemFilter: cutCriteria.SystemFilter,
        selections: cutCriteria.Selections,
        selectionsCount: cutCriteria.SelectionsCount,
        filterAggregateGroups: newAggGroups,
        includeUntaggedEmployees: cutCriteria.IncludeUntaggedIncumbents,
        excludeIndirectJobMatches: !cutCriteria.IsFilteredBySimilarExchangeJobIds,
        searchingAggregate: false,
        scopeSelection: cutCriteria.SelectedExchangeScope,
        lockedExchangeJobExchangeDetail: !!systemFilter.LockedExchangeJobId ? cutCriteria.LockedExchangeJobExchangeDetail : null
      };
    }
    case fromFilterSidebarActions.APPLY_SCOPE_CRITERIA: {
      const cutCriteria: PeerMapScopeSideBarInfo = action.payload;
      const aggSelections = FilterSidebarHelper.mapAggregateGroupSelections(cutCriteria.FilterAggregateSelections);
      const newAggGroups = FilterSidebarHelper.mergeServerAggregatesWithSelected(
        aggSelections, cutCriteria.FilterAggregateGroups, false, true, true);
      return {
        ...state,
        selections: cutCriteria.Selections,
        selectionsCount: cutCriteria.SelectionsCount,
        filterAggregateGroups: newAggGroups,
        includeUntaggedEmployees: cutCriteria.IncludeUntaggedIncumbents,
        searchingAggregate: false
      };
    }
    case fromFilterSidebarActions.SET_EXCHANGE_SCOPE_SELECTION: {
      return {
        ...state,
        scopeSelection: action.payload
      };
    }
    case fromFilterSidebarActions.SET_EXCHANGE_JOB_SELECTION: {
      const systemFilter = {
        ...state.systemFilter,
        ExchangeJobIds: [action.payload.exchangeJobId],
        ExchangeJobId: action.payload.exchangeJobId,
        SimilarExchangeJobIds: action.payload.similarExchangeJobIds,
        SelectedExchangeScope: null
      };
      return {
        ...state,
        systemFilter: systemFilter
      };
    }
    case fromFilterSidebarActions.TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES: {
      return {
        ...state,
        includeUntaggedEmployees: !state.includeUntaggedEmployees
      };
    }
    case fromFilterSidebarActions.LOAD_ASSOCIATED_EXCHANGE_JOBS_SUCCESS: {
      return {
        ...state,
        associatedExchangeJobs: action.payload
      };
    }
    case fromFilterSidebarActions.TOGGLE_AGGREGATE_SEARCH: {
      const filterAggregateId = action.payload;
      const searching = !state.searchingAggregate;

      const newFilterAggregateGroups = cloneDeep(state.filterAggregateGroups).map(g => {
        g.IsSearching = searching && g.MetaData.Id === filterAggregateId;

        return g;
      });

      return {
        ...state,
        searchingAggregate: searching,
        filterAggregateGroups: newFilterAggregateGroups
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
export const getFilterAggregateGroups = (state: State) => state.filterAggregateGroups.filter(
  g => g.MetaData.IncludeInFilterSideBar
);
export const getCountUntaggedIncumbents = (state: State) => {
  const aggItem = state.filterAggregateGroups.find(g => g.MetaData.PeerFilter === PeerFilterEnum.UntaggedIncumbents);
  if (!aggItem || aggItem.Aggregates.length === 0) {
    return 0;
  }

  return aggItem.Aggregates.map(agg => agg.Count).reduce((sum, currentAggCount) => sum + currentAggCount);
};
export const getSelections = (state: State) => state.selections;
export const getLimitToPayMarket = (state: State) => state.limitToPayMarket;
export const getPayMarket = (state: State) => state.payMarket;
export const getPreviewLimit = (state: State) => state.previewLimit;
export const getSystemFilter = (state: State) => state.systemFilter;
export const getSelectionsCount = (state: State) => state.selectionsCount;
export const getScopeSelection = (state: State) => state.scopeSelection;
export const getIncludeUntaggedIncumbents = (state: State) => state.includeUntaggedEmployees;
export const getExcludeIndirectJobMatches = (state: State) => state.excludeIndirectJobMatches;
export const getHasSimilarJobLevels = (state: State) => state.systemFilter && state.systemFilter.SimilarExchangeJobIds
  && state.systemFilter.SimilarExchangeJobIds.some(x => !(state.systemFilter.ExchangeJobIds.indexOf(x) > -1));
export const getAssociatedExchangeJobs = (state: State) => {
  const isLockedToExchangeJob = !!state.systemFilter && !!state.systemFilter.LockedExchangeJobId && !!state.lockedExchangeJobExchangeDetail;
  return isLockedToExchangeJob ? [state.lockedExchangeJobExchangeDetail] : state.associatedExchangeJobs;
};
export const getSearchingAggregate = (state: State) => state.searchingAggregate;
