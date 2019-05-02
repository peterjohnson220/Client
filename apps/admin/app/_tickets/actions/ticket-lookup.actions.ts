import {Action} from '@ngrx/store';

import {UserTicketTypeResponse} from 'libs/models/payfactors-api/service/response';

import {PfServicesRep, UserTicketState} from '../models';

export const LOAD_PFSERVICESREPS = '[Admin Tickets / Ticket Fields] Load Pf Services Reps';
export const LOAD_PFSERVICESREPS_SUCCESS = '[Admin Tickets / Ticket Fields] Load Pf Services Reps Success';
export const LOAD_PFSERVICESREPS_ERROR = '[Admin Tickets / Ticket Fields] Load Pf Services Reps Error';
export const LOAD_TICKETTYPES = '[Admin Tickets / Ticket Fields] Load Ticket Types';
export const LOAD_TICKETTYPES_SUCCESS = '[Admin Tickets / Ticket Fields] Load Ticket Types Success';
export const LOAD_TICKETTYPES_ERROR = '[Admin Tickets / Ticket Fields] Load Ticket Types Error';
export const LOAD_TICKETSTATES = '[Admin Tickets / Ticket Fields] Load Ticket States';
export const LOAD_TICKETSTATES_SUCCESS = '[Admin Tickets / Ticket Fields] Load Ticket States Success';
export const LOAD_TICKETSTATES_ERROR = '[Admin Tickets / Ticket Fields] Load Ticket States Error';

export class LoadPfServiceReps implements Action {
  readonly type = LOAD_PFSERVICESREPS;
}

export class LoadPfServiceRepsSuccess implements Action {
  readonly type = LOAD_PFSERVICESREPS_SUCCESS;

  constructor(public payload: PfServicesRep[]) {}
}

export class LoadPfServiceRepsError implements Action {
  readonly type = LOAD_PFSERVICESREPS_ERROR;
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

  constructor(public payload: UserTicketState[]) {}
}

export class LoadTicketStatesError implements Action {
  readonly type = LOAD_TICKETSTATES_ERROR;
}

export type Actions
  = LoadPfServiceReps
  | LoadPfServiceRepsSuccess
  | LoadPfServiceRepsError
  | LoadTicketTypes
  | LoadTicketTypesSuccess
  | LoadTicketTypesError
  | LoadTicketStates
  | LoadTicketStatesSuccess
  | LoadTicketStatesError;
