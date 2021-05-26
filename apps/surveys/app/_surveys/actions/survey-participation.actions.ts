import { Action } from '@ngrx/store';

import { SurveyInfoByCompanyDto, SurveyParticipation } from 'libs/models/survey';

export const GET_SURVEY_INFO = '[Surveys / Survey Participation] Get Survey Info';
export const GET_SURVEY_INFO_SUCCESS = '[Surveys / Survey Participation] Get Survey Info Success';
export const GET_SURVEY_INFO_ERROR = '[Surveys / Survey Participation] Get Survey Info Error';
export const OPEN_SURVEY_PARTICIPATION_MODAL = '[Surveys / Survey Participation] Open Survey Participation Modal';
export const CLOSE_SURVEY_PARTICIPATION_MODAL = '[Surveys / Survey Participation] Close Survey Participation Modal';
export const UPLOAD_SURVEY_PARTICIPATION_FILE = '[Surveys / Survey Participation] Upload Survey Participation File';
export const UPLOAD_SURVEY_PARTICIPATION_FILE_ERROR = '[Surveys / Survey Participation] Upload Survey Participation File Error';
export const SAVE_SURVEY_PARTICIPATION = '[Surveys / Survey Participation] Save Survey Participation';
export const SAVE_SURVEY_PARTICIPATION_SUCCESS = '[Surveys / Survey Participation] Save Survey Participation Success';
export const SAVE_SURVEY_PARTICIPATION_ERROR = '[Surveys / Survey Participation] Save Survey Participation Error';
export const RESET_SURVEY_PARTICIPATION_UPLOAD_STATUS = '[Surveys / Survey Participation] Reset Survey Participation Upload Status';

export class GetSurveyInfo implements Action {
  readonly type = GET_SURVEY_INFO;
  constructor() {}
}

export class GetSurveyInfoSuccess implements Action {
  readonly type = GET_SURVEY_INFO_SUCCESS;
  constructor(public payload: SurveyInfoByCompanyDto[]) {}
}

export class GetSurveyInfoError implements Action {
  readonly type = GET_SURVEY_INFO_ERROR;
  constructor() {}
}

export class OpenSurveyParticipationModal implements Action {
  readonly type = OPEN_SURVEY_PARTICIPATION_MODAL;
  constructor() {}
}

export class CloseSurveyParticipationModal implements Action {
  readonly type = CLOSE_SURVEY_PARTICIPATION_MODAL;
  constructor() {}
}

export class UploadSurveyParticipationFile implements Action {
  readonly type = UPLOAD_SURVEY_PARTICIPATION_FILE;
  constructor(public payload: SurveyInfoByCompanyDto) {}
}

export class UploadSurveyParticipationFileError implements Action {
  readonly type = UPLOAD_SURVEY_PARTICIPATION_FILE_ERROR;
  constructor(public payload: SurveyInfoByCompanyDto) {}
}

export class SaveSurveyParticipation implements Action {
  readonly type = SAVE_SURVEY_PARTICIPATION;
  constructor(public payload: SurveyInfoByCompanyDto) {}
}

export class SaveSurveyParticipationSuccess implements Action {
  readonly type = SAVE_SURVEY_PARTICIPATION_SUCCESS;
  constructor(public payload: SurveyParticipation) {}
}

export class SaveSurveyParticipationError implements Action {
  readonly type = SAVE_SURVEY_PARTICIPATION_ERROR;
  constructor(public payload: SurveyInfoByCompanyDto) {}
}

export class ResetUploadStatus implements Action {
  readonly type = RESET_SURVEY_PARTICIPATION_UPLOAD_STATUS;
  constructor(public surveyId: number) {}
}

export type Actions
  = GetSurveyInfo
  | GetSurveyInfoSuccess
  | GetSurveyInfoError
  | OpenSurveyParticipationModal
  | CloseSurveyParticipationModal
  | UploadSurveyParticipationFile
  | UploadSurveyParticipationFileError
  | SaveSurveyParticipation
  | SaveSurveyParticipationSuccess
  | SaveSurveyParticipationError
  | ResetUploadStatus;
