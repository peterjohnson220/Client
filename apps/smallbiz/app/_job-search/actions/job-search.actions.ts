import { Action } from '@ngrx/store';

export const JOB_SEARCH = '[JOB SEARCH] Search';
export const JOB_SEARCH_SUCCESS = '[JOB SEARCH] SearchSuccess';
export const JOB_SEARCH_FAILURE = '[JOB SEARCH] SearchFailure';

export class JobSearch implements Action {
    readonly type = JOB_SEARCH;
    constructor(public payload: { searchTerm: string }) {}
}

export class JobSearchSuccess implements Action {
    readonly type = JOB_SEARCH_SUCCESS;
    constructor(public payload: { searchResults: any[] }) {}
}

export class JobSearchFailure implements Action {
    readonly type = JOB_SEARCH_FAILURE;
    constructor(public error: any) {}
}

export type JobSearchAction = JobSearch | JobSearchSuccess | JobSearchFailure;
