import { Action } from '@ngrx/store';

import { CompanyListResponseModel } from 'libs/models/payfactors-api/company/response';

// Companies Page Actions
export const LOAD_COMPANIES = '[Pf-Admin / Companies] Load Pf-Admin Companies';
export const LOAD_COMPANIES_ERROR = '[Pf-Admin / Companies] Load Pf-Admin Companies Error';
export const LOAD_COMPANIES_SUCCESS = '[Pf-Admin / Companies] Load Pf-Admin Companies Success';
export const UPDATE_SEARCH_TERM = '[Pf-Admin / Companies] Update Search Term';



export class LoadCompanies implements Action {
    readonly type = LOAD_COMPANIES;
}

export class LoadCompaniesError implements Action {
    readonly type = LOAD_COMPANIES_ERROR;
}

export class LoadCompaniesSuccess implements Action {
    readonly type = LOAD_COMPANIES_SUCCESS;

    constructor(public payload: CompanyListResponseModel[]) {}
}

export class UpdateSearchTerm implements Action {
    readonly type = UPDATE_SEARCH_TERM;

    constructor(public payload: string) {}
}


export type Actions
    = LoadCompanies
    | LoadCompaniesError
    | LoadCompaniesSuccess
    | UpdateSearchTerm;
