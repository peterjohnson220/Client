import * as fromUpsertActions from '../actions';

export interface State {
  upsertingDataCut: boolean;
  upsertingDataCutError: boolean;
  pageInViewInIframe: boolean;
}

// Initial State
export const initialState: State = {
  upsertingDataCut: false,
  upsertingDataCutError: false,
  pageInViewInIframe: false,
};

// Reducer
export function reducer(
  state = initialState,
  action: fromUpsertActions.UpsertPeerDataCutActions
): State {
  switch (action.type) {
    case fromUpsertActions.UPSERT_DATA_CUT: {
      return {
        ...state,
        upsertingDataCut: true,
        upsertingDataCutError: false
      };
    }
    case fromUpsertActions.UPSERT_DATA_CUT_SUCCESS: {
      return {
        ...state,
        upsertingDataCut: false,
        upsertingDataCutError: false
      };
    }
    case fromUpsertActions.UPSERT_DATA_CUT_ERROR: {
      return {
        ...state,
        upsertingDataCut: false,
        upsertingDataCutError: true
      };
    }
    case fromUpsertActions.CANCEL_UPSERT_DATA_CUT: {
      return {
        ...state,
        upsertingDataCut: false,
        upsertingDataCutError: false
      };
    }
    case fromUpsertActions.PAGE_IN_VIEW_IN_IFRAME: {
      return {
        ...state,
        pageInViewInIframe: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getUpsertingDataCut = (state: State) => state.upsertingDataCut;
export const getUpsertingDataCutError = (state: State) => state.upsertingDataCutError;
export const getPageInViewInIframe = (state: State) => state.pageInViewInIframe;
