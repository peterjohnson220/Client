import { Action } from '@ngrx/store';

import { CurrencyDto } from 'libs/models/common';
import { Control } from 'mapbox-gl';
import { ControlPoint } from '../models/control-point.model';
import { Currency } from '../models';

export const OPEN_MODAL = '[Structures - Job Based Range - Model Settings] Open Modal';
export const CLOSE_MODAL = '[Structures - Job Based Range - Model Settings] Close Modal';
export const GET_CURRENCIES = '[Structures - Job Based Range - Model Settings] Get Currencies';
export const GET_CURRENCIES_SUCCESS = '[Structures - Job Based Range - Model Settings] Get Currencies Success';
export const GET_CURRENCIES_ERROR = '[Structures - Job Based Range - Model Settings] Get Currencies Error';
export const GET_CONTROL_POINTS = '[Structures - Job Based Range - Model Settings] Get Control Points';
export const GET_CONTROL_POINTS_SUCCESS = '[Structures - Job Based Range - Model Settings] Get Control Points Success';
export const GET_CONTROL_POINTS_ERROR = '[Structures - Job Based Range - Model Settings] Get Control Points Error';
export const GET_STRUCTURE_NAME_SUGGESTIONS = '[Structures - Job Based Range - Model Settings] Get Structure Name Suggestions';
export const GET_STRUCTURE_NAME_SUGGESTIONS_SUCCESS = '[Structures - Job Based Range - Model Settings] Get Structure Name Suggestions Success';
export const GET_STRUCTURE_NAME_SUGGESTIONS_ERROR = '[Structures - Job Based Range - Model Settings] Get Structure Name Suggestions Error';
export const SAVE_MODEL_SETTINGS = '[Structures - Job Based Range - Model Settings] Save Model Settings';
export const SAVE_MODEL_SETTINGS_SUCCESS = '[Structures - Job Based Range - Model Settings] Save Model Settings Success';
export const SAVE_MODEL_SETTINGS_ERROR = '[Structures - Job Based Range - Model Settings] Save Model Settings Error';
export const MODEL_NAME_EXISTS_FAILURE = '[Structures - Job Based Range - Model Settings] Model Name Exists Failure';
export const CLEAR_MODEL_NAME_EXISTS_FAILURE = '[Structures - Job Based Range - Model Settings] Clear Name Exists Failure';

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

export class SaveModelSettings implements Action {
  readonly type = SAVE_MODEL_SETTINGS;

  constructor(public payload: { rangeGroupId: number; formValue: any; }) {}
}

export class SaveModelSettingsSuccess implements Action {
  readonly type = SAVE_MODEL_SETTINGS_SUCCESS;
}

export class SaveModelSettingsError implements Action {
  readonly type = SAVE_MODEL_SETTINGS_ERROR;
}

export class ModelNameExistsFailure implements Action {
  readonly type = MODEL_NAME_EXISTS_FAILURE;
}

export class ClearModelNameExistsFailure implements Action {
  readonly type = CLEAR_MODEL_NAME_EXISTS_FAILURE;
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
  | SaveModelSettings
  | SaveModelSettingsSuccess
  | SaveModelSettingsError
  | ModelNameExistsFailure
  | ClearModelNameExistsFailure;
