import * as fromUpsertDataCutPageActions from '../actions/upsert-data-cut-page.actions';

export interface State {
  upsertingDataCut: boolean;
  upsertingDataCutError: boolean;
  pageInViewInIframe: boolean;
  loadingDataCutDetails: boolean;
  loadingDataCutError: boolean;
}

// Initial State
export const initialState: State = {
  upsertingDataCut: false,
  upsertingDataCutError: false,
  pageInViewInIframe: false,
  loadingDataCutDetails: false,
  loadingDataCutError: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromUpsertDataCutPageActions.Actions
): State {
  switch (action.type) {
    case fromUpsertDataCutPageActions.UPSERT_DATA_CUT: {
      return {
        ...state,
        upsertingDataCut: true,
        upsertingDataCutError: false
      };
    }
    case fromUpsertDataCutPageActions.UPSERT_DATA_CUT_SUCCESS: {
      return {
        ...state,
        upsertingDataCut: false,
        upsertingDataCutError: false
      };
    }
    case fromUpsertDataCutPageActions.UPSERT_DATA_CUT_ERROR: {
      return {
        ...state,
        upsertingDataCut: false,
        upsertingDataCutError: true
      };
    }
    case fromUpsertDataCutPageActions.CANCEL_UPSERT_DATA_CUT: {
      return {
        ...state,
        upsertingDataCut: false,
        upsertingDataCutError: false
      };
    }
    case fromUpsertDataCutPageActions.PAGE_IN_VIEW_IN_IFRAME: {
      return {
        ...state,
        pageInViewInIframe: true
      };
    }
    case fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS: {
      return {
        ...state,
        loadingDataCutDetails: true,
        loadingDataCutError: false
      };
    }
    case fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS_SUCCESS: {
      return {
        ...state,
        loadingDataCutDetails: false,
        pageInViewInIframe: true
      };
    }
    case fromUpsertDataCutPageActions.LOAD_DATA_CUT_DETAILS_ERROR: {
      return {
        ...state,
        loadingDataCutDetails: false,
        loadingDataCutError: true
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
export const getLoadingDataCutDetails = (state: State) => state.loadingDataCutDetails;
export const getLoadingDataCutDetailsError = (state: State) => state.loadingDataCutError;
