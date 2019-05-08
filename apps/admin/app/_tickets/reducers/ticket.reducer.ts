import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import * as fromTicketActions from '../actions/ticket.actions';
import { UserTicketItem, UserTicketTabItem } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  updating: boolean;
  updatingError: boolean;
  loadingTabTicket: number;
  userTicket: UserTicketItem;
  openedTicket: UserTicketTabItem;
  selectedTabTicket: number;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  updating: false,
  updatingError: false,
  loadingTabTicket: null,
  userTicket: null,
  openedTicket: null,
  selectedTabTicket: null
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
        loadingError: false,
        loadingTabTicket: action.payload
      };
    }
    case fromTicketActions.LOAD_TICKET_SUCCESS: {
      return {
        ...state,
        userTicket: action.payload,
        loading: false,
        loadingTabTicket: null
      };
    }
    case fromTicketActions.LOAD_TICKET_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
        loadingTabTicket: null
      };
    }
    case fromTicketActions.OPEN_TICKET: {
      return {
        ...state,
        openedTicket: action.payload,
        loading: false
      };
    }
    case fromTicketActions.SELECT_TICKET_TAB: {
      return {
        ...state,
        selectedTabTicket: action.payload,
        loading: false
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
      return {
        ...state,
        userTicket: {
          ...state.userTicket,
          CompanyInfo: action.payload.companyDetail
        },
        loading: false
      };
    }
    case fromTicketActions.UPDATE_TICKET: {
      return {
        ...state,
        updating: true,
        updatingError: false
      };
    }
    case fromTicketActions.UPDATE_TICKET_SUCCESS: {
      return {
        ...state,
        userTicket: {
          ...state.userTicket,
          TicketInfo: action.payload.TicketInfo
        },
        updating: false
      };
    }
    case fromTicketActions.UPDATE_TICKET_ERROR: {
      return {
        ...state,
        updating: false,
        updatingError: true
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
export const getLoadingTabTicket = (state: State) => state.loadingTabTicket;
export const getOpenedTicket = (state: State) => state.openedTicket;
export const getSelectedTabTicket = (state: State) => state.selectedTabTicket;
export const getUpdating = (state: State) => state.updating;
export const getUpdatingError = (state: State) => state.updatingError;
