import * as fromExchangeAccessActions from '../../actions/exchange-access/exchange-access.actions';

export interface State {
  modalOpen: boolean;
  requesting: boolean;
  requestingError: boolean;
  searchTerm: string;
  companyFilterId?: number;
}

const initialState: State = {
  modalOpen: false,
  requesting: false,
  requestingError: false,
  searchTerm: '',
  companyFilterId: null
};

// Reducer function
export function reducer(state = initialState,  action: fromExchangeAccessActions.Actions): State {
  switch (action.type) {
    case fromExchangeAccessActions.OPEN_EXCHANGE_ACCESS_MODAL: {
      return {
        ...state,
        modalOpen: true
      };
    }
    case fromExchangeAccessActions.CLOSE_EXCHANGE_ACCESS_MODAL: {
      return {
        ...state,
        searchTerm: '',
        companyFilterId: null,
        modalOpen: false
      };
    }
    case fromExchangeAccessActions.EXCHANGE_ACCESS_REQUEST: {
      return {
        ...state,
        requesting: true,
        requestingError: false
      };
    }
    case fromExchangeAccessActions.EXCHANGE_ACCESS_REQUEST_SUCCESS: {
      return {
        ...state,
        requesting: false
      };
    }
    case fromExchangeAccessActions.EXCHANGE_ACCESS_REQUEST_ERROR: {
      return {
        ...state,
        requesting: false,
        requestingError: true
      };
    }
    case fromExchangeAccessActions.UPDATE_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.payload
      };
    }
    case fromExchangeAccessActions.UPDATE_COMPANY_FILTER: {
      return {
        ...state,
        companyFilterId: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getModalOpen = (state: State) => state.modalOpen;
export const getRequesting = (state: State) => state.requesting;
export const getRequestingError = (state: State) => state.requestingError;
export const getAvailableExchangesQueryPayload = (state: State) => {
  return {
    query: state.searchTerm,
    companyFilterId: state.companyFilterId
  };
};
