import { Action } from '@ngrx/store';

import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';

export const GET_ALL_COMPENSABLE_FACTORS = '[Comphub/Compensable Factors] Get All Compensable Factors';
export const GET_ALL_COMPENSABLE_FACTORS_SUCCESS = '[Comphub/Compensable Factors] Get All Compensable Factors Success';
export const GET_ALL_COMPENSABLE_FACTORS_ERROR = '[Comphub/Compensable Factors] Get All Compensable Factors Error';
export const ADD_SELECTED_COMPENSABLE_FACTOR = '[Comphub/Compensable Factors] Add Selected Compensable Factors';
export const GET_EDUCATION_TYPES = '[Comphub/Compensable Factors] Get Education Types';
export const GET_EDUCATION_TYPES_SUCCESS = '[Comphub/Compensable Factors] Get Education Types Success';
export const GET_EDUCATION_TYPES_ERROR = '[Comphub/Compensable Factors] Get Education Types Error';

export class GetAllCompensableFactors implements Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS;

  constructor(public payload: {jobTitle: string, country: string, paymarketId: number}) {}
}

export class GetAllCompensableFactorsSuccess implements Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS_SUCCESS;

  constructor(public payload: CompensableFactorsResponseModel[]) {}
}

export class GetAllCompensableFactorsError implements  Action {
  readonly type = GET_ALL_COMPENSABLE_FACTORS_ERROR;

  constructor() {}
}

export class AddSelectedCompensableFactors implements Action {
  readonly type = ADD_SELECTED_COMPENSABLE_FACTOR;

  constructor(public payload: {compensableFactor: string, selectedFactors: string[]}) {}
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

export type Actions
  = GetAllCompensableFactors
  | GetAllCompensableFactorsSuccess
  | GetAllCompensableFactorsError
  | AddSelectedCompensableFactors
  | GetEducationTypes
  | GetEducationTypesSuccess
  | GetEducationTypesError;
