import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import {UserTicketResponse, UserTicketStateResponse, UserTicketTypeResponse} from 'libs/models/payfactors-api/service/response';

import * as fromTicketActions from '../actions/ticket.actions';
import { UserTicketItem, UserTicketTabItem } from '../models';

import * as cloneDeep from 'lodash.clonedeep';

export interface State {
  loading: boolean;
  loadingError: boolean;
  userTicket: UserTicketItem;
  openedTicket: UserTicketTabItem;
  selectedTabTicket: number;
  userTicketStates: UserTicketStateResponse[];
  userTicketTypes: UserTicketTypeResponse[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  userTicket: null,
  openedTicket: null,
  selectedTabTicket: null,
  userTicketStates: [],
  userTicketTypes: []
};

export const adapter: EntityAdapter<UserTicketItem> = createEntityAdapter<UserTicketItem>({
  selectId: (userTicketResponse: UserTicketItem) => userTicketResponse.TicketInfo.TicketId
});

export function reducer(state = initialState, action: fromTicketActions.Actions): State {
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
    case fromTicketActions.OPEN_TICKET: {
      return {
        ...state,
        openedTicket: action.payload,
        loading: false,
      };
    }
    case fromTicketActions.SELECT_TICKET_TAB: {
      return {
        ...state,
        selectedTabTicket: action.payload,
        loading: false,
      };
    }
    case fromTicketActions.LOAD_TICKETSTATES_SUCCESS: {
      return {
        ...state,
        userTicketStates: action.payload
      };
    }
    case fromTicketActions.LOAD_TICKETTYPES_SUCCESS: {
      return {
        ...state,
        userTicketTypes: action.payload
      };
    }
    case fromTicketActions.LOAD_COMPANY_DETAIL: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromTicketActions.LOAD_COMPANY_DETAIL_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTicketActions.LOAD_COMPANY_DETAIL_SUCCESS: {
      const userTicketWithCompanyInfo = cloneDeep(state.userTicket);

      userTicketWithCompanyInfo.CompanyInfo = action.payload.companyDetail;

      return {
        ...state,
        userTicket: userTicketWithCompanyInfo,
        loading: false,
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
export const getOpenedTicket = (state: State) => state.openedTicket;
export const getSelectedTabTicket = (state: State) => state.selectedTabTicket;
export const getUserTicketStates = (state: State) => state.userTicketStates;
export const getUserTicketTypes = (state: State) => state.userTicketTypes;
