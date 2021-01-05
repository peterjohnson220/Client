import { Action } from '@ngrx/store';

import { UserFilterUpsertRequest } from 'libs/models/payfactors-api';

import { SavedFilter } from '../models';

export const INIT = '[Feature/User Filter] Init User Filter';
export const RESET = '[Feature/User Filter] Reset User Filter';
export const GET_ALL = '[Feature/User Filter] Get All Saved Filters';
export const GET_ONE = '[Feature/User Filter] Get One Saved Filter';
export const GET_SUCCESS = '[Feature/User Filter] Get Saved Filters Success';
export const GET_ERROR = '[Feature/User Filter] Get Saved Filters Error';
export const UPSERT = '[Feature/User Filter] Upsert Saved Filter';
export const UPSERT_SUCCESS = '[Feature/User Filter] Upsert Saved Filter Success';
export const UPSERT_CONFLICT = '[Feature/User Filter] Upsert Conflict';
export const UPSERT_ERROR = '[Feature/User Filter] Upsert Error';
export const CLEAR_UPSERT_ERROR = '[Feature/User Filter] Clear User Filter Upsert Error State';
export const DELETE = '[Feature/User Filter] Delete Saved Filter';
export const DELETE_SUCCESS = '[Feature/User Filter] Delete Saved Filter Success';
export const DELETE_ERROR = '[Feature/User Filter] Delete Saved Filter Error';
export const SET_SELECTED = '[Feature/User Filter] Set Saved Filter Selected Attribute';
export const SET_DEFAULT = '[Feature/User Filter] Set Default Filter';
export const APPLY_DEFAULT = '[Feature/User Filter] Apply Default Saved Filter';

export class Init {
  readonly type = INIT;
}

export class Reset {
  readonly type = RESET;
}

export class GetAll implements Action {
  readonly type = GET_ALL;
}

export class Get implements Action {
  readonly type = GET_ONE;

  constructor(public payload: { savedFilterId: string } ) {}
}

export class GetSuccess implements Action {
  readonly type = GET_SUCCESS;

  constructor(public payload: SavedFilter[]) {}
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class Upsert implements Action {
  readonly type = UPSERT;

  constructor(public payload: UserFilterUpsertRequest) {}
}

export class UpsertSuccess implements Action {
  readonly type = UPSERT_SUCCESS;

  constructor(public payload: { isNew: boolean, savedFilterId: string }) {}
}

export class UpsertConflict implements Action {
  readonly type = UPSERT_CONFLICT;
}

export class UpsertError implements Action {
  readonly type = UPSERT_ERROR;
}

export class ClearUpsertError implements Action {
  readonly type = CLEAR_UPSERT_ERROR;
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: { savedFilterId: string } ) {}
}

export class DeleteSuccess implements Action {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: { deletedFilterId: string }) {}
}

export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
}

export class SetSelected implements Action {
  readonly type = SET_SELECTED;

  constructor(public payload: { id?: string, selected: boolean }) {}
}

export class SetDefault implements Action {
  readonly type = SET_DEFAULT;

  constructor(public payload: string) {}
}

export class ApplyDefault implements Action {
  readonly type = APPLY_DEFAULT;
}

export type Actions
  = Init
  | Reset
  | GetAll
  | Get
  | GetSuccess
  | GetError
  | Upsert
  | UpsertSuccess
  | UpsertConflict
  | UpsertError
  | ClearUpsertError
  | Delete
  | DeleteSuccess
  | DeleteError
  | SetSelected
  | SetDefault
  | ApplyDefault;
