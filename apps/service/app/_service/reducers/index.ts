import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromServicePageReducer from './service-page.reducer';
import * as fromTicketNotesReducer from './ticket-notes.reducer';

// Feature area state
export interface ServiceMainState {
  servicePage: fromServicePageReducer.State;
  ticketNotes: fromTicketNotesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  service_main: ServiceMainState;
}

// Feature area reducers
export const reducers = {
  servicePage: fromServicePageReducer.reducer,
  ticketNotes: fromTicketNotesReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ServiceMainState>('service_main');

// Feature Selectors
export const selectServicePageState = createSelector(selectFeatureAreaState,
  (state: ServiceMainState) => state.servicePage
);

export const selectTicketNotesState = createSelector(
  selectFeatureAreaState,
  (state: ServiceMainState) => state.ticketNotes
);

// Service Page
export const getTicketTypeNames = createSelector(selectServicePageState, fromServicePageReducer.getTicketTypeNames);
export const getTicketTypes = createSelector(selectServicePageState, fromServicePageReducer.getTicketTypes);
export const getActiveTicketTypes = createSelector(selectServicePageState, fromServicePageReducer.getActiveTicketTypes);
export const getShowNewTicketModal = createSelector(selectServicePageState, fromServicePageReducer.getShowNewTicketModal);
export const getSavingUserTicket = createSelector(selectServicePageState, fromServicePageReducer.getSavingUserTicket);
export const getSavingUserTicketError = createSelector(selectServicePageState, fromServicePageReducer.getSavingUserTicketError);
export const getSavingUserTicketErrorMessage = createSelector(selectServicePageState, fromServicePageReducer.getSavingUserTicketErrorMessage);
export const getTicketStates = createSelector(selectServicePageState, fromServicePageReducer.getTicketStates);
export const getSelectedTicketStates = createSelector(selectServicePageState, fromServicePageReducer.getSelectedTicketStates);
export const getSupportTeam = createSelector(selectServicePageState, fromServicePageReducer.getSupportTeam);
export const getSelectedTicketDetails = createSelector(selectServicePageState, fromServicePageReducer.getSelectedTicketDetails);

// Ticket Notes
export const getTicketNotes = createSelector(selectTicketNotesState, fromTicketNotesReducer.getTicketNotes);
export const getAddingNote = createSelector(selectTicketNotesState, fromTicketNotesReducer.getAddingNote);
export const getAddingNoteError = createSelector(selectTicketNotesState, fromTicketNotesReducer.getAddingNoteError);

