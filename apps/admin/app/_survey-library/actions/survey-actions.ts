import { Action } from '@ngrx/store';

export const SET_MAP_COMPANIES_MODAL_OPEN = '[Admin / Survey Library] Map Companies Modal Open';
export const GET_MAP_COMPANIES_MODAL_DATA = '[Admin / Survey Library] Get Map Companies Modal Data';
export const GET_MAP_COMPANIES_MODAL_DATA_SUCCESS = '[Admin / Survey Library] Get Map Companies Modal Data Success';
export const GET_MAP_COMPANIES_MODAL_DATA_FAILED = '[Admin / Survey Library] Get Map Companies Modal Data Failed';
export const SET_ADD_SURVEY_MODAL_OPEN = '[Admin / Survey Library] Add Survey Modal Open';
export const GET_SURVEY_DATA = '[Admin / Survey Library] Get Survey Data';
export const GET_SURVEY_DATA_SUCCESS = '[Admin / Survey Library] Get Survey Data Success';
export const GET_SURVEY_DATA_FAILED = '[Admin / Survey Library] Get Survey Data Failed';
export const SHOULD_REFRESH_GRID = '[Admin / Survey Library] Should Refresh Grid';
export const SET_COPY_SURVEY_MODAL_OPEN = '[Admin / Survey Library] Copy Survey Modal Open';
export const SET_DELETE_CONFIRMATION_MODAL_OPEN = '[Admin / Survey Library] Delete Confirmation Modal Open';


export class SetMapCompaniesModalOpen implements Action {
    readonly type = SET_MAP_COMPANIES_MODAL_OPEN;
    constructor(public isOpen: boolean) { }
}

export class SetDeleteConfirmationModalOpen implements Action {
    readonly type = SET_DELETE_CONFIRMATION_MODAL_OPEN;
    constructor(public isOpen: boolean) { }
}

export class GetMapCompaniesModalData implements Action {
    readonly type = GET_MAP_COMPANIES_MODAL_DATA;
    constructor(public surveyId: number, public searchText: string) { }
}

export class GetMapCompaniesModalDataSuccess implements Action {
    readonly type = GET_MAP_COMPANIES_MODAL_DATA_SUCCESS;
    constructor(public mapModalData: any) { }
}

export class GetMapCompaniesModalDataFailed implements Action {
    readonly type = GET_MAP_COMPANIES_MODAL_DATA_FAILED;
    constructor() { }
}

export class SetAddSurveyModalOpen implements Action {
    readonly type = SET_ADD_SURVEY_MODAL_OPEN;
    constructor(public isOpen: boolean) { }
}

export class GetSurveys implements Action {
    readonly type = GET_SURVEY_DATA;
    constructor(public surveyId: number, public searchText: string) { }
}

export class GetSurveysSuccess implements Action {
    readonly type = GET_SURVEY_DATA_SUCCESS;
    constructor(public payload: any) { }
}

export class GetSurveysFailed implements Action {
    readonly type = GET_SURVEY_DATA_FAILED;
    constructor() { }
}

export class ShouldRefreshGrid implements Action {
    readonly type = SHOULD_REFRESH_GRID;
    constructor(public shouldRefresh: boolean) { }
}

export class SetCopySurveyModalOpen implements Action {
    readonly type = SET_COPY_SURVEY_MODAL_OPEN;
    constructor(public isOpen: boolean) { }
}

export type Actions
    = SetMapCompaniesModalOpen
    | SetAddSurveyModalOpen
    | SetDeleteConfirmationModalOpen
    | GetMapCompaniesModalData
    | GetMapCompaniesModalDataSuccess
    | GetMapCompaniesModalDataFailed
    | GetSurveys
    | GetSurveysSuccess
    | GetSurveysFailed
    | ShouldRefreshGrid
    | SetCopySurveyModalOpen;
