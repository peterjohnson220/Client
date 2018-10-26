import { Action } from '@ngrx/store';
import { Job } from '../models/job';
import { JobSearchResult } from '../models/job-search-result';

export const JOB_SEARCH = '[JOB SEARCH] Search';
export const JOB_SEARCH_SUCCESS = '[JOB SEARCH] SearchSuccess';
export const JOB_SEARCH_FAILURE = '[JOB SEARCH] SearchFailure';
export const JOB_SELECTED = '[JOB SEARCH] Selected';

export class JobSearch implements Action {
  readonly type = JOB_SEARCH;
  constructor(public payload: { searchTerm: string }) { }
}

export class JobSearchSuccess implements Action {
  readonly type = JOB_SEARCH_SUCCESS;
  constructor(public payload: { searchResult: JobSearchResult }) { }
}

export class JobSearchFailure implements Action {
  readonly type = JOB_SEARCH_FAILURE;
  constructor(public error: any) { }
}

export class JobSelected implements Action {
  readonly type = JOB_SELECTED;
  constructor(public payload: { selected: Job }) { }
}

export type JobSearchAction =
  JobSearch |
  JobSearchSuccess |
  JobSearchFailure |
  JobSelected;
