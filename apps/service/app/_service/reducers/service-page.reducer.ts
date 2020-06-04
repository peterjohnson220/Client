// Import all exports from our feature's actions
import { orderBy, cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { MultiSelectItemGroup } from 'libs/ui/common';
import { MultiSelectDropdownHelper } from 'libs/ui/common/multi-select-dropdown/helpers';

import { TicketType, SupportTeamUser, UserTicket } from '../models';
import * as fromServicePageActions from '../actions/service-page.actions';

// Define our feature state
export interface State {
  ticketTypes: AsyncStateObj<TicketType[]>;
  supportTeam: AsyncStateObj<SupportTeamUser[]>;
  showNewTicketModal: boolean;
  savingTicket: boolean;
  savingTicketError: boolean;
  savingTicketErrorMessage: string;
  ticketStates: AsyncStateObj<MultiSelectItemGroup[]>;
  selectedTicketStates: string[];
  selectedTicketDetails: AsyncStateObj<UserTicket>;
}


// Define our initial state
const initialState: State = {
  ticketTypes: generateDefaultAsyncStateObj<TicketType[]>([]),
  supportTeam: generateDefaultAsyncStateObj<SupportTeamUser[]>([]),
  showNewTicketModal: false,
  savingTicket: false,
  savingTicketError: false,
  savingTicketErrorMessage: null,
  ticketStates: generateDefaultAsyncStateObj<MultiSelectItemGroup[]>([]),
  selectedTicketStates: [],
  selectedTicketDetails: generateDefaultAsyncStateObj<UserTicket>(null)
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
      ticketTypesClone.obj = orderBy(action.payload, ['TicketTypeDisplayName'], 'asc');
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
    case fromServicePageActions.GET_TICKET_STATES: {
      const ticketStatesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.ticketStates);
      ticketStatesClone.loading = true;
      ticketStatesClone.loadingError = false;
      return {
        ...state,
        ticketStates: ticketStatesClone
      };
    }
    case fromServicePageActions.GET_TICKET_STATES_SUCCESS: {
      const ticketStatesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.ticketStates);
      ticketStatesClone.loading = false;
      ticketStatesClone.obj = action.payload;
      return {
        ...state,
        ticketStates: ticketStatesClone
      };
    }
    case fromServicePageActions.GET_TICKET_STATES_ERROR: {
      const ticketStatesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.ticketStates);
      ticketStatesClone.loading = true;
      ticketStatesClone.loadingError = true;
      return {
        ...state,
        ticketStates: ticketStatesClone
      };
    }
    case fromServicePageActions.UPDATE_SELECTED_TICKET_STATES: {
      const ticketStatesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.ticketStates);
      ticketStatesClone.obj = action.payload;
      return {
        ...state,
        ticketStates: ticketStatesClone,
        selectedTicketStates: MultiSelectDropdownHelper.getSelectedValues(action.payload)
      };
    }
    case fromServicePageActions.LOAD_SUPPORT_TEAM: {
      const supportTeamClone = cloneDeep(state.supportTeam);

      supportTeamClone.loading = true;
      supportTeamClone.loadingError = false;
      return {
        ...state,
        supportTeam: supportTeamClone
      };
    }
    case fromServicePageActions.LOAD_SUPPORT_TEAM_SUCCESS: {
      const supportTeamClone = cloneDeep(state.supportTeam);

      supportTeamClone.loading = false;
      supportTeamClone.obj = orderBy(action.payload, ['Team'], ['asc']);
      return {
        ...state,
        supportTeam: supportTeamClone
      };
    }
    case fromServicePageActions.LOAD_SUPPORT_TEAM_ERROR: {
      const supportTeamClone = cloneDeep(state.supportTeam);

      supportTeamClone.loadingError = true;
      return {
        ...state,
        supportTeam: supportTeamClone
      };
    }
    case fromServicePageActions.GET_USER_TICKET: {
      const selectedTicketDetailsClone = cloneDeep(state.selectedTicketDetails);

      selectedTicketDetailsClone.loading = true;
      selectedTicketDetailsClone.loadingError = false;
      return {
        ...state,
        selectedTicketDetails: selectedTicketDetailsClone
      };
    }
    case fromServicePageActions.GET_USER_TICKET_SUCCESS: {
      const selectedTicketDetailsClone = cloneDeep(state.selectedTicketDetails);

      selectedTicketDetailsClone.loading = false;
      selectedTicketDetailsClone.obj = action.payload;
      return {
        ...state,
        selectedTicketDetails: selectedTicketDetailsClone
      };
    }
    case fromServicePageActions.GET_USER_TICKET_ERROR: {
      const selectedTicketDetailsClone = cloneDeep(state.selectedTicketDetails);

      selectedTicketDetailsClone.loadingError = true;
      selectedTicketDetailsClone.loading = false;
      return {
        ...state,
        selectedTicketDetails: selectedTicketDetailsClone
      };
    }
    case fromServicePageActions.ADD_ATTACHMENTS_SUCCESS: {
      const selectedTicketDetailsClone: AsyncStateObj<UserTicket> = cloneDeep(state.selectedTicketDetails);
      selectedTicketDetailsClone.obj.Attachments = selectedTicketDetailsClone.obj.Attachments.concat(action.payload);
      return {
        ...state,
        selectedTicketDetails: selectedTicketDetailsClone
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
    return state.ticketTypes.obj.map(t => t.TicketTypeDisplayName);
  }
  return [];
};
export const getActiveTicketTypes = (state: State) => {
  if (state.ticketTypes && state.ticketTypes.obj) {
    return state.ticketTypes.obj.filter(t => t.Active);
  }
  return [];
};
export const getShowNewTicketModal = (state: State) => state.showNewTicketModal;
export const getSavingUserTicket = (state: State) => state.savingTicket;
export const getSavingUserTicketError = (state: State) => state.savingTicketError;
export const getSavingUserTicketErrorMessage = (state: State) => state.savingTicketErrorMessage;
export const getTicketStates = (state: State) => state.ticketStates;
export const getSelectedTicketStates = (state: State) => state.selectedTicketStates;
export const getSupportTeam = (state: State) => state.supportTeam;
export const getSelectedTicketDetails = (state: State) => state.selectedTicketDetails;
