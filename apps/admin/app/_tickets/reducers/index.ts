import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTicketsReducer from './ticket.reducer';
import * as fromTicketsListReducer from './ticket-list.reducer';
import * as fromTicketLookupsReducer from './ticket-lookups.reducer';
import * as fromTicketAttachmentReducer from './ticket-attachment.reducer';
import * as fromTicketSharedReducer from './ticket-shared.reducer';

// Feature area state
export interface TicketsAdminState {
  ticket: fromTicketsReducer.State;
  ticketList: fromTicketsListReducer.State;
  ticketLookups: fromTicketLookupsReducer.State;
  ticketAttachment: fromTicketAttachmentReducer.State;
  ticketShared: fromTicketSharedReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  ticketsAdmin: TicketsAdminState;
}

// Feature area reducers
export const reducers = {
  ticket: fromTicketsReducer.reducer,
  ticketList: fromTicketsListReducer.reducer,
  ticketLookups: fromTicketLookupsReducer.reducer,
  ticketAttachment: fromTicketAttachmentReducer.reducer,
  ticketShared: fromTicketSharedReducer.reducer
};

// Select Feature area
export const selectTicketsAdminState = createFeatureSelector<TicketsAdminState>('admin_tickets');

// Tickets Admin View Selectors
export const selectTicketState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticket);
export const selectTicketListState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticketList);
export const selectTicketLookupsState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticketLookups);
export const selectTicketAttachmentState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticketAttachment);
export const selectTicketSharedState = createSelector(selectTicketsAdminState, (state: TicketsAdminState) => state.ticketShared);

// Company Detail area
export const getCompanyDetailLoading = createSelector(selectTicketState, fromTicketsReducer.getLoading);
export const getCompanyDetailLoadingError = createSelector(selectTicketState, fromTicketsReducer.getLoadingError);

// Ticket Selector
export const getTicketLoading = createSelector(selectTicketState, fromTicketsReducer.getLoading);
export const getTicketLoadingError = createSelector(selectTicketState, fromTicketsReducer.getLoadingError);
export const getUserTicket = createSelector(selectTicketState, fromTicketsReducer.getUserTicket);
export const getOpenedTicket = createSelector(selectTicketState, fromTicketsReducer.getOpenedTicket);
export const getSelectedTabTicket = createSelector(selectTicketState, fromTicketsReducer.getSelectedTabTicket);
export const getLoadingTabTicket = createSelector(selectTicketState, fromTicketsReducer.getLoadingTabTicket);
export const getTicketUpdating = createSelector(selectTicketState, fromTicketsReducer.getUpdating);
export const getTicketUpdatingError = createSelector(selectTicketState, fromTicketsReducer.getUpdatingError);
export const getTicketComments = createSelector(selectTicketState, fromTicketsReducer.getComments);
export const getSubmittingReply = createSelector(selectTicketState, fromTicketsReducer.getSubmittingReply);
export const getSubmittingReplySuccess = createSelector(selectTicketState, fromTicketsReducer.getSubmittingReplySuccess);
export const getSubmittingReplyError = createSelector(selectTicketState, fromTicketsReducer.getSubmittingReplyError);

// Ticket Shared Selector
export const getUserDetailModalOpen = createSelector(selectTicketSharedState, fromTicketSharedReducer.isUserDetailModalOpen);
export const getUserDetail = createSelector(selectTicketSharedState, fromTicketSharedReducer.getUserDetail);
export const isLoadingUserDetial = createSelector(selectTicketSharedState, fromTicketSharedReducer.isLoadingUserDetial);
export const hasLoadingError = createSelector(selectTicketSharedState, fromTicketSharedReducer.hasLoadingError);

// Ticket List Selectors
export const getTickets = createSelector(selectTicketListState, fromTicketsListReducer.getData);
export const getTicketListLoading = createSelector(selectTicketListState, fromTicketsListReducer.getLoading);
export const getTicketListLoadingError = createSelector(selectTicketListState, fromTicketsListReducer.getLoadingError);
export const getDirtyGridState = createSelector(selectTicketListState, fromTicketsListReducer.getDirtyGridState);
export const getGridInitSuccess = createSelector(selectTicketListState, fromTicketsListReducer.getInitSuccess);

// Ticket Field Lookup Selectors
export const getUserTicketStates = createSelector(selectTicketLookupsState, fromTicketLookupsReducer.getUserTicketStates);
export const getUserTicketTypes = createSelector(selectTicketLookupsState, fromTicketLookupsReducer.getUserTicketTypes);

export const getLookupLoading = createSelector(selectTicketLookupsState, fromTicketLookupsReducer.getLoading);
export const getLookupLoadingError = createSelector(selectTicketLookupsState, fromTicketLookupsReducer.getLoadingError);
export const getPfServiceReps = createSelector(selectTicketLookupsState, fromTicketLookupsReducer.getPfServicesReps);

// Ticket Attachment Selectors
export const getAttachmentDeleteModalOpen =
  createSelector(selectTicketAttachmentState, fromTicketAttachmentReducer.getDeleteAttachmentModalOpen);
export const getAttachmentDeleteAttachmentRequest =
  createSelector(selectTicketAttachmentState, fromTicketAttachmentReducer.getDeleteAttachmentRequest);
export const getAttachmentDeleting =
  createSelector(selectTicketAttachmentState, fromTicketAttachmentReducer.getDeletingAttachment);
export const getAttachmentDeletingError =
  createSelector(selectTicketAttachmentState, fromTicketAttachmentReducer.getDeletingAttachmentError);
