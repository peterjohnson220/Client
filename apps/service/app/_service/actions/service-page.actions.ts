import { Action } from '@ngrx/store';

import { UploadedFile, UserTicketDto } from 'libs/models/service';

import { TicketType } from '../models';

export const LOAD_TICKET_TYPES  = '[Service / Service Page] Load Ticket Types';
export const LOAD_TICKET_TYPES_SUCCESS  = '[Service / Service Page] Load Ticket Types Success';
export const LOAD_TICKET_TYPES_ERROR  = '[Service / Service Page] Load Ticket Types Error';
export const SHOW_NEW_TICKET_MODAL  = '[Service / Service Page] Show New Ticket Modal';
export const CREATE_USER_TICKET  = '[Service / Service Page] Create User Ticket';
export const CREATE_USER_TICKET_SUCCESS  = '[Service / Service Page] Create User Ticket Success';
export const CREATE_USER_TICKET_ERROR  = '[Service / Service Page] Create User Ticket Error';

export class LoadTicketTypes implements Action {
  readonly type = LOAD_TICKET_TYPES;

  constructor() {}
}

export class LoadTicketTypesSuccess implements Action {
  readonly type = LOAD_TICKET_TYPES_SUCCESS;

  constructor(public payload: TicketType[]) {}
}

export class LoadTicketTypesError implements Action {
  readonly type = LOAD_TICKET_TYPES_ERROR;

  constructor(public payload: any) {}
}

export class ShowNewTicketModal implements Action {
  readonly type = SHOW_NEW_TICKET_MODAL;

  constructor(public payload: boolean) {}
}

export class CreateUserTicket implements Action {
  readonly type = CREATE_USER_TICKET;

  constructor(public payload: { ticket: UserTicketDto, fileData: UploadedFile[]}) {}
}

export class CreateUserTicketSuccess implements Action {
  readonly type = CREATE_USER_TICKET_SUCCESS;

  constructor() {}
}

export class CreateUserTicketError implements Action {
  readonly type = CREATE_USER_TICKET_ERROR;

  constructor(public payload: string) {}
}

export type Actions
  = LoadTicketTypes
  | LoadTicketTypesSuccess
  | LoadTicketTypesError
  | ShowNewTicketModal
  | CreateUserTicket
  | CreateUserTicketSuccess
  | CreateUserTicketError;
