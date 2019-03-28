import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTicketsReducer from './ticket.reducer';
import * as fromTicketsListReducer from './ticket-list.reducer';

// Feature area state
export interface TicketsAdminState {
  ticket: fromTicketsReducer.State;
  ticketList: fromTicketsListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  ticketsAdmin: TicketsAdminState;
}

// Feature area reducers
export const reducers = {
  ticket: fromTicketsReducer.reducer,
  ticketList: fromTicketsListReducer.reducer
};

// Select Feature area
export const selectTicketsAdminState = createFeatureSelector<TicketsAdminState>('admin_tickets');

// Tickets Admin View Selectors
export const selectTicketState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticket);
export const selectTicketListState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticketList);

// Ticket Selector
export const getTicketLoading = createSelector(selectTicketState, fromTicketsReducer.getLoading);
export const getTicketLoadingError = createSelector(selectTicketState, fromTicketsReducer.getLoading);
export const getUserTicket = createSelector(selectTicketState, fromTicketsReducer.getUserTicket);
export const getOpenedTicket = createSelector(selectTicketState, fromTicketsReducer.getOpenedTicket);
export const getSelectedTabTicket = createSelector(selectTicketState, fromTicketsReducer.getSelectedTabTicket);

// Ticket List Selectors
export const {
  selectAll: getTickets,
} = fromTicketsListReducer.adapter.getSelectors(selectTicketListState);
export const getTicketListLoading = createSelector(selectTicketListState, fromTicketsListReducer.getLoading);
export const getTicketListLoadingError = createSelector(selectTicketListState, fromTicketsListReducer.getLoadingError);
