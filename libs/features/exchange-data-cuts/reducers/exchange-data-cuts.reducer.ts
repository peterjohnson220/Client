import * as fromExchangeDataCutsActions from '../actions/exchange-data-cuts.actions';

export interface State {
  exchangeDataCut: any;
  loading: boolean;
  hasError: boolean;
}

export const initialState: State = {
  exchangeDataCut: null,
  loading: false,
  hasError: false
};

export function reducer(state = initialState, action: fromExchangeDataCutsActions.Actions): State {
  switch (action.type) {
    case fromExchangeDataCutsActions.LOAD_PEER_DATA_CUT:
      return {
        ...state,
        loading: true,
        hasError: false
      };
    case fromExchangeDataCutsActions.LOAD_PEER_DATA_CUT_SUCCESS:
      return {
        ...state,
        loading: false,
        exchangeDataCut: action.payload
      };
    case fromExchangeDataCutsActions.CLEAR_STATE:
      return {
        ...state,
        loading: false,
        exchangeDataCut: null
      };
    case fromExchangeDataCutsActions.GET_EXCHANGE_DATA_CUT_ERROR:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}

export const getExchangeDataCut = (state: State) => state.exchangeDataCut;
export const getLoading = (state: State) => state.loading;
export const getHasError = (state: State) => state.hasError;
