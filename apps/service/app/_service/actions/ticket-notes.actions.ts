import { Action } from '@ngrx/store';

import { Comment } from 'libs/features/comment-box/models';

export const SET_TICKET_NOTES = '[Service / Ticket Notes] Set Ticket Notes';
export const ADD_NOTE = '[Service / Ticket Notes] Add Note';
export const ADD_NOTE_SUCCESS = '[Service / Ticket Notes] Add Note Success';
export const ADD_NOTE_ERROR = '[Service / Ticket Notes] Add Note Error';

export class SetTicketNotes implements Action {
  readonly type = SET_TICKET_NOTES;

  constructor(public payload: Comment[]) {}
}

export class AddNote implements Action {
  readonly type = ADD_NOTE;

  constructor(public payload: { ticketId: number, note: string }) {}
}

export class AddNoteSuccess implements Action {
  readonly type = ADD_NOTE_SUCCESS;

  constructor(public payload: Comment) {}
}

export class AddNoteError implements Action {
  readonly type = ADD_NOTE_ERROR;
  constructor() {}
}

export type Actions
  = SetTicketNotes
  | AddNote
  | AddNoteSuccess
  | AddNoteError;
