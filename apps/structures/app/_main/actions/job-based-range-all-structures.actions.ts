import { Action } from '@ngrx/store';

import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';

export const GET_COMPANY_STRUCTURE_VIEWS = '[Structures/Job Based Range All Structures] Get Company Structure Views';
export const GET_COMPANY_STRUCTURE_VIEWS_SUCCESS = '[Structures/Job Based Range All Structures] Get Company Structure Views Success';
export const GET_COMPANY_STRUCTURE_VIEWS_ERROR = '[Structures/Job Based Range All Structures] Get Company Structure Views Error';
export const ADD_STRUCTURE_FAVORITE = '[Structures/Job Based Range All Structures] Add Structure Favorite';
export const ADD_STRUCTURE_FAVORITE_SUCCESS = '[Structures/Job Based Range All Structures] Add Structure Favorite Success';
export const ADD_STRUCTURE_FAVORITE_ERROR = '[Structures/Job Based Range All Structures] Add Structure Favorite Error';
export const REMOVE_STRUCTURE_FAVORITE = '[Structures/Job Based Range All Structures] Remove Structure Favorite';
export const REMOVE_STRUCTURE_FAVORITE_SUCCESS = '[Structures/Job Based Range All Structures] Remove Structure Favorite Success';
export const REMOVE_STRUCTURE_FAVORITE_ERROR = '[Structures/Job Based Range All Structures] Remove Structure Favorite Error';
export const CLEAR_STRUCTURE_FAVORITE_ERRORS = '[Structures/Job Based Range All Structures] Clear Structure Favorite Errors';

export class GetCompanyStructureViews implements Action {
  readonly type = GET_COMPANY_STRUCTURE_VIEWS;

  constructor() {
  }
}

export class GetCompanyStructureViewsSuccess implements Action {
  readonly type = GET_COMPANY_STRUCTURE_VIEWS_SUCCESS;

  constructor(public payload: CompanyStructureView[]) {
  }
}

export class GetCompanyStructureViewsError implements Action {
  readonly type = GET_COMPANY_STRUCTURE_VIEWS_ERROR;

  constructor() {
  }
}

export class AddStructureFavorite implements Action {
  readonly type = ADD_STRUCTURE_FAVORITE;

  constructor(public payload: number) {
  }
}

export class AddStructureFavoriteSuccess implements Action {
  readonly type = ADD_STRUCTURE_FAVORITE_SUCCESS;

  constructor(public payload: number) {
  }
}

export class AddStructureFavoriteError implements Action {
  readonly type = ADD_STRUCTURE_FAVORITE_ERROR;

  constructor(public payload: number) {
  }
}

export class RemoveStructureFavorite implements Action {
  readonly type = REMOVE_STRUCTURE_FAVORITE;

  constructor(public payload: number) {
  }
}

export class RemoveStructureFavoriteSuccess implements Action {
  readonly type = REMOVE_STRUCTURE_FAVORITE_SUCCESS;

  constructor(public payload: number) {
  }
}

export class RemoveStructureFavoriteError implements Action {
  readonly type = REMOVE_STRUCTURE_FAVORITE_ERROR;

  constructor(public payload: number) {
  }
}

export class ClearStructureFavoriteErrors implements Action {
  readonly type = CLEAR_STRUCTURE_FAVORITE_ERRORS;

  constructor() {
  }
}

export type Actions
  = GetCompanyStructureViews
  | GetCompanyStructureViewsSuccess
  | GetCompanyStructureViewsError
  | AddStructureFavorite
  | AddStructureFavoriteSuccess
  | AddStructureFavoriteError
  | RemoveStructureFavorite
  | RemoveStructureFavoriteSuccess
  | RemoveStructureFavoriteError
  | ClearStructureFavoriteErrors;
