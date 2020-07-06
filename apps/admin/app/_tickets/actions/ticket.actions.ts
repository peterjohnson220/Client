import { Action } from '@ngrx/store';
import { UserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';
import { CompanyDetail, UserTicketItem, UserTicketTabItem, TicketComment } from '../models';
import { GenericKeyValue } from 'libs/models';

export const LOAD_COMPANY_DETAIL = '[Admin / Tickets] Load Company Detail';
export const LOAD_COMPANY_DETAIL_ERROR = '[Admin Tickets/ Ticket] Load Company Detail Error';
export const LOAD_COMPANY_DETAIL_SUCCESS = '[Admin / Tickets] Load Company Detail Success';
export const LOAD_TICKET = '[Admin Tickets / Ticket] Load Ticket';
export const LOAD_TICKET_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Success';
export const LOAD_TICKET_ERROR = '[Admin Tickets / Ticket] Load Ticket Error';
export const OPEN_TICKET = '[Admin Tickets/ Ticket] Open Ticket';
export const CLOSE_TICKET = '[Admin Tickets/ Ticket] Close Ticket';
export const SELECT_TICKET_TAB = '[Admin Tickets/ Ticket] Select Ticket Tab';
export const INITIALIZE_TICKET_TAB = '[Admin Tickets/ Ticket] Initialize Ticket Tab';
export const UPDATE_TICKET = '[Admin Tickets / Ticket] Update Ticket';
export const UPDATE_TICKET_SUCCESS = '[Admin Tickets / Ticket] Update Ticket Success';
export const UPDATE_TICKET_ERROR = '[Admin Tickets / Ticket] Update Ticket Error';

// Comments
export const CREATE_COMMENT = '[Admin Tickets / Ticket ] Create Comment';
export const CREATE_COMMENT_ERROR = '[Admin Tickets / Ticket ] Create Comment Error';
export const DELETE_COMMENT = '[Admin Tickets / Ticket ] Delete Comment';
export const DELETE_COMMENT_ERROR = '[Admin Tickets / Ticket ] Delete Comment Error';
export const UPDATE_COMMENT = '[Admin Tickets / Ticket ] Update Comment';
export const UPDATE_COMMENT_ERROR = '[Admin Tickets / Ticket ] Update Comment Error';
export const REPLY_CLIENT_NOTE = '[Admin Tickets / Ticket ] Reply Client Note';
export const REPLY_CLIENT_NOTE_SUCCESS = '[Admin Tickets / Ticket ] Reply Client Note Success';
export const REPLY_CLIENT_NOTE_ERROR = '[Admin Tickets / Ticket ] Reply Client Note Error';

export class LoadCompanyDetail implements Action {
  readonly type = LOAD_COMPANY_DETAIL;

  constructor(public payload: { companyId: number }) { }
}

export class LoadCompanyDetailError implements Action {
  readonly type = LOAD_COMPANY_DETAIL_ERROR;
}

export class LoadCompanyDetailSuccess implements Action {
  readonly type = LOAD_COMPANY_DETAIL_SUCCESS;

  constructor(public payload: { companyDetail: CompanyDetail }) { }
}

export class LoadTicket implements Action {
  readonly type = LOAD_TICKET;

  constructor(public payload: number) { }
}

export class LoadTicketSuccess implements Action {
  readonly type = LOAD_TICKET_SUCCESS;

  constructor(public payload: UserTicketItem) { }
}

export class LoadTicketError implements Action {
  readonly type = LOAD_TICKET_ERROR;
}

export class OpenTicket implements Action {
  readonly type = OPEN_TICKET;

  constructor(public payload: UserTicketTabItem) { }
}

export class CloseTicket implements Action {
  readonly type = CLOSE_TICKET;
}

export class SelectTicketTab implements Action {
  readonly type = SELECT_TICKET_TAB;

  constructor(public payload: number) { }
}

export class InitializeTicketTab implements Action {
  readonly type = INITIALIZE_TICKET_TAB;

  constructor(public payload: number) { }
}

export class UpdateTicket implements Action {
  readonly type = UPDATE_TICKET;

  constructor(public payload: { userTicketId: number, updateFields: GenericKeyValue<string, string>[] }) { }
}

export class UpdateTicketSuccess implements Action {
  readonly type = UPDATE_TICKET_SUCCESS;

  constructor(public payload: UserTicketItem) { }
}

export class UpdateTicketError implements Action {
  readonly type = UPDATE_TICKET_ERROR;
}

export class CreateComment implements Action {
  readonly type = CREATE_COMMENT;
  constructor(public payload: UserTicketCommentRequest) { }
}
export class CreateCommentError implements Action {
  readonly type = CREATE_COMMENT_ERROR;
}

export class DeleteComment implements Action {
  readonly type = DELETE_COMMENT;

  constructor(public payload: UserTicketCommentRequest) { }
}

export class DeleteCommentError implements Action {
  readonly type = DELETE_COMMENT_ERROR;
}

export class UpdateComment implements Action {
  readonly type = UPDATE_COMMENT;

  constructor(public payload: UserTicketCommentRequest) { }
}

export class UpdateCommentError implements Action {
  readonly type = UPDATE_COMMENT_ERROR;
}

export class ReplyClientNote implements Action {
  readonly type = REPLY_CLIENT_NOTE;
  constructor(public payload: { comment: TicketComment, content: string }) {}
}

export class ReplyClientNoteSuccess implements Action {
  readonly type = REPLY_CLIENT_NOTE_SUCCESS;
  constructor(public payload: TicketComment[]) {}
}

export class ReplyClientNoteError implements Action {
  readonly type = REPLY_CLIENT_NOTE_ERROR;
  constructor() {}
}

export type Actions
  = LoadCompanyDetail
  | LoadCompanyDetailSuccess
  | LoadCompanyDetailError
  | LoadTicket
  | LoadTicketSuccess
  | LoadTicketError
  | OpenTicket
  | CloseTicket
  | SelectTicketTab
  | InitializeTicketTab
  | UpdateTicket
  | UpdateTicketSuccess
  | UpdateTicketError
  | CreateComment
  | CreateCommentError
  | DeleteComment
  | DeleteCommentError
  | UpdateComment
  | UpdateCommentError
  | ReplyClientNote
  | ReplyClientNoteSuccess
  | ReplyClientNoteError;
