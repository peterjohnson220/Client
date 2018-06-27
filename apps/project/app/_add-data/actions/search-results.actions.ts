import { Action } from '@ngrx/store';

import { JobResult } from '../models';

export const GET_RESULTS = '[Project Add Data/Search Results] Get Results';
export const GET_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get Results Success';
export const GET_MORE_RESULTS = '[Project Add Data/Search Results] Get More Results';
export const GET_MORE_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get More Results Success';

export class GetResults implements Action {
  readonly type = GET_RESULTS;
}

export class GetResultsSuccess implements Action {
  readonly type = GET_RESULTS_SUCCESS;

  constructor(public payload: JobResult[]) {}
}

export class GetMoreResults implements Action {
  readonly type = GET_MORE_RESULTS;
}

export class GetMoreResultsSuccess implements Action {
  readonly type = GET_MORE_RESULTS_SUCCESS;

  constructor(public payload: JobResult[]) {}
}

export type Actions
  = GetResults
  | GetResultsSuccess
  | GetMoreResults
  | GetMoreResultsSuccess;
