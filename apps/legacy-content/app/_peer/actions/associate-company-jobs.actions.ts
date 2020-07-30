import { Action } from '@ngrx/store';

import { UpsertExchangeJobMapRequest, ExchangeJobSearch, LatestCompanyJob, GenericKeyValue } from 'libs/models';

export const INITIAL_LOAD_SUCCESS = '[Legacy Content/Exchange Jobs] Initial Load Complete';
export const LOAD_EXCHANGE_JOBS = '[Legacy Content/Exchange Jobs] Load Exchange Jobs';
export const LOAD_EXCHANGE_JOBS_SUCCESS = '[Legacy Content/Exchange Jobs] Load Exchange Jobs Success';
export const LOAD_EXCHANGE_JOBS_ERROR = '[Legacy Content/Exchange Jobs] Load Exchange Jobs Error';
export const MAP_EXCHANGE_JOB = '[Legacy Content/Exchange Jobs] Map Exchange Job';
export const MAP_EXCHANGE_JOB_SUCCESS = '[Legacy Content/Exchange Jobs] Map Exchange Job Success';
export const MAP_EXCHANGE_JOB_ERROR = '[Legacy Content/Exchange Jobs] Map Exchange Job Error';
export const LOAD_COMPANY_JOB = '[Legacy Content/Exchange Jobs] Load Company Job';
export const LOAD_COMPANY_JOB_SUCCESS = '[Legacy Content/Exchange Jobs] Load Company Success';
export const LOAD_COMPANY_JOB_ERROR = '[Legacy Content/Exchange Jobs] Load Company Error';
export const LOAD_EXCHANGE_DICTIONARY = '[Legacy Content/Exchange Jobs] Load Exchange Dictionary';
export const LOAD_EXCHANGE_DICTIONARY_SUCCESS = '[Legacy Content/Exchange Jobs] Load Exchange Dictionary Success';
export const LOAD_EXCHANGE_DICTIONARY_ERROR = '[Legacy Content/Exchange Jobs] Load Exchange Dictionary Error';
export const LOAD_ACTIVE_EXCHANGE = '[Legacy Content/Exchange Jobs] Load Active Exchange';
export const LOAD_ACTIVE_EXCHANGE_SUCCESS = '[Legacy Content/Exchange Jobs] Load Active Exchange Success';
export const LOAD_ACTIVE_EXCHANGE_ERROR = '[Legacy Content/Exchange Jobs] Load Active Exchange Error';

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

export class LoadExchangeDictionary implements Action {
  readonly type = LOAD_EXCHANGE_DICTIONARY;

  constructor(public payload: number) {}
}

export class LoadExchangeDictionarySuccess implements Action {
  readonly type = LOAD_EXCHANGE_DICTIONARY_SUCCESS;

  constructor(public payload: GenericKeyValue<number, string>[]) {}
}

export class LoadExchangeDictionaryError implements Action {
  readonly type = LOAD_EXCHANGE_DICTIONARY_ERROR;
}

export class LoadActiveExchange implements Action {
  readonly type = LOAD_ACTIVE_EXCHANGE;
}

export class LoadActiveExchangeSuccess implements Action {
  readonly type = LOAD_ACTIVE_EXCHANGE_SUCCESS;

  constructor(public payload: number) {}
}

export class LoadActiveExchangeError implements Action {
  readonly type = LOAD_ACTIVE_EXCHANGE_ERROR;
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
    | MapExchangeJobsError
    | LoadExchangeDictionary
    | LoadExchangeDictionarySuccess
    | LoadExchangeDictionaryError
    | LoadActiveExchange
    | LoadActiveExchangeSuccess
    | LoadActiveExchangeError;
