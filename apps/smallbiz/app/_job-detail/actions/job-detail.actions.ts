import { Action } from '@ngrx/store';
import { Job } from '../../shared/models/job';

export const LOAD_JOB = '[JOB DETAIL] LoadJob';
export const LOAD_JOB_SUCCESS = '[JOB DETAIL] LoadJobSuccess';
export const LOAD_JOB_FAILURE = '[JOB DETAIL] LoadJobFailure';

export const PRICE_JOB = '[JOB DETAIL] PriceJob';
export const PRICE_JOB_SUCCESS = '[JOB DETAIL] PriceJobSuccess';
export const PRICE_JOB_FAILURE = '[JOB DETAIL] PriceJobFailure';

export const LOCATION_SEARCH_TERM_CHANGED = '[JOB DETAIL] LocationSearchTermChanged';

export class LoadJob implements Action {
    readonly type = LOAD_JOB;
    constructor(public payload: { id: string }) { }
}

export class LoadJobSuccess implements Action {
    readonly type = LOAD_JOB_SUCCESS;
    constructor(public payload: { job: Job }) { }
}

export class LoadJobFailure implements Action {
    readonly type = LOAD_JOB_FAILURE;
    constructor(public error: any) { }
}

export type JobDetailAction = LoadJob | LoadJobSuccess | LoadJobFailure;
