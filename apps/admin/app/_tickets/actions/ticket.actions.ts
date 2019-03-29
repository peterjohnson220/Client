import { Action } from '@ngrx/store';
import { CompanyDetail, UserTicketItem } from '../models';


export const LOAD_COMPANY_DETAIL = '[Admin / Tickets] Load Company Detail';
export const LOAD_COMPANY_DETAIL_ERROR = '[Admin Tickets/ Ticket] Load Company Detail Error';
export const LOAD_COMPANY_DETAIL_SUCCESS = '[Admin / Tickets] Load Company Detail Success';
export const LOAD_TICKET = '[Admin Tickets / Ticket] Load Ticket';
export const LOAD_TICKET_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Success';
export const LOAD_TICKET_ERROR = '[Admin Tickets / Ticket] Load Ticket Error';
export const OPEN_TICKET = '[Admin Tickets/ Ticket] Open Ticket';
export const SELECT_TICKET_TAB = '[Admin Tickets/ Ticket] Select Ticket Tab';

export class LoadCompanyDetail implements Action {
  readonly type = LOAD_COMPANY_DETAIL;

  constructor(public payload: { companyId: number }) {}
}

export class LoadCompanyDetailError implements Action {
  readonly type = LOAD_COMPANY_DETAIL_ERROR;
}

export class LoadCompanyDetailSuccess implements Action {
  readonly type = LOAD_COMPANY_DETAIL_SUCCESS;

  constructor(public payload: { companyDetail: CompanyDetail }) {}
}

export class LoadTicket implements Action {
  readonly type = LOAD_TICKET;

  constructor(public payload: number) {}
}

export class LoadTicketSuccess implements Action {
  readonly type = LOAD_TICKET_SUCCESS;

  constructor(public payload: UserTicketItem) {}
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
  = LoadCompanyDetail
  | LoadCompanyDetailSuccess
  | LoadCompanyDetailError
  | LoadTicket
  | LoadTicketSuccess
  | LoadTicketError
  | OpenTicket
  | SelectTicketTab;
