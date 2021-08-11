import { Action } from '@ngrx/store';

import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';

export const GET_ALL_COMPENSABLE_FACTORS = '[Comphub/Compensable Factors] Get All Compensable Factors';
export const GET_ALL_COMPENSABLE_FACTORS_SUCCESS = '[Comphub/Compensable Factors] Get All Compensable Factors Success';
export const GET_ALL_COMPENSABLE_FACTORS_ERROR = '[Comphub/Compensable Factors] Get All Compensable Factors Error';
export const GET_EDUCATION_TYPES = '[Comphub/Compensable Factors] Get Education Types';
export const GET_EDUCATION_TYPES_SUCCESS = '[Comphub/Compensable Factors] Get Education Types Success';
export const GET_EDUCATION_TYPES_ERROR = '[Comphub/Compensable Factors] Get Education Types Error';
export const TOGGLE_SELECTED_COMPENSABLE_FACTOR = '[Comphub/Compensable Factors] Toggle Selected Compensable Factors';

export class GetAllCompensableFactors implements Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS;

  constructor(public payload: { country: string, paymarketId: number }) {}
}

export class GetAllCompensableFactorsSuccess implements Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS_SUCCESS;

  constructor(public payload: CompensableFactorsResponseModel[]) {}
}

export class GetAllCompensableFactorsError implements Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS_ERROR;

  constructor() {}
}

export class GetEducationTypes implements Action {
  readonly type = GET_EDUCATION_TYPES;
}

export class GetEducationTypesSuccess implements Action {
  readonly type = GET_EDUCATION_TYPES_SUCCESS;

  constructor(public payload: any) {}
}

export class GetEducationTypesError implements Action {
  readonly type = GET_EDUCATION_TYPES_ERROR;

  constructor() {}
}

export class ToggleSelectedCompensableFactor implements Action {
  readonly type = TOGGLE_SELECTED_COMPENSABLE_FACTOR;

  constructor(public payload: { compensableFactor: string, Name: string }) {}
}

export type Actions
  = GetAllCompensableFactors
  | GetAllCompensableFactorsSuccess
  | GetAllCompensableFactorsError
  | GetEducationTypes
  | GetEducationTypesSuccess
  | GetEducationTypesError
  | ToggleSelectedCompensableFactor;
