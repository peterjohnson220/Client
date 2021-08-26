import { Action } from '@ngrx/store';

import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';
import { CompensableFactorModel } from 'libs/models/comphub';

export const GET_ALL_COMPENSABLE_FACTORS = '[Comphub/Compensable Factors] Get All Compensable Factors';
export const GET_ALL_COMPENSABLE_FACTORS_SUCCESS = '[Comphub/Compensable Factors] Get All Compensable Factors Success';
export const GET_ALL_COMPENSABLE_FACTORS_ERROR = '[Comphub/Compensable Factors] Get All Compensable Factors Error';
export const GET_EDUCATION_TYPES = '[Comphub/Compensable Factors] Get Education Types';
export const GET_EDUCATION_TYPES_SUCCESS = '[Comphub/Compensable Factors] Get Education Types Success';
export const GET_EDUCATION_TYPES_ERROR = '[Comphub/Compensable Factors] Get Education Types Error';
export const TOGGLE_SELECTED_COMPENSABLE_FACTOR = '[Comphub/Compensable Factors] Toggle Selected Compensable Factors';
export const ADD_DATA_TO_COMPENSABLE_FACTORS_LIST = '[Comphub/Compensable Factors] Add Data To Compensable Factors List';
export const INIT_JOB_INITIAL_PRICING = '[Comphub/Compensable Factors] Init Job Initial Pricing';

export class GetAllCompensableFactors implements Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS;

  constructor() {}
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

  constructor() {}
}

export class GetEducationTypesError implements Action {
  readonly type = GET_EDUCATION_TYPES_ERROR;

  constructor() {}
}

export class ToggleSelectedCompensableFactor implements Action {
  readonly type = TOGGLE_SELECTED_COMPENSABLE_FACTOR;

  constructor(public payload: { compensableFactor: string, Name: string }) {}
}

export class AddDataToCompensableFactorsList implements Action {
  readonly type = ADD_DATA_TO_COMPENSABLE_FACTORS_LIST;

  constructor(public payload: { compensableFactor: string, Data: CompensableFactorModel[] }) {}
}

export class InitJobInitialPricing implements Action {
  readonly type = INIT_JOB_INITIAL_PRICING;

  constructor() {}
}

export type Actions
  = GetAllCompensableFactors
  | GetAllCompensableFactorsSuccess
  | GetAllCompensableFactorsError
  | GetEducationTypes
  | GetEducationTypesSuccess
  | GetEducationTypesError
  | ToggleSelectedCompensableFactor
  | AddDataToCompensableFactorsList
  | InitJobInitialPricing;
