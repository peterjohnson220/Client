import { Action } from '@ngrx/store';

import { JobResult } from '../models';

export const TOGGLE_JOB_SELECTION = '[Project Add Jobs/Search Results] Toggle Job Selection';
export const REPLACE_JOB_RESULTS = '[Project Add Jobs/Search Results] Replace Job Results';
export const ADD_JOB_RESULTS = '[Project Add Jobs/Search Results] Add Job Results';
export const CLEAR_SELECTED_JOBS = '[Project Add Jobs/Search Results] Clear Selected Jobs';

export class ToggleJobSelection implements Action {
  readonly type = TOGGLE_JOB_SELECTION;

  constructor(public payload: JobResult) {}
}

export class ReplaceJobResults implements Action {
  readonly type = REPLACE_JOB_RESULTS;

  constructor(public payload: JobResult[]) {}
}

export class AddJobResults implements Action {
  readonly type = ADD_JOB_RESULTS;

  constructor(public payload: JobResult[]) {}
}

export class ClearSelectedJobs implements Action {
  readonly type = CLEAR_SELECTED_JOBS;

  constructor() {}
}

export type Actions
  = ToggleJobSelection
  | ReplaceJobResults
  | AddJobResults
  | ClearSelectedJobs;

