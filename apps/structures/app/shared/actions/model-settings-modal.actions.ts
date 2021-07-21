import { Action } from '@ngrx/store';

import { Currency, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models';
import { GetStructureHasSettingsRequestModel } from 'libs/models/payfactors-api/structures';

import { ControlPoint } from '../models';

export const OPEN_GRADE_MODAL = '[Structures - Range - Model Settings] Open Grade Modal';
export const OPEN_JOB_MODAL = '[Structures - Range - Model Settings] Open Job Modal';
export const CLOSE_MODAL = '[Structures - Range - Model Settings] Close Modal';
export const GET_CURRENCIES = '[Structures - Range - Model Settings] Get Currencies';
export const GET_CURRENCIES_SUCCESS = '[Structures - Range - Model Settings] Get Currencies Success';
export const GET_CURRENCIES_ERROR = '[Structures - Range - Model Settings] Get Currencies Error';
export const GET_SURVEY_UDFS = '[Structures - Range - Model Settings] Get Survey UDFs';
export const GET_SURVEY_UDFS_SUCCESS = '[Structures - Range - Model Settings] Get Survey UDFs Success';
export const GET_SURVEY_UDFS_ERROR = '[Structures - Range - Model Settings] Get Survey UDFs Error';
export const GET_CONTROL_POINTS = '[Structures - Range - Model Settings] Get Control Points';
export const GET_CONTROL_POINTS_SUCCESS = '[Structures - Range - Model Settings] Get Control Points Success';
export const GET_CONTROL_POINTS_ERROR = '[Structures - Range - Model Settings] Get Control Points Error';
export const GET_STRUCTURE_NAME_SUGGESTIONS = '[Structures - Range - Model Settings] Get Structure Name Suggestions';
export const GET_STRUCTURE_NAME_SUGGESTIONS_SUCCESS = '[Structures - Range - Model Settings] Get Structure Name Suggestions Success';
export const GET_STRUCTURE_NAME_SUGGESTIONS_ERROR = '[Structures - Range - Model Settings] Get Structure Name Suggestions Error';
export const MODEL_NAME_EXISTS_FAILURE = '[Structures - Range - Model Settings] Model Name Exists Failure';
export const CLEAR_MODEL_NAME_EXISTS_FAILURE = '[Structures - Range - Model Settings] Clear Name Exists Failure';
export const CANCEL = '[Structures - Range - Model Settings] Cancel';
export const SAVE_JOB_BASED_MODEL_SETTINGS = '[Structures - Job Based Range - Model Settings] Save Model Settings';
export const SAVE_JOB_BASED_MODEL_SETTINGS_SUCCESS = '[Structures - Job Based Range - Model Settings] Save Model Settings Success';
export const SAVE_JOB_BASED_MODEL_SETTINGS_ERROR = '[Structures - Job Based Range - Model Settings] Save Model Settings Error';
export const SAVE_GRADE_BASED_MODEL_SETTINGS = '[Structures - Grade Based Range - Model Settings] Save Model Settings';
export const SAVE_GRADE_BASED_MODEL_SETTINGS_SUCCESS = '[Structures - Grade Based Range - Model Settings] Save Model Settings Success';
export const SAVE_GRADE_BASED_MODEL_SETTINGS_ERROR = '[Structures - Grade Based Range - Model Settings] Save Model Settings Error';
export const GET_GRADES_DETAILS = '[Structures - Grade Based Range - Model Settings] Get Grades Details';
export const GET_GRADES_DETAILS_SUCCESS = '[Structures - Grade Based Range - Model Settings] Get Grades Details Success';
export const GET_GRADES_DETAILS_ERROR = '[Structures - Grade Based Range - Model Settings] Get Grades Details Error';
export const GET_STRUCTURE_HAS_SETTINGS = '[Structures - Job Based Range - Shared] Get Structure Has Settings';
export const GET_STRUCTURE_HAS_SETTINGS_SUCCESS = '[Structures - Job Based Range - Shared] Get Structure Has Settings Success';
export const GET_STRUCTURE_HAS_SETTINGS_ERROR = '[Structures - Job Based Range - Shared] Get Structure Has Settings Error';

export class OpenGradeModal implements Action {
  readonly type = OPEN_GRADE_MODAL;
}

export class OpenJobModal implements Action {
  readonly type = OPEN_JOB_MODAL;
}

export class CloseModal implements Action {
  readonly type = CLOSE_MODAL;
}

export class GetCurrencies implements Action {
  readonly type = GET_CURRENCIES;
}

export class GetCurrenciesSuccess implements Action {
  readonly type = GET_CURRENCIES_SUCCESS;

  constructor(public payload: Currency[]) {}
}

export class GetCurrenciesError implements Action {
  readonly type = GET_CURRENCIES_ERROR;
}

export class GetSurveyUdfs implements Action {
  readonly type = GET_SURVEY_UDFS;
}

export class GetSurveyUdfsSuccess implements Action {
  readonly type = GET_SURVEY_UDFS_SUCCESS;

  constructor(public payload: ControlPoint[]) {}
}

export class GetSurveyUdfsError implements Action {
  readonly type = GET_SURVEY_UDFS_ERROR;
}

export class GetControlPoints implements Action {
  readonly type = GET_CONTROL_POINTS;
}

export class GetControlPointsSuccess implements Action {
  readonly type = GET_CONTROL_POINTS_SUCCESS;

  constructor(public payload: ControlPoint[]) {}
}

export class GetControlPointsError implements Action {
  readonly type = GET_CONTROL_POINTS_ERROR;
}

export class GetStructureNameSuggestions implements Action {
  readonly type = GET_STRUCTURE_NAME_SUGGESTIONS;

  constructor(public payload: { filter: string }) {}
}

export class GetStructureNameSuggestionsSuccess implements Action {
  readonly type = GET_STRUCTURE_NAME_SUGGESTIONS_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetStructureNameSuggestionsError implements Action {
  readonly type = GET_STRUCTURE_NAME_SUGGESTIONS_ERROR;
}

export class ModelNameExistsFailure implements Action {
  readonly type = MODEL_NAME_EXISTS_FAILURE;
}

export class ClearModelNameExistsFailure implements Action {
  readonly type = CLEAR_MODEL_NAME_EXISTS_FAILURE;
}

export class Cancel implements Action {
  readonly type = CANCEL;
}

export class SaveJobBasedModelSettings implements Action {
  readonly type = SAVE_JOB_BASED_MODEL_SETTINGS;

  constructor(public payload: { rangeGroupId: number; formValue: RangeGroupMetadata; fromPageViewId: string, rounding: RoundingSettingsDataObj }) {}
}

export class SaveJobBasedModelSettingsSuccess implements Action {
  readonly type = SAVE_JOB_BASED_MODEL_SETTINGS_SUCCESS;
}

export class SaveJobBasedModelSettingsError implements Action {
  readonly type = SAVE_JOB_BASED_MODEL_SETTINGS_ERROR;
}

export class SaveGradeBasedModelSettings implements Action {
  readonly type = SAVE_GRADE_BASED_MODEL_SETTINGS;

  constructor(public payload: { rangeGroupId: number; formValue: RangeGroupMetadata; fromPageViewId: string,
    rounding: RoundingSettingsDataObj, isNewModel: boolean }) {}
}

export class SaveGradeBasedModelSettingsSuccess implements Action {
  readonly type = SAVE_GRADE_BASED_MODEL_SETTINGS_SUCCESS;
}

export class SaveGradeBasedModelSettingsError implements Action {
  readonly type = SAVE_GRADE_BASED_MODEL_SETTINGS_ERROR;

  constructor(public error: any) {}
}

export class GetGradesDetails implements Action {
  readonly type = GET_GRADES_DETAILS;

  constructor(public payload: number) {}
}

export class GetGradesDetailsSuccess implements Action {
  readonly type = GET_GRADES_DETAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetGradesDetailsError implements Action {
  readonly type = GET_GRADES_DETAILS_ERROR;

  constructor(public payload: any) {}
}

export class GetStructureHasSettings implements Action {
  readonly type = GET_STRUCTURE_HAS_SETTINGS;

  constructor(public payload: GetStructureHasSettingsRequestModel) {}
}

export class GetStructureHasSettingsSuccess implements Action {
  readonly type = GET_STRUCTURE_HAS_SETTINGS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetStructureHasSettingsError implements Action {
  readonly type = GET_STRUCTURE_HAS_SETTINGS_ERROR;

  constructor(public payload: any) {}
}

export type ModelSettingsModalActions
  = OpenGradeModal
  | OpenJobModal
  | CloseModal
  | GetCurrencies
  | GetCurrenciesSuccess
  | GetCurrenciesError
  | GetControlPoints
  | GetControlPointsSuccess
  | GetControlPointsError
  | GetStructureNameSuggestions
  | GetStructureNameSuggestionsSuccess
  | GetStructureNameSuggestionsError
  | Cancel
  | GetSurveyUdfs
  | GetSurveyUdfsSuccess
  | GetSurveyUdfsError
  | ModelNameExistsFailure
  | ClearModelNameExistsFailure
  | SaveJobBasedModelSettings
  | SaveJobBasedModelSettingsSuccess
  | SaveJobBasedModelSettingsError
  | SaveGradeBasedModelSettings
  | SaveGradeBasedModelSettingsSuccess
  | SaveGradeBasedModelSettingsError
  | GetGradesDetails
  | GetGradesDetailsSuccess
  | GetGradesDetailsError
  | GetStructureHasSettings
  | GetStructureHasSettingsSuccess
  | GetStructureHasSettingsError;
