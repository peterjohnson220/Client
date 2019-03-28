import { Action } from '@ngrx/store';
import { UserTicketResponse } from 'libs/models/payfactors-api/service/response';

export const LOAD_TICKET = '[Admin Tickets / Ticket] Load Ticket';
export const LOAD_TICKET_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Success';
export const LOAD_TICKET_ERROR = '[Admin Tickets / Ticket] Load Ticket Error';
export const OPEN_TICKET = '[Admin Tickets/ Ticket] Open Ticket';
export const SELECT_TICKET_TAB = '[Admin Tickets/ Ticket] Select Ticket Tab';

export class LoadTicket implements Action {
  readonly type = LOAD_TICKET;

  constructor(public payload: number) {}
}

export class LoadTicketSuccess implements Action {
  readonly type = LOAD_TICKET_SUCCESS;

  constructor(public payload: UserTicketResponse) {}
}

export class LoadTicketError implements Action {
  readonly type = LOAD_TICKET_ERROR;
}

export class OpenTicket implements Action {
  readonly type = OPEN_TICKET;

  constructor(public payload: number) {}
}

export class SelectTicketTab implements  Action {
  readonly type = SELECT_TICKET_TAB;

  constructor(public payload: number) {}
}

export type Actions
  = LoadTicket
  | LoadTicketSuccess
  | LoadTicketError
  | OpenTicket
  | SelectTicketTab;
