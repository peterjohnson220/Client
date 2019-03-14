import { Action } from '@ngrx/store';
import { UserTicketResponse } from 'libs/models/payfactors-api/service/response';

export const LOAD_TICKET = '[Admin Tickets / Ticket] Load Ticket';
export const LOAD_TICKET_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Success';
export const LOAD_TICKET_ERROR = '[Admin Tickets / Ticket] Load Ticket Error';

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

export type Actions
  = LoadTicket
  | LoadTicketSuccess
  | LoadTicketError;
