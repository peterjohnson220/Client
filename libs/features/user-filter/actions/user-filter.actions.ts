import { Action } from '@ngrx/store';

import { UserFilterUpsertRequest } from 'libs/models/payfactors-api';

import { SavedFilter } from '../models';

export const INIT_USER_FILTER = '[Feature/User Filter] Init User Filter';
export const GET_ALL = '[Feature/User Filter] Get All Saved Filters';
export const GET_ONE = '[Feature/User Filter] Get One Saved Filter';
export const GET_SAVED_FILTERS_SUCCESS = '[Feature/User Filter] Get Saved Filters Success';
export const GET_SAVED_FILTERS_ERROR = '[Feature/User Filter] Get Saved Filters Error';
export const UPSERT = '[Feature/User Filter] Upsert Saved Filter';
export const UPSERT_SUCCESS = '[Feature/User Filter] Upsert Saved Filter Success';
export const UPSERT_CONFLICT = '[Feature/User Filter] Upsert Conflict';
export const UPSERT_ERROR = '[Feature/User Filter] Upsert Error';
export const DELETE = '[Feature/User Filter] Delete Saved Filter';
export const DELETE_SUCCESS = '[Feature/User Filter] Delete Saved Filter Success';
export const DELETE_ERROR = '[Feature/User Filter] Delete Saved Filter Error';
export const SELECT_SAVED_FILTER = '[Feature/User Filter] Select Saved Filter';
export const UNSELECT_SAVED_FILTER = '[Feature/User Filter] Unselect Saved Filter';
export const SET_DEFAULT_FILTER = '[Feature/User Filter] Set Default Filter';
export const APPLY_DEFAULT_SAVED_FILTER = '[Feature/User Filter] Apply Default Saved Filter';

export class Init {
  readonly type = INIT_USER_FILTER;
}

export class GetAll implements Action {
  readonly type = GET_ALL;
}

export class Get implements Action {
  readonly type = GET_ONE;

  constructor(public payload: { savedFilterId: string } ) {}
}

export class GetSavedFiltersSuccess implements Action {
  readonly type = GET_SAVED_FILTERS_SUCCESS;

  constructor(public payload: SavedFilter[]) {}
}

export class GetSavedFiltersError implements Action {
  readonly type = GET_SAVED_FILTERS_ERROR;
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

export class SelectSavedFilter implements Action {
  readonly type = SELECT_SAVED_FILTER;

  constructor(public payload: SavedFilter) {}
}

export class UnselectSavedFilter implements Action {
  readonly type = UNSELECT_SAVED_FILTER;
}

export class SetDefaultFilter implements Action {
  readonly type = SET_DEFAULT_FILTER;

  constructor(public payload: string) {}
}

export class ApplyDefault implements Action {
  readonly type = APPLY_DEFAULT_SAVED_FILTER;
}

export type Actions
  = Init
  | GetAll
  | Get
  | GetSavedFiltersSuccess
  | GetSavedFiltersError
  | Upsert
  | UpsertSuccess
  | UpsertConflict
  | UpsertError
  | Delete
  | DeleteSuccess
  | DeleteError
  | SelectSavedFilter
  | UnselectSavedFilter
  | SetDefaultFilter
  | ApplyDefault;
