import * as fromExchangeDataCutActions from '../actions/exchange-data-cut.actions';

// Define our feature state
export interface State {
  loading: boolean;
}

// Define our initial state
export const initialState: State = {
    loading: false,
  };


// Reducer function
export function reducer(
  state = initialState,
  action: fromExchangeDataCutActions.Actions
): State {
  switch (action.type) {
    case fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT: {
      return {
        ...state,
        loading: true,
      };
    }
    case fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT_SUCCESS: {
        return {
          ...state,
          loading: false,
        };
      }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loading;
