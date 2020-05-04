import { Action } from '@ngrx/store';
import { PricingNote } from 'libs/models/payfactors-api';

export const RESET_STATE = '[Notes Manager] Reset State';
export const GET_NOTES = '[Notes Manager] Get Notes';
export const GET_NOTES_SUCCESS = '[Notes Manager] Get Notes Success';
export const GET_NOTES_ERROR = '[Notes Manager] Get Notes Error';

export class ResetState implements Action {
  readonly type = RESET_STATE;
  constructor() { }
}

export class GetNotes implements Action {
  readonly type = GET_NOTES;
  constructor(public payload: number) { }
}

export class GetNotesSuccess implements Action {
  readonly type = GET_NOTES_SUCCESS;
  constructor(public payload: PricingNote[]) { }
}

export class GetNotesError implements Action {
  readonly type = GET_NOTES_ERROR;
  constructor() { }
}

export type Actions
  = ResetState
  | GetNotes
  | GetNotesSuccess
  | GetNotesError;
