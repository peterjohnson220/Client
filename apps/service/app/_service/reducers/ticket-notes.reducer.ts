import { cloneDeep, orderBy } from 'lodash';

import { Comment } from 'libs/features/comment-box/models';

import * as fromTicketNotesActions from '../actions/ticket-notes.actions';

export interface State {
  ticketNotes: Comment[];
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
        ticketNotes: action.payload
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
      let ticketNotesClone: Comment[] = cloneDeep(state.ticketNotes);
      if (action.payload) {
        ticketNotesClone.push(action.payload);
        ticketNotesClone = orderBy(ticketNotesClone, ['CreateDate'], ['desc']);
      }
      return {
        ...state,
        ticketNotes: ticketNotesClone,
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
    case fromTicketNotesActions.REPLY_NOTE_SUCCESS: {
      const ticketNotesClone: Comment[] = cloneDeep(state.ticketNotes);
      const updatedNote = ticketNotesClone.find(n => n.CommentId === action.payload.commentId);
      if (updatedNote) {
        updatedNote.Replies = action.payload.replies;
        updatedNote.ReplyCount = action.payload.replies.length;
      }
      return {
        ...state,
        ticketNotes: ticketNotesClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getTicketNotes = (state: State) => state.ticketNotes;
export const getAddingNote = (state: State) => state.addingNote;
export const getAddingNoteError = (state: State) => state.addingNoteError;
