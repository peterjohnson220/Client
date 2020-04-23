import { orderBy, cloneDeep } from 'lodash';

import * as fromTicketNotesActions from '../actions/ticket-notes.actions';
import { TicketNote } from '../models';

export interface State {
  ticketNotes: TicketNote[];
  addingNote: boolean;
  addingNoteError: boolean;
}

export const initialState: State = {
  ticketNotes: [],
  addingNote: false,
  addingNoteError: false
};

export function reducer(state: State = initialState, action: fromTicketNotesActions.Actions): State {
  switch (action.type) {
    case fromTicketNotesActions.SET_TICKET_NOTES: {
      return {
        ...state,
        ticketNotes: orderTicketNotes(action.payload)
      };
    }
    case fromTicketNotesActions.ADD_NOTE: {
      return {
        ...state,
        addingNote: true,
        addingNoteError: false
      };
    }
    case fromTicketNotesActions.ADD_NOTE_SUCCESS: {
      const ticketNotesClone: TicketNote[] = cloneDeep(state.ticketNotes);
      if (action.payload) {
        ticketNotesClone.push(action.payload);
      }
      return {
        ...state,
        ticketNotes: orderTicketNotes(ticketNotesClone),
        addingNote: false
      };
    }
    case fromTicketNotesActions.ADD_NOTE_ERROR: {
      return {
        ...state,
        addingNote: false,
        addingNoteError: true
      };
    }
    default: {
      return state;
    }
  }
}

function orderTicketNotes(ticketNotes: TicketNote[]): TicketNote[] {
  if (!ticketNotes || ticketNotes.length === 0) {
    return [];
  }
  return orderBy(ticketNotes, ['PostedDate'], ['desc']);
}

export const getTicketNotes = (state: State) => state.ticketNotes;
export const getAddingNote = (state: State) => state.addingNote;
export const getAddingNoteError = (state: State) => state.addingNoteError;
