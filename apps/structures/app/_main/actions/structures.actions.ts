import { Action } from '@ngrx/store';

import { CompanyStructure } from 'libs/models/structures/company-structure.model';

export const GET_COMPANY_STRUCTURES = '[Structures/Structures] Get Company Structures';
export const GET_COMPANY_STRUCTURES_SUCCESS = '[Structures/Structures] Get Company Structures Success';
export const GET_COMPANY_STRUCTURES_ERROR = '[Structures/Structures] Get Company Structures Error';

export class GetCompanyStructures implements Action {
  readonly type = GET_COMPANY_STRUCTURES;

  constructor() {
  }
}

export class GetCompanyStructuresSuccess implements Action {
  readonly type = GET_COMPANY_STRUCTURES_SUCCESS;

  constructor(public payload: CompanyStructure[]) {
  }
}

export class GetCompanyStructuresError implements Action {
  readonly type = GET_COMPANY_STRUCTURES_ERROR;

  constructor() {
  }
}

export type Actions
  = GetCompanyStructures
  | GetCompanyStructuresSuccess
  | GetCompanyStructuresError;
