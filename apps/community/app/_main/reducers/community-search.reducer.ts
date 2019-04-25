import * as communitySearchActions from '../actions/community-search.actions';
import { CommunitySearchResult, CommunityPost } from 'libs/models/community';

export interface State {
  loading: boolean;
  loadingError: boolean;
  entities: CommunitySearchResult[];
  searchResultModalPostId: any;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  entities: [],
  searchResultModalPostId: null
};

export function reducer(state = initialState, action: communitySearchActions.Actions): State {
  switch (action.type) {
    case communitySearchActions.SEARCHING_COMMUNITY: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case communitySearchActions.SEARCHING_COMMUNITY_SUCCESS: {
      return {
        ...state,
        loading: false,
        entities: action.payload
      };
    }
    case communitySearchActions.SEARCHING_COMMUNITY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communitySearchActions.OPEN_SEARCH_RESULT_MODAL: {
      return {
        ...state,
        searchResultModalPostId: action.payload
      };
    }
    case communitySearchActions.CLOSE_SEARCH_RESULT_MODAL: {
      return {
        ...state,
        searchResultModalPostId: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingSearchResults = (state: State) => state.loading;
export const getLoadingSearchResultsError = (state: State) => state.loadingError;
export const getSearchResults = (state: State) => state.entities;
export const getSearchResultModalPostId = (state: State) => state.searchResultModalPostId;
