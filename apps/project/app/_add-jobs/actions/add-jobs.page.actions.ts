import { Action } from '@ngrx/store';

export const CLOSE_JOBS_SEARCH = '[Project Add Jobs/Add Jobs Page] Close Add Jobs';

export class CloseJobsSearch implements Action {
  readonly type = CLOSE_JOBS_SEARCH;

  constructor() {}
}

export type Actions
  = CloseJobsSearch;
