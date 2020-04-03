// Import all exports from our feature's actions
import * as cloneDeep from 'lodash.clonedeep';


import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import { TicketType } from '../models';
import * as fromServicePageActions from '../actions/service-page.actions';

// Define our feature state
export interface State {
  ticketTypes: AsyncStateObj<TicketType[]>;
  showNewTicketModal: boolean;
  savingTicket: boolean;
  savingTicketError: boolean;
  savingTicketErrorMessage: string;
}


// Define our initial state
const initialState: State = {
  ticketTypes: generateDefaultAsyncStateObj<TicketType[]>([]),
  showNewTicketModal: false,
  savingTicket: false,
  savingTicketError: false,
  savingTicketErrorMessage: null
};


// Reducer function
export function reducer(state = initialState, action: fromServicePageActions.Actions): State {
  switch (action.type) {
    case fromServicePageActions.LOAD_TICKET_TYPES: {
      const ticketTypesClone = cloneDeep(state.ticketTypes);

      ticketTypesClone.loading = true;
      ticketTypesClone.loadingError = false;
      return {
        ...state,
        ticketTypes: ticketTypesClone
      };
    }
    case fromServicePageActions.LOAD_TICKET_TYPES_SUCCESS: {
      const ticketTypesClone = cloneDeep(state.ticketTypes);

      ticketTypesClone.loading = false;
      ticketTypesClone.obj = action.payload;
      return {
        ...state,
        ticketTypes: ticketTypesClone
      };
    }
    case fromServicePageActions.LOAD_TICKET_TYPES_ERROR: {
      const ticketTypesClone = cloneDeep(state.ticketTypes);

      ticketTypesClone.loading = false;
      ticketTypesClone.loadingError = true;
      return {
        ...state,
        ticketTypes: ticketTypesClone
      };
    }
    case fromServicePageActions.SHOW_NEW_TICKET_MODAL: {
      return {
        ...state,
        showNewTicketModal: action.payload
      };
    }
    case fromServicePageActions.CREATE_USER_TICKET: {
      return {
        ...state,
        savingTicket: true,
        savingTicketError: false
      };
    }
    case fromServicePageActions.CREATE_USER_TICKET_ERROR: {
      return {
        ...state,
        savingTicket: false,
        savingTicketError: true,
        savingTicketErrorMessage: action.payload
      };
    }
    case fromServicePageActions.CREATE_USER_TICKET_SUCCESS: {
      return {
        ...state,
        savingTicket: false,
        savingTicketError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getTicketTypes = (state: State) => state.ticketTypes;
export const getTicketTypeNames = (state: State) => {
  if (state.ticketTypes && state.ticketTypes.obj) {
    return Array.from(new Set(state.ticketTypes.obj.filter(t => !!t.TicketTypeName).map(t => t.TicketTypeName)));
  }
  return [];
};
export const getShowNewTicketModal = (state: State) => state.showNewTicketModal;
export const getSavingUserTicket = (state: State) => state.savingTicket;
export const getSavingUserTicketError = (state: State) => state.savingTicketError;
export const getSavingUserTicketErrorMessage = (state: State) => state.savingTicketErrorMessage;

