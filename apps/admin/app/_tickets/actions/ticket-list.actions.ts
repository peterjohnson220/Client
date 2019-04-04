import { Action } from '@ngrx/store';
import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';
import {UserTicketGridItem} from '../models';

export const LOAD_TICKETS = '[Admin Tickets / Ticket List] Load Tickets';
export const LOAD_TICKETS_SUCCESS = '[Admin Tickets / Ticket List] Load Tickets Success';
export const LOAD_TICKETS_ERROR = '[Admin Tickets / Ticket List] Load Tickets Error';

export class LoadTickets implements Action {
  readonly type = LOAD_TICKETS;

  constructor(public payload: UserTicketSearchRequest) {}
}

export class LoadTicketsSuccess implements Action {
  readonly type = LOAD_TICKETS_SUCCESS;

  constructor(public payload: UserTicketGridItem[]) {}
}

export class LoadTicketsError implements Action {
  readonly type = LOAD_TICKETS_ERROR;
}

export type Actions
  = LoadTickets
  | LoadTicketsSuccess
  | LoadTicketsError;
