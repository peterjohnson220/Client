import { Action } from '@ngrx/store';

import { CompensableFactorsResponseModel } from 'libs/models/payfactors-api/comphub/response';

export const GET_ALL_COMPENSABLE_FACTORS = '[Comphub/Compensable Factors] Get All Compensable Factors';
export const GET_ALL_COMPENSABLE_FACTORS_SUCCESS = '[Comphub/Compensable Factors] Get All Compensable Factors Success';
export const GET_ALL_COMPENSABLE_FACTORS_ERROR = '[Comphub/Compensable Factors] Get All Compensable Factors Error';
export const ADD_SELECTED_COMPENSABLE_FACTOR = '[Comphub/Compensable Factors] Add Selected Compensable Factors';

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

export type Actions
  = GetAllCompensableFactors
  | GetAllCompensableFactorsSuccess
  | GetAllCompensableFactorsError
  | AddSelectedCompensableFactors;
