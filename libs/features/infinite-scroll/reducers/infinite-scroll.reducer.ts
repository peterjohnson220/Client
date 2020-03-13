import { ResultsPagingOptions } from '../../search/models';
import * as fromInfiniteScrollActions from '../actions';

export interface InfiniteScrollState {
  loading: boolean;
  loadingMore: boolean;
  pagingOptions: ResultsPagingOptions;
  lastReturnedCount: number;
  error: boolean;
}
export interface State {
  scrolls: { [key: string]: InfiniteScrollState };
}

const INITIAL_STATE: State = {
  scrolls: {}
};

export const DEFAULT_PAGING_OPTIONS: ResultsPagingOptions = {
  page: 1,
  pageSize: 30
};
const DEFAULT_INFINITE_SCROLL_STATE: InfiniteScrollState = {
  loading: false,
  loadingMore: false,
  pagingOptions: DEFAULT_PAGING_OPTIONS,
  lastReturnedCount: 0,
  error: false
};

export function reducer(state = INITIAL_STATE, action: fromInfiniteScrollActions.Actions): State {
  const actionPayload = <any>action.payload;
  switch (action.type) {
    case fromInfiniteScrollActions.LOAD: {
      return {
        ...state,
        scrolls: {
          ...state.scrolls,
          [actionPayload.scrollId]: {
            ...DEFAULT_INFINITE_SCROLL_STATE,
            loading: true,
            pagingOptions: DEFAULT_PAGING_OPTIONS
          }
        }
      };
    }
    case fromInfiniteScrollActions.LOAD_SUCCESS: {
      return {
        ...state,
        scrolls: {
          ...state.scrolls,
          [actionPayload.scrollId]: {
            ...state.scrolls[actionPayload.scrollId],
            loading: false,
            lastReturnedCount: actionPayload.lastReturnedCount
          }
        }
      };
    }
    case fromInfiniteScrollActions.LOAD_MORE: {
      const currentScrollState = state.scrolls[actionPayload.scrollId];
      return {
        ...state,
        scrolls: {
          ...state.scrolls,
          [actionPayload.scrollId]: {
            ...currentScrollState,
            error: false,
            loadingMore: true,
            pagingOptions: {...currentScrollState.pagingOptions, page: currentScrollState.pagingOptions.page + 1}
          }
        }
      };
    }
    case fromInfiniteScrollActions.LOAD_MORE_SUCCESS: {
      return {
        ...state,
        scrolls: {
          ...state.scrolls,
          [actionPayload.scrollId]: {
            ...state.scrolls[actionPayload.scrollId],
            lastReturnedCount: actionPayload.lastReturnedCount,
            loadingMore: false
          }
        }
      };
    }
    case fromInfiniteScrollActions.CLEAR: {
      return {
        ...state,
        scrolls: {
          ...state.scrolls,
          [actionPayload.scrollId]: {
            ...state.scrolls[actionPayload.scrollId]
          }
        }
      };
    }
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getScroll = (state: State, scrollId: string) => state.scrolls[scrollId];
export const getLoading = (state: State, scrollId: string) => state.scrolls[scrollId] ? state.scrolls[scrollId].loading : null;
export const getLoadingMore = (state: State, scrollId: string) => state.scrolls[scrollId] ? state.scrolls[scrollId].loadingMore : null;
export const getPagingOptions = (state: State, scrollId: string) => state.scrolls[scrollId] ? state.scrolls[scrollId].pagingOptions : null;
export const getHasAllResults = (state: State, scrollId: string) => hasAllResults(state, scrollId);
export const getError = (state: State, scrollId: string) => state.scrolls[scrollId] ? state.scrolls[scrollId].error : null;

function hasAllResults(state: State, scrollId: string): boolean {
  const scroll = state.scrolls[scrollId];
  if (!scroll) {
    return null;
  }

  return scroll.lastReturnedCount < scroll.pagingOptions.pageSize;
}
