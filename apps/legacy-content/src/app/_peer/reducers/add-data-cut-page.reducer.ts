import * as fromAddDataCutPageActions from '../actions/add-data-cut-page.actions';

import { ExchangeJobPayMarketFilter } from 'libs/models';

export interface State {
  addingDataCut: boolean;
  addingDataCutError: boolean;
  exchangeJobPayMarketFilter: ExchangeJobPayMarketFilter;
}

// Initial State
export const initialState: State = {
  addingDataCut: false,
  addingDataCutError: false,
  exchangeJobPayMarketFilter: null
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
    case fromAddDataCutPageActions.LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER_SUCCESS: {
      return {
        ...state,
        exchangeJobPayMarketFilter: action.payload
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
export const getExchangeJobPayMarketFilter = (state: State) => state.exchangeJobPayMarketFilter;
