import { UserFilterTypeData } from 'libs/features/user-filter/models';

import * as fromSearchPageActions from '../actions/search-page.actions';
import { SearchFilterMappingDataObj } from '../models';
import { SearchFeatureIds } from '../enums/search-feature-ids';

export interface State {
  pageShown: boolean;
  searchingFilter: boolean;
  searchingChildFilter: boolean;
  searchFilterMappingData: SearchFilterMappingDataObj;
  searchFeatureId: SearchFeatureIds;
  userFilterTypeData: UserFilterTypeData;
}

const initialState: State = {
  pageShown: false,
  searchingFilter: false,
  searchingChildFilter: false,
  searchFilterMappingData: null,
  searchFeatureId: null,
  userFilterTypeData: null
};

// Reducer function
export function reducer(state = initialState, action: fromSearchPageActions.Actions): State {
  switch (action.type) {
    case fromSearchPageActions.SET_SEARCH_FEATURE_ID: {
      return {
        ...state,
        searchFeatureId: action.payload,
      };
    }
    case fromSearchPageActions.SET_SEARCH_FILTER_MAPPING_DATA: {
      return {
        ...state,
        searchFilterMappingData: action.payload,
      };
    }
    case fromSearchPageActions.SET_USER_FILTER_TYPE_DATA: {
      return {
        ...state,
        userFilterTypeData: action.payload,
      };
    }
    case fromSearchPageActions.CLOSE_SEARCH_PAGE: {
      return {
        ...state,
        pageShown: false,
      };
    }
    case fromSearchPageActions.HIDE_PAGE: {
      return {
        ...state,
        pageShown: false,
      };
    }
    case fromSearchPageActions.TOGGLE_CHILD_FILTER_SEARCH: {
      return {
        ...state,
        searchingChildFilter: !state.searchingChildFilter,
      };
    }
    case fromSearchPageActions.SHOW_PAGE: {
      return {
        ...state,
        pageShown: true,
      };
    }
    case fromSearchPageActions.TOGGLE_FILTER_SEARCH: {
      return {
        ...state,
        searchingFilter: !state.searchingFilter
      };
    }
    case fromSearchPageActions.HIDE_FILTER_SEARCH: {
      return {
        ...state,
        searchingFilter: false
      };
    }
    case fromSearchPageActions.HIDE_CHILD_FILTER_SEARCH: {
      return {
        ...state,
        searchingChildFilter: false
      };
    }
    case fromSearchPageActions.RESET: {
      return initialState;
    }
    case fromSearchPageActions.SET: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getSearchFeatureId = (state: State) => state.searchFeatureId;
export const getSearchFilterMappingData = (state: State) => state.searchFilterMappingData;
export const getUserFilterTypeData = (state: State) => state.userFilterTypeData;
export const getPageShown = (state: State) => state.pageShown;
export const getSearchingFilter = (state: State) => state.searchingFilter;
export const getSearchingChildFilter = (state: State) => state.searchingChildFilter;
