import { Action } from '@ngrx/store';

import { UserTicketTypeResponse } from 'libs/models/payfactors-api/service/response';

export const LOAD_TICKET_TYPES  = '[Service / Service Page] Load Ticket Types';
export const LOAD_TICKET_TYPES_SUCCESS  = '[Service / Service Page] Load Ticket Types Success';
export const LOAD_TICKET_TYPES_ERROR  = '[Service / Service Page] Load Ticket Types Error';


export class LoadTicketTypes implements Action {
  readonly type = LOAD_TICKET_TYPES;

  constructor() {}
}

export class LoadTicketTypesSuccess implements Action {
  readonly type = LOAD_TICKET_TYPES_SUCCESS;

  constructor(public payload: UserTicketTypeResponse[]) {}
}

export class LoadTicketTypesError implements Action {
  readonly type = LOAD_TICKET_TYPES_ERROR;

  constructor(public payload: any) {}
}

export type Actions
  = LoadTicketTypes
  | LoadTicketTypesSuccess
  | LoadTicketTypesError;
