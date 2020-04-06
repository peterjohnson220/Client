// Import all exports from our feature's actions
import * as cloneDeep from 'lodash.clonedeep';

import * as fromServicePageActions from '../actions/service-page.actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { UserTicketTypeResponse } from 'libs/models/payfactors-api/service/response';

// Define our feature state
export interface State {
  ticketTypes: AsyncStateObj<UserTicketTypeResponse[]>;
}


// Define our initial state
const initialState: State = {
  ticketTypes: generateDefaultAsyncStateObj<UserTicketTypeResponse[]>([])
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
    default: {
      return state;
    }
  }
}

// Selector functions
export const getTicketTypeNames = (state: State) => {
  if (state.ticketTypes && state.ticketTypes.obj) {
    return Array.from(new Set(state.ticketTypes.obj.filter(t => !!t.TicketTypeName).map(t => t.TicketTypeName)));
  }
  return [];
};

