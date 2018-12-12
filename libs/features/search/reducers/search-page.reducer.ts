import * as fromSearchPageActions from '../actions/search-page.actions';

export interface State {
  pageShown: boolean;
  searchingFilter: boolean;
}

const initialState: State = {
  pageShown: false,
  searchingFilter: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchPageActions.Actions): State {
  switch (action.type) {
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
    default: {
      return state;
    }
  }
}

// Selector functions
export const getPageShown = (state: State) => state.pageShown;
export const getSearchingFilter = (state: State) => state.searchingFilter;
