import { Action } from '@ngrx/store';

import { Match } from 'libs/models/company';

export const LOADING  = '[Jobs/Matches Modal] Loading Matches';
export const LOADING_SUCCESS  = '[Jobs/Matches Modal] Loading Matches Success';
export const LOADING_ERROR  = '[Jobs/Matches Modal] Loading Matches Error';
export const UPDATE_EXCLUDE_FROM_PARTICIPATION  = '[Jobs/Matches Modal] Updates the flag for ExcludeFromParticipation in a company job';
export const UPDATE_EXCLUDE_FROM_PARTICIPATION_SUCCESS  = '[Jobs/Matches Modal] Updates flag for ExcludeFromParticipation. Success';
export const UPDATE_EXCLUDE_FROM_PARTICIPATION_ERROR  = '[Jobs/Matches Modal] Updates flag for ExcludeFromParticipation. Error';

export class Loading implements Action {
  readonly type = LOADING;

  constructor(public payload: number) { }
}

export class LoadingSuccess implements Action {
  readonly type = LOADING_SUCCESS;

  constructor(public payload: Match[]) {}
}

export class LoadingError implements Action {
  readonly type = LOADING_ERROR;
}

export class UpdateExcludeFromParticipation implements Action {
  readonly type = UPDATE_EXCLUDE_FROM_PARTICIPATION;

  constructor(public payload: { CompanyJobPricingMatchIds: number[], ExcludeFromParticipation: boolean }) {}
}

export class UpdateExcludeFromParticipationSuccess implements Action {
  readonly type = UPDATE_EXCLUDE_FROM_PARTICIPATION_SUCCESS;
}

export class UpdateExcludeFromParticipationError implements Action {
  readonly type = UPDATE_EXCLUDE_FROM_PARTICIPATION_ERROR;
}

export type Actions
  = Loading
  | LoadingSuccess
  | LoadingError
  | UpdateExcludeFromParticipation
  | UpdateExcludeFromParticipationSuccess
  | UpdateExcludeFromParticipationError;
