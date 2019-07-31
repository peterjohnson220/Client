import { Action } from '@ngrx/store';

import { CompanyStructure } from 'libs/models/structures/company-structure.model';

export const GET_COMPANY_STRUCTURE_VIEWS = '[Structures/Job Based Range All Structures] Get Company Structure Views';
export const GET_COMPANY_STRUCTURE_VIEWS_SUCCESS = '[Structures/Job Based Range All Structures] Get Company Structure Views Success';
export const GET_COMPANY_STRUCTURE_VIEWS_ERROR = '[Structures/Job Based Range All Structures] Get Company Structure Views Error';

export class GetCompanyStructureViews implements Action {
  readonly type = GET_COMPANY_STRUCTURE_VIEWS;

  constructor() {
  }
}

export class GetCompanyStructureViewsSuccess implements Action {
  readonly type = GET_COMPANY_STRUCTURE_VIEWS_SUCCESS;

  constructor(public payload: CompanyStructure[]) {
  }
}

export class GetCompanyStructureViewsError implements Action {
  readonly type = GET_COMPANY_STRUCTURE_VIEWS_ERROR;

  constructor() {
  }
}

export type Actions
  = GetCompanyStructureViews
  | GetCompanyStructureViewsSuccess
  | GetCompanyStructureViewsError;
