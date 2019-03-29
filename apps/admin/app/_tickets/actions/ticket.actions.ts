import { Action } from '@ngrx/store';
import {UserTicketResponse, UserTicketStateResponse, UserTicketTypeResponse} from 'libs/models/payfactors-api/service/response';
import { CompanyDetail, UserTicketItem, UserTicketTabItem } from '../models';


export const LOAD_COMPANY_DETAIL = '[Admin / Tickets] Load Company Detail';
export const LOAD_COMPANY_DETAIL_ERROR = '[Admin Tickets/ Ticket] Load Company Detail Error';
export const LOAD_COMPANY_DETAIL_SUCCESS = '[Admin / Tickets] Load Company Detail Success';
export const LOAD_TICKET = '[Admin Tickets / Ticket] Load Ticket';
export const LOAD_TICKET_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Success';
export const LOAD_TICKET_ERROR = '[Admin Tickets / Ticket] Load Ticket Error';
export const OPEN_TICKET = '[Admin Tickets/ Ticket] Open Ticket';
export const SELECT_TICKET_TAB = '[Admin Tickets/ Ticket] Select Ticket Tab';
export const LOAD_TICKETTYPES = '[Admin Tickets / Ticket] Load Ticket Types';
export const LOAD_TICKETTYPES_SUCCESS = '[Admin Tickets / Ticket] Load Ticket Types Success';
export const LOAD_TICKETTYPES_ERROR = '[Admin Tickets / Ticket] Load Ticket Types Error';
export const LOAD_TICKETSTATES = '[Admin Tickets / Ticket] Load Ticket States';
export const LOAD_TICKETSTATES_SUCCESS = '[Admin Tickets / Ticket] Load Ticket States Success';
export const LOAD_TICKETSTATES_ERROR = '[Admin Tickets / Ticket] Load Ticket States Error';

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

  constructor(public payload: UserTicketTabItem) {}
}

export class SelectTicketTab implements  Action {
  readonly type = SELECT_TICKET_TAB;

  constructor(public payload: number) {}
}

export class LoadTicketTypes implements Action {
  readonly type = LOAD_TICKETTYPES;
}

export class LoadTicketTypesSuccess implements Action {
  readonly type = LOAD_TICKETTYPES_SUCCESS;

  constructor(public payload: UserTicketTypeResponse[]) {}
}

export class LoadTicketTypesError implements Action {
  readonly type = LOAD_TICKETTYPES_ERROR;
}

export class LoadTicketStates implements Action {
  readonly type = LOAD_TICKETSTATES;
}

export class LoadTicketStatesSuccess implements Action {
  readonly type = LOAD_TICKETSTATES_SUCCESS;

  constructor(public payload: UserTicketStateResponse[]) {}
}

export class LoadTicketStatesError implements Action {
  readonly type = LOAD_TICKETSTATES_ERROR;
}

export type Actions
  = LoadCompanyDetail
  | LoadCompanyDetailSuccess
  | LoadCompanyDetailError
  | LoadTicket
  | LoadTicketSuccess
  | LoadTicketError
  | OpenTicket
  | SelectTicketTab
  | LoadTicketTypes
  | LoadTicketTypesSuccess
  | LoadTicketTypesError
  | LoadTicketStates
  | LoadTicketStatesSuccess
  | LoadTicketStatesError;
