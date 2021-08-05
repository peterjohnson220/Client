import { Action } from '@ngrx/store';

import { SurveyDataCountryAccessDto } from 'libs/models/survey/survey-data-country-access-dto.model';
import { SurveyJobDetails } from 'libs/models/survey';
import { GetJobMatchesRequest } from 'libs/models/payfactors-api/survey/request';

export const OPEN_SURVEY_FIELDS_MODAL = '[Surveys / Surveys Page] Open Survey Fields Modal';
export const CLOSE_SURVEY_FIELDS_MODAL = '[Surveys / Surveys Page] Close Survey Fields Modal';
export const OPEN_PARTICIPANTS_MODAL = '[Surveys / Surveys Page] Open Participants Modal';
export const CLOSE_PARTICIPANTS_MODAL = '[Surveys / Surveys Page] Close Participants Modal';
export const GET_SURVEY_PARTICIPANTS = '[Surveys / Surveys Page] Get Survey Participants';
export const GET_SURVEY_PARTICIPANTS_SUCCESS = '[Surveys / Surveys Page] Get Survey Participants Success';
export const GET_SURVEY_PARTICIPANTS_ERROR = '[Surveys / Surveys Page] Get Survey Participants Error';
export const GET_SURVEY_COUNTRIES = '[Surveys / Surveys Page] Get Survey Countries';
export const GET_SURVEY_COUNTRIES_SUCCESS = '[Surveys / Surveys Page] Get Survey Countries Success';
export const GET_SURVEY_COUNTRIES_ERROR = '[Surveys / Surveys Page] Get Survey Countries Error';
export const GET_SURVEY_YEARS = '[Surveys / Surveys Page] Get Survey Years';
export const GET_SURVEY_YEARS_SUCCESS = '[Surveys / Surveys Page] Get Survey Years Success';
export const GET_SURVEY_YEARS_ERROR = '[Surveys / Surveys Page] Get Survey Years Error';
export const OPEN_SURVEY_DATA_GRID = '[Surveys / Surveys Page] Open Survey Data Grid';
export const RESET_OPENED_SURVEY_DATA_GRIDS = '[Surveys / Surveys Page] Reset Opened Survey Data Grid';
export const UPDATE_SURVEY_DATA_GRID_FIELDS = '[Surveys / Surveys Page] Update Survey Data Grid Fields';
export const RELOAD_SURVEY_DATA_GRID = '[Surveys / Surveys Page] Reload Survey Data Grid';
export const RELOAD_SURVEY_DATA_GRID_SUCCESS = '[Surveys / Surveys Page] Reload Survey Data Grid Success';
export const GET_SURVEY_JOB_DETAILS = '[Surveys / Surveys Page] Get Survey Job Details';
export const GET_SURVEY_JOB_DETAILS_SUCCESS = '[Surveys / Surveys Page] Get Survey Job Details Success';
export const GET_SURVEY_JOB_DETAILS_ERROR = '[Surveys / Surveys Page] Get Survey Job Details Error';
export const GET_SURVEY_JOB_MATCHES = '[Surveys / Surveys Page] Get Survey Job Matches';
export const GET_SURVEY_JOB_MATCHES_SUCCESS = '[Surveys / Surveys Page] Get Survey Job Matches Success';
export const GET_SURVEY_JOB_MATCHES_ERROR = '[Surveys / Surveys Page] Get Survey Job Matches Error';
export const GET_SURVEY_DATA_MATCHES = '[Surveys / Surveys Page] Get Survey Data Matches';
export const GET_SURVEY_DATA_MATCHES_SUCCESS = '[Surveys / Surveys Page] Get Survey Data Matches Success';
export const GET_SURVEY_DATA_MATCHES_ERROR = '[Surveys / Surveys Page] Get Survey Data Matches Error';


export class OpenSurveyFieldsModal implements Action {
  readonly type = OPEN_SURVEY_FIELDS_MODAL;
  constructor() {}
}

export class CloseSurveyFieldsModal implements Action {
  readonly type = CLOSE_SURVEY_FIELDS_MODAL;
  constructor() {}
}

export class OpenParticipantsModal implements Action {
  readonly type = OPEN_PARTICIPANTS_MODAL;
  constructor() {}
}

export class CloseParticipantsModal implements Action {
  readonly type = CLOSE_PARTICIPANTS_MODAL;
  constructor() {}
}

export class GetSurveyParticipants implements Action {
  readonly type = GET_SURVEY_PARTICIPANTS;
  constructor(public payload: number) {}
}

