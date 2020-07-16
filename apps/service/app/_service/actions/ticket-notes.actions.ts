import { Action } from '@ngrx/store';

import { Comment } from 'libs/features/comment-box/models';

export const SET_TICKET_NOTES = '[Service / Ticket Notes] Set Ticket Notes';
export const ADD_NOTE = '[Service / Ticket Notes] Add Note';
export const ADD_NOTE_SUCCESS = '[Service / Ticket Notes] Add Note Success';
export const ADD_NOTE_ERROR = '[Service / Ticket Notes] Add Note Error';
export const REPLY_NOTE = '[Service / Ticket Notes] Reply Note';
export const REPLY_NOTE_SUCCESS = '[Service / Ticket Notes] Reply Note Success';
export const REPLY_NOTE_ERROR = '[Service / Ticket Notes] Reply Note Error';

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

export class ReplyNote implements Action {
  readonly type = REPLY_NOTE;
  constructor(public payload: { ticketId: number, commentId: number, content: string }) {}
}

export class ReplyNoteSuccess implements Action {
  readonly type = REPLY_NOTE_SUCCESS;
  constructor(public payload: { commentId: number, replies: Comment[] }) {}
}

export class ReplyNoteError implements Action {
  readonly type = REPLY_NOTE_ERROR;
  constructor() {}
}

export type Actions
  = SetTicketNotes
  | AddNote
  | AddNoteSuccess
  | AddNoteError
  | ReplyNote
  | ReplyNoteSuccess
  | ReplyNoteError;
