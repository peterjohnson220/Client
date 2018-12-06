import { Action } from '@ngrx/store';

import { JobResult } from '../models';

export const GET_MORE_RESULTS = '[Project Add Jobs / Search Results] Get More Results';
export const GET_MORE_RESULTS_SUCCESS = '[Project Add Jobs / Search Results] Get More Results Success';
export const TOGGLE_JOB_SELECTION = '[Project Add Jobs / Search Results] Toggle Job Selection';

export class GetMoreResults implements Action {
  readonly type = GET_MORE_RESULTS;

  constructor() {}
}

export class GetMoreResultsSuccess implements Action {
  readonly type = GET_MORE_RESULTS_SUCCESS;

  constructor(public payload: JobResult[]) {}
}

export class ToggleJobSelection implements Action {
  readonly type = TOGGLE_JOB_SELECTION;

  constructor(public payload: JobResult) {}
}

export type Actions =
  ToggleJobSelection |
  GetMoreResults |
  GetMoreResultsSuccess;
