import { Action } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';
import { UserTicketGridItem } from '../models';

export const LOAD_TICKETS = '[Admin Tickets / Ticket List] Load Tickets';
export const LOAD_TICKETS_SUCCESS = '[Admin Tickets / Ticket List] Load Tickets Success';
export const LOAD_TICKETS_ERROR = '[Admin Tickets / Ticket List] Load Tickets Error';
export const SET_GRID_DIRTY_STATUS = '[Admin Tickets / Ticket List] Set Grid Dirty Status';
export const SORT_TICKETS = '[Admin Tickets / Ticket List] Sort Tickets Grid';

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

export class SetGridDirtyStatus implements Action {
  readonly type = SET_GRID_DIRTY_STATUS;

  constructor(public payload: boolean) {}
}

export class SortTickets implements Action {
  readonly type = SORT_TICKETS;

  constructor(public payload: SortDescriptor) {}
}

export type Actions
  = LoadTickets
  | LoadTicketsSuccess
  | LoadTicketsError
  | SetGridDirtyStatus
  | SortTickets;