export class GetSurveyParticipantsSuccess implements Action {
  readonly type = GET_SURVEY_PARTICIPANTS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class GetSurveyParticipantsError implements Action {
  readonly type = GET_SURVEY_PARTICIPANTS_ERROR;
  constructor() {}
}

export class GetSurveyYears implements Action {
  readonly type = GET_SURVEY_YEARS;
  constructor() {}
}

export class GetSurveyYearsSuccess implements Action {
  readonly type = GET_SURVEY_YEARS_SUCCESS;
  constructor(public payload: number[]) {}
}

export class GetSurveyYearsError implements Action {
  readonly type = GET_SURVEY_YEARS_ERROR;
  constructor() {}
}

export class GetSurveyCountries implements Action {
  readonly type = GET_SURVEY_COUNTRIES;

  constructor() {}
}

export class GetSurveyCountriesSuccess implements Action {
  readonly type = GET_SURVEY_COUNTRIES_SUCCESS;

  constructor(public payload: SurveyDataCountryAccessDto[]) {}
}

export class GetSurveyCountriesError implements Action {
  readonly type = GET_SURVEY_COUNTRIES_ERROR;

  constructor() {}
}

export class OpenSurveyDataGrid implements Action {
  readonly type = OPEN_SURVEY_DATA_GRID;
  constructor(public surveyJobId: number) {}
}

export class ResetOpenedSurveyDataGrids implements Action {
  readonly type = RESET_OPENED_SURVEY_DATA_GRIDS;
  constructor() {}
}

export class UpdateSurveyDataGridFields implements Action {
  readonly type = UPDATE_SURVEY_DATA_GRID_FIELDS;
  constructor(public surveyJobId: number) {}
}

export class ReloadSurveyDataGrid implements Action {
  readonly type = RELOAD_SURVEY_DATA_GRID;
  constructor(public surveyJobId: number) {}
}

export class ReloadSurveyDataGridSuccess implements Action {
  readonly type = RELOAD_SURVEY_DATA_GRID_SUCCESS;
  constructor(public surveyJobId: number) {}
}

export class GetSurveyJobDetails implements Action {
  readonly type = GET_SURVEY_JOB_DETAILS;

  constructor(public surveyJobId: number) {}
}

export class GetSurveyJobDetailsSuccess implements Action {
  readonly type = GET_SURVEY_JOB_DETAILS_SUCCESS;

  constructor(public payload: SurveyJobDetails) {}
}

export class GetSurveyJobDetailsError implements Action {
  readonly type = GET_SURVEY_JOB_DETAILS_ERROR;

  constructor() {}
}

export class GetSurveyJobMatches implements Action {
  readonly type = GET_SURVEY_JOB_MATCHES;

  constructor(public payload: GetJobMatchesRequest) {}
}

export class GetSurveyJobMatchesSuccess implements Action {
  readonly type = GET_SURVEY_JOB_MATCHES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetSurveyJobMatchesError implements Action {
  readonly type = GET_SURVEY_JOB_MATCHES_ERROR;

  constructor() {}
}

export class GetSurveyDataMatches implements Action {
  readonly type = GET_SURVEY_DATA_MATCHES;

  constructor(public payload: GetJobMatchesRequest) {}
}

export class GetSurveyDataMatchesSuccess implements Action {
  readonly type = GET_SURVEY_DATA_MATCHES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetSurveyDataMatchesError implements Action {
  readonly type = GET_SURVEY_DATA_MATCHES_ERROR;

  constructor() {}
}

export type Actions
  = OpenSurveyFieldsModal
  | CloseSurveyFieldsModal
  | OpenParticipantsModal
  | CloseParticipantsModal
  | GetSurveyParticipants
  | GetSurveyParticipantsSuccess
  | GetSurveyParticipantsError
  | GetSurveyCountries
  | GetSurveyCountriesSuccess
  | GetSurveyCountriesError
  | GetSurveyYears
  | GetSurveyYearsSuccess
  | GetSurveyYearsError
  | OpenSurveyDataGrid
  | ResetOpenedSurveyDataGrids
  | UpdateSurveyDataGridFields
  | ReloadSurveyDataGrid
  | ReloadSurveyDataGridSuccess
  | GetSurveyJobDetails
  | GetSurveyJobDetailsSuccess
  | GetSurveyJobDetailsError
  | GetSurveyJobMatches
  | GetSurveyJobMatchesSuccess
  | GetSurveyJobMatchesError
  | GetSurveyDataMatches
  | GetSurveyDataMatchesSuccess
  | GetSurveyDataMatchesError;
