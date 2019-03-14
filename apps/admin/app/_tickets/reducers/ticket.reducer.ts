import { UserTicketResponse } from 'libs/models/payfactors-api/service/response';

import * as fromTicketActions from '../actions/ticket.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  userTicket: UserTicketResponse;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  userTicket: null
};

export function reducer(state = null, action: fromTicketActions.Actions): State {
  switch (action.type) {
    case fromTicketActions.LOAD_TICKET: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromTicketActions.LOAD_TICKET_SUCCESS: {
      return {
        ...state,
        userTicket: action.payload,
        loading: false
      };
    }
    case fromTicketActions.LOAD_TICKET_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserTicket = (state: State) => state.userTicket;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
