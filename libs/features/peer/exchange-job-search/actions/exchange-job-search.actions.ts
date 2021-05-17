import { Action } from '@ngrx/store';

export const RESET_STATE = '[Libs/Peer/Exchange Job Search] Reset State';
export const SET_CONTEXT = '[Libs/Peer/Exchange Job Search] Set Context';
export const ADD_EXCHANGE_JOB_RESULTS = '[Libs/Peer/Exchange Job Search] Add Exchange Job Search Results';
export const REPLACE_EXCHANGE_JOB_RESULTS = '[Libs/Peer/Exchange Job Search] Replace Exchange Job Search Results';
export const CLEAR_EXCHANGE_JOB_RESULTS = '[Libs/Peer/Exchange Job Search] Clear Exchange Job Search Results';
export const TOGGLE_EXCHANGE_JOB_SELECTION = 'Libs/Peer/Exchange Job Search] Toggle Exchange Jobs Selection';
export const CLEAR_SELECTED_EXCHANGE_JOBS = 'Libs/Peer/Exchange Job Search] Clear Selected Exchange Jobs';

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: {exchangeId: number}) {}
}

export class AddExchangeJobResults implements Action {
  readonly type = ADD_EXCHANGE_JOB_RESULTS;

  constructor(public payload: { exchangeJobResults: any[], noResultsMessage: string }) {} // TODO: [JP] Type
}

export class ReplaceExchangeJobResults implements Action {
  readonly type = REPLACE_EXCHANGE_JOB_RESULTS;

  constructor(public payload: { exchangeJobResults: any[], noResultsMessage: string }) {} // TODO: [JP] Type
}

export class ClearExchangeJobResults implements Action {
  readonly type = CLEAR_EXCHANGE_JOB_RESULTS;
}

export class ToggleExchangeJobSelection implements Action {
  readonly type = TOGGLE_EXCHANGE_JOB_SELECTION;

  constructor(public payload: { exchangeJob: any }) {} // TODO: [JP] Type
}

export class ClearSelectedExchangeJobs implements Action {
  readonly type = CLEAR_SELECTED_EXCHANGE_JOBS;
}


export type ExchangeJobSearchActions =
  SetContext
  | ResetState
  | AddExchangeJobResults
  | ReplaceExchangeJobResults
  | ClearExchangeJobResults
  | ToggleExchangeJobSelection
  | ClearSelectedExchangeJobs;
