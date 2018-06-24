import * as fromAddDataCutPageActions from '../actions/add-data-cut-page.actions';

export interface State {
  addingDataCut: boolean;
  addingDataCutError: boolean;
  pageInViewInIframe: boolean;
  loadingDataCutDetails: boolean;
  loadingDataCutError: boolean;
  updatingDataCut: boolean;
  updatingDataCutError: boolean;
}

// Initial State
export const initialState: State = {
  addingDataCut: false,
  addingDataCutError: false,
  pageInViewInIframe: false,
  loadingDataCutDetails: false,
  loadingDataCutError: false,
  updatingDataCut: false,
  updatingDataCutError: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromAddDataCutPageActions.Actions
): State {
  switch (action.type) {
    case fromAddDataCutPageActions.ADDING_DATA_CUT: {
      return {
        ...state,
        addingDataCut: true,
        addingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.ADDING_DATA_CUT_SUCCESS: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.ADDING_DATA_CUT_ERROR: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: true
      };
    }
    case fromAddDataCutPageActions.CANCEL_ADD_DATA_CUT: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.PAGE_IN_VIEW_IN_IFRAME: {
      return {
        ...state,
        pageInViewInIframe: true
      };
    }
    case fromAddDataCutPageActions.LOAD_DATA_CUT_DETAILS: {
      return {
        ...state,
        loadingDataCutDetails: true,
        loadingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.LOAD_DATA_CUT_DETAILS_SUCCESS: {
      return {
        ...state,
        loadingDataCutDetails: false,
        pageInViewInIframe: true
      };
    }
    case fromAddDataCutPageActions.LOAD_DATA_CUT_DETAILS_ERROR: {
      return {
        ...state,
        loadingDataCutDetails: false,
        loadingDataCutError: true
      };
    }
    case fromAddDataCutPageActions.UPDATE_DATA_CUT: {
      return {
        ...state,
        updatingDataCut: true,
        updatingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.UPDATE_DATA_CUT_SUCCESS: {
      return {
        ...state,
        updatingDataCut: false
      };
    }
    case fromAddDataCutPageActions.UPDATE_DATA_CUT_ERROR: {
      return {
        ...state,
        updatingDataCut: false,
        updatingDataCutError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getAddingDataCut = (state: State) => state.addingDataCut;
export const getAddingDataCutError = (state: State) => state.addingDataCutError;
export const getPageInViewInIframe = (state: State) => state.pageInViewInIframe;
export const getLoadingDataCutDetails = (state: State) => state.loadingDataCutDetails;
export const getLoadingDataCutDetailsError = (state: State) => state.loadingDataCutError;
