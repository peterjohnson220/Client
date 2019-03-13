import { Action } from '@ngrx/store';
import { UserTicketResponse } from 'libs/models/payfactors-api/service/response';

export const LOAD_TICKET = '[Admin Tickets / Ticket] Load Ticket';
export const LOAD_TICKET_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Success';
export const LOAD_TICKET_ERROR = '[Admin Tickets / Ticket] Load Ticket Error';
export const OPEN_TICKET = '[Admin Tickets/ Ticket] Open Ticket';

// TODO: Add Success and Error actions for opening ticket?

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

export type Actions
  = LoadTicket
  | LoadTicketSuccess
  | LoadTicketError
  | OpenTicket;
