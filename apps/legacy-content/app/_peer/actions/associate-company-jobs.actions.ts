import { Action } from '@ngrx/store';

import { UpsertExchangeJobMapRequest, ExchangeJobSearch, LatestCompanyJob } from 'libs/models';

export const INITIAL_LOAD_SUCCESS = '[Legacy Content/Exchange Jobs] Initial Load Complete';
export const LOAD_EXCHANGE_JOBS = '[Legacy Content/Exchange Jobs] Load Exchange Jobs';
export const LOAD_EXCHANGE_JOBS_SUCCESS = '[Legacy Content/Exchange Jobs] Load Exchange Jobs Success';
export const LOAD_EXCHANGE_JOBS_ERROR = '[Legacy Content/Exchange Jobs] Load Exchange Jobs Error';
export const MAP_EXCHANGE_JOB = '[Legacy Content/Exchange Jobs] Map Exchange Job';
export const MAP_EXCHANGE_JOB_SUCCESS = '[Legacy Content/Exchange Jobs] Map Exchange Job Success';
export const MAP_EXCHANGE_JOB_ERROR = '[Legacy Content/Exchange Jobs] Map Exchange Job Error';
export const LOAD_COMPANY_JOB = '[Legacy Content/Exchange Jobs] Load Company Job';
export const LOAD_COMPANY_JOB_ERROR = '[Legacy Content/Exchange Jobs] Load Company Error';
export const LOAD_COMPANY_JOB_SUCCESS = '[Legacy Content/Exchange Jobs] Load Company Success';

export class LoadExchangeJobs implements Action {
    readonly type = LOAD_EXCHANGE_JOBS;

    constructor(public payload: any) { }
}

export class LoadExchangeJobsSuccess implements Action {
    readonly type = LOAD_EXCHANGE_JOBS_SUCCESS;

    constructor(public payload: ExchangeJobSearch[]) { }
}

export class LoadExchangeJobsError implements Action {
    readonly type = LOAD_EXCHANGE_JOBS_ERROR;
}

export class LoadCompanyJob implements Action {
    readonly type = LOAD_COMPANY_JOB;

    constructor(public payload: number) { }
}

export class LoadCompanyJobSuccess implements Action {
    readonly type = LOAD_COMPANY_JOB_SUCCESS;

    constructor(public payload: LatestCompanyJob) { }
}

export class LoadCompanyJobError implements Action {
    readonly type = LOAD_COMPANY_JOB_ERROR;
}

export class MapExchangeJob implements Action {
    readonly type = MAP_EXCHANGE_JOB;
    constructor(public payload: UpsertExchangeJobMapRequest) { }
}

export class MapExchangeJobSuccess implements Action {
    readonly type = MAP_EXCHANGE_JOB_SUCCESS;
}

export class MapExchangeJobsError implements Action {
    readonly type = MAP_EXCHANGE_JOB_ERROR;
}

export type Actions
    = LoadExchangeJobs
    | LoadExchangeJobsSuccess
    | LoadExchangeJobsError
    | LoadCompanyJob
    | LoadCompanyJobError
    | LoadCompanyJobSuccess
    | MapExchangeJob
    | MapExchangeJobSuccess
    | MapExchangeJobsError;
