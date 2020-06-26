import { Action } from '@ngrx/store';
import { UserTicketSearchRequest } from 'libs/models/payfactors-api/service/request';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const INIT_TICKETS = '[Admin Tickets / Ticket List] Init Tickets';
export const INIT_TICKETS_CHECK = '[Admin Tickets / Ticket List] Init Tickets Check Status';
export const INIT_TICKETS_SUCCESS = '[Admin Tickets / Ticket List] Init Tickets Success';
export const LOAD_TICKETS = '[Admin Tickets / Ticket List] Load Tickets';
export const LOAD_TICKETS_SUCCESS = '[Admin Tickets / Ticket List] Load Tickets Success';
export const LOAD_TICKETS_ERROR = '[Admin Tickets / Ticket List] Load Tickets Error';
export const SET_GRID_DIRTY_STATUS = '[Admin Tickets / Ticket List] Set Grid Dirty Status';
export const EXPORT_GRID = '[Admin Tickets / Ticket List] Export Grid';
export const EXPORT_GRID_SUCCESS = '[Admin Tickets / Ticket List] Export Grid Success';
export const EXPORT_GRID_ERROR = '[Admin Tickets / Ticket List] Export Grid Error';

export class InitTickets implements Action {
  readonly type = INIT_TICKETS;
}

export class InitTicketsCheck implements Action {
  readonly type = INIT_TICKETS_CHECK;
}

export class InitTicketsSuccess implements Action {
  readonly type = INIT_TICKETS_SUCCESS;
}

export class LoadTickets implements Action {
  readonly type = LOAD_TICKETS;

  constructor(public payload: UserTicketSearchRequest) { }
}

export class LoadTicketsSuccess implements Action {
  readonly type = LOAD_TICKETS_SUCCESS;

  constructor(public payload: GridDataResult) { }
}

export class LoadTicketsError implements Action {
  readonly type = LOAD_TICKETS_ERROR;
}

export class SetGridDirtyStatus implements Action {
  readonly type = SET_GRID_DIRTY_STATUS;

  constructor(public payload: boolean) { }
}

export class ExportGrid implements Action {
  readonly type = EXPORT_GRID;

  constructor(public payload: UserTicketSearchRequest) {}
}

export class ExportGridSuccess implements Action {
  readonly type = EXPORT_GRID_SUCCESS;

  constructor() {}
}

export class ExportGridError implements Action {
  readonly type = EXPORT_GRID_ERROR;

  constructor() {}
}


export type Actions
  = InitTickets
  | InitTicketsCheck
  | InitTicketsSuccess
  | LoadTickets
  | LoadTicketsSuccess
  | LoadTicketsError
  | SetGridDirtyStatus
  | ExportGrid
  | ExportGridSuccess
  | ExportGridError;
