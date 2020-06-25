import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as communitySearchActions from '../actions/community-search.actions';

import { CommunityPost } from 'libs/models/community';

export interface State extends EntityState<CommunityPost> {
  loading: boolean;
  loadingError: boolean;
  searchResultModalPostId: any;
  loadingMoreSearchResults: boolean;
  pagingOptions: any;
  totalSearchResultsOnServer: number;
}

export const adapter: EntityAdapter<CommunityPost> = createEntityAdapter<CommunityPost>({
  selectId: (communityPost: CommunityPost) => communityPost.Id
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  searchResultModalPostId: null,
  loadingMoreSearchResults: false,
  pagingOptions: {
    From: 0,
    Count: 20
  },
  totalSearchResultsOnServer: 0
});

export function reducer(state = initialState, action: communitySearchActions.Actions): State {
  switch (action.type) {
    case communitySearchActions.SEARCHING_COMMUNITY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        pagingOptions: {...state.pagingOptions, From: 0},
      };
    }
    case communitySearchActions.SEARCHING_COMMUNITY_SUCCESS: {
      return {
        ...adapter.setAll(action.payload.CommunitySearchResults, state),
        loading: false,
        totalSearchResultsOnServer: action.payload.Paging.TotalRecordCount
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

    case communitySearchActions.GETTING_MORE_COMMUNITY_SEARCH_RESULTS: {
      return {
        ...state,
        loadingError: false,
        loadingMoreSearchResults: true,
        pagingOptions: {...state.pagingOptions, From: state.pagingOptions.From + 15}
      };
    }
    case communitySearchActions.GETTING_MORE_COMMUNITY_SEARCH_RESULTS_SUCCESS: {
      return {
        ...adapter.addMany(action.payload.CommunitySearchResults, state),
        loadingMoreSearchResults: false
      };
    }
    case communitySearchActions.GETTING_MORE_COMMUNITY_SEARCH_RESULTS_ERROR: {
      return {
        ...state,
        loadingError: true,
        loadingMoreSearchResults: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingSearchResults = (state: State) => state.loading;
export const getLoadingSearchResultsError = (state: State) => state.loadingError;
export const getSearchResultModalPostId = (state: State) => state.searchResultModalPostId;
export const getLoadingMoreSearchResults = (state: State) => state.loadingMoreSearchResults;
export const getSearchResultsPagingOptions = (state: State) => state.pagingOptions;
export const getTotalSearchResultsOnServer = (state: State) => state.totalSearchResultsOnServer;
