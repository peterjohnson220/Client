import { Action } from '@ngrx/store';

import { Currency, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models';

import { ControlPoint } from '../models';

export const OPEN_MODAL = '[Structures - Range - Model Settings] Open Modal';
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
export const SET_ACTIVE_TAB = '[Structures - Range - Model Settings] Set Active Tab';
export const SAVE_JOB_BASED_MODEL_SETTINGS = '[Structures - Job Based Range - Model Settings] Save Model Settings';
export const SAVE_JOB_BASED_MODEL_SETTINGS_SUCCESS = '[Structures - Job Based Range - Model Settings] Save Model Settings Success';
export const SAVE_JOB_BASED_MODEL_SETTINGS_ERROR = '[Structures - Job Based Range - Model Settings] Save Model Settings Error';
export const SAVE_GRADE_BASED_MODEL_SETTINGS = '[Structures - Grade Based Range - Model Settings] Save Model Settings';
export const SAVE_GRADE_BASED_MODEL_SETTINGS_SUCCESS = '[Structures - Grade Based Range - Model Settings] Save Model Settings Success';
export const SAVE_GRADE_BASED_MODEL_SETTINGS_ERROR = '[Structures - Grade Based Range - Model Settings] Save Model Settings Error';

export class OpenModal implements Action {
  readonly type = OPEN_MODAL;
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

export class SetActiveTab implements Action {
  readonly type = SET_ACTIVE_TAB;

  constructor(public payload: string) {}
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
}

export type ModelSettingsModalActions
  = OpenModal
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
  | SetActiveTab
  | SaveJobBasedModelSettings
  | SaveJobBasedModelSettingsSuccess
  | SaveJobBasedModelSettingsError
  | SaveGradeBasedModelSettings
  | SaveGradeBasedModelSettingsSuccess
  | SaveGradeBasedModelSettingsError;
