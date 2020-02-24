import { Action } from '@ngrx/store';

import { CurrencyDto } from 'libs/models/common';
import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';

export const GET_MODELING_SETTINGS_OPTIONS = '[Structures/Modeling Settings Page] Get Modeling Settings Options';
export const GET_CURRENCIES = '[Structures/Modeling Settings Page] Get Currencies';
export const GET_CURRENCIES_SUCCESS = '[Structures/Modeling Settings Page] Get Currencies Success';
export const GET_CURRENCIES_ERROR = '[Structures/Modeling Settings Page] Get Currencies Error';
export const GET_STANDARD_PAY_ELEMENTS = '[Structures/Modeling Settings Page] Get StandardPayElements';
export const GET_STANDARD_PAY_ELEMENTS_SUCCESS = '[Structures/Modeling Settings Page] Get StandardPayElements Success';
export const GET_STANDARD_PAY_ELEMENTS_ERROR = '[Structures/Modeling Settings Page] Get StandardPayElements Error';
export const CREATE_MODEL = '[Structures/Modeling Settings Page] Create Model';
export const CREATE_MODEL_SUCCESS = '[Structures/Modeling Settings Page] Create Model Success';
export const CREATE_MODEL_ERROR = '[Structures/Modeling Settings Page] Create Model Error';

export class GetModelingSettingsOptions implements Action {
  readonly type = GET_MODELING_SETTINGS_OPTIONS;

  constructor() {
  }
}

export class GetCurrencies implements Action {
  readonly type = GET_CURRENCIES;

  constructor() {
  }
}

export class GetCurrenciesSuccess implements Action {
  readonly type = GET_CURRENCIES_SUCCESS;

  constructor(public payload: CurrencyDto[]) {
  }
}

export class GetCurrenciesError implements Action {
  readonly type = GET_CURRENCIES_ERROR;

  constructor() {
  }
}

export class GetStandardPayElements implements Action {
  readonly type = GET_STANDARD_PAY_ELEMENTS;

  constructor() {
  }
}

export class GetStandardPayElementsSuccess implements Action {
  readonly type = GET_STANDARD_PAY_ELEMENTS_SUCCESS;

  constructor(public payload: string[]) {
  }
}

export class GetStandardPayElementsError implements Action {
  readonly type = GET_STANDARD_PAY_ELEMENTS_ERROR;

  constructor() {
  }
}

export class CreateModel implements Action {
  readonly type = CREATE_MODEL;

  constructor(public payload: StructureRangeGroupResponse) {
  }
}

export class CreateModelSuccess implements Action {
  readonly type = CREATE_MODEL_SUCCESS;

  constructor(public payload: StructureRangeGroupResponse) {
  }
}

export class CreateModelError implements Action {
  readonly type = CREATE_MODEL_ERROR;

  constructor() {
  }
}

export type Actions
  = GetModelingSettingsOptions
  | GetCurrencies
  | GetCurrenciesSuccess
  | GetCurrenciesError
  | GetStandardPayElements
  | GetStandardPayElementsSuccess
  | GetStandardPayElementsError
  | CreateModel
  | CreateModelSuccess
  | CreateModelError;
