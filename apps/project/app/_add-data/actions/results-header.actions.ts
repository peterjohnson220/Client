import { Action } from '@ngrx/store';

import { SavedFilter } from '../models/saved-filter.model';

export const INIT_SAVED_FILTERS = '[Project Add Data/Results Header] Init Saved Filters';
export const GET_SAVED_FILTERS = '[Project Add Data/Results Header] Get Saved Filters';
export const GET_SAVED_FILTERS_SUCCESS = '[Project Add Data/Results Header] Get Saved Filters Success';
export const CLEAR_SAVED_FILTERS = '[Project Add Data/Results Header] Clear Saved Filters';
export const SAVE_FILTER = '[Project Add Data/Results Header] Save Filter';
export const SAVE_FILTER_SUCCESS = '[Project Add Data/Results Header] Save Filter Success';
export const MARK_FILTER_TO_DELETE = '[Project Add Data/Results Header] Mark Filter to Delete';
export const UNMARK_FILTER_TO_DELETE = '[Project Add Data/Results Header] Unmark Filter to Delete';
export const DELETE_SAVED_FILTER = '[Project Add Data/Results Header] Delete Saved Filter';
export const DELETE_SAVED_FILTER_SUCCESS = '[Project Add Data/Results Header] Delete Saved Filter Success';
export const SELECT_SAVED_FILTER = '[Project Add Data/Results Header] Select Saved Filter';
export const UNSELECT_SAVED_FILTER = '[Project Add Data/Results Header] Unselect Saved Filter';
export const REMOVE_SAVED_FILTER_AS_DEFAULT = '[Project Add Data/Results Header] Remove Saved Filter as Default';
export const SAVED_FILTER_SAVE_CONFLICT = '[Project Add Data/Results Header] Saved Filter Save Conflict';
export const SAVED_FILTER_SAVE_ERROR = '[Project Add Data/Results Header] Saved Filter Save Error';
export const OPEN_SAVE_FILTER_MODAL = '[Project Add Data/Results Header] Open Save Filter Modal';
export const CLOSE_SAVE_FILTER_MODAL = '[Project Add Data/Results Header] Close Save Filter Modal';
export const APPLY_DEFAULT_SAVED_FILTER = '[Project Add Data/Results Header] Apply Default Saved Filter';

export class InitSavedFilters implements Action {
  readonly type = INIT_SAVED_FILTERS;
}

export class GetSavedFilters implements Action {
  readonly type = GET_SAVED_FILTERS;

  constructor(public payload?: { savedFilterIdToSelect: string }) {}
}

export class GetSavedFiltersSuccess implements Action {
  readonly type = GET_SAVED_FILTERS_SUCCESS;

  constructor(public payload: SavedFilter[]) {}
}

export class ClearSavedFilters implements Action {
  readonly type = CLEAR_SAVED_FILTERS;
}

export class SaveFilter implements Action {
  readonly type = SAVE_FILTER;

  constructor(public payload: { Name: string, SetAsPayMarketDefault: boolean }) {}
}

export class SaveFilterSuccess implements Action {
  readonly type = SAVE_FILTER_SUCCESS;
}

export class MarkFilterToDelete implements Action {
  readonly type = MARK_FILTER_TO_DELETE;

  constructor(public payload: { filterId: string }) {}
}

export class UnmarkFilterToDelete implements Action {
  readonly type = UNMARK_FILTER_TO_DELETE;
}

export class DeleteSavedFilter implements Action {
  readonly type = DELETE_SAVED_FILTER;
}

export class DeleteSavedFilterSuccess implements Action {
  readonly type = DELETE_SAVED_FILTER_SUCCESS;
}

export class SelectSavedFilter implements Action {
  readonly type = SELECT_SAVED_FILTER;

  constructor(public payload: SavedFilter) {}
}

export class UnselectSavedFilter implements Action {
  readonly type = UNSELECT_SAVED_FILTER;
}

export class RemoveSavedFilterAsDefault implements Action {
  readonly type = REMOVE_SAVED_FILTER_AS_DEFAULT;

  constructor(public payload: { savedFilter: SavedFilter, payMarketId: number }) {
  }
}

export class SavedFilterSaveConflict implements Action {
  readonly type = SAVED_FILTER_SAVE_CONFLICT;
}

export class SavedFilterSaveError implements Action {
  readonly type = SAVED_FILTER_SAVE_ERROR;
}

export class OpenSaveFilterModal implements Action {
  readonly type = OPEN_SAVE_FILTER_MODAL;
}

export class CloseSaveFilterModal implements Action {
  readonly type = CLOSE_SAVE_FILTER_MODAL;
}

export class ApplyDefaultSavedFilter implements Action {
  readonly type = APPLY_DEFAULT_SAVED_FILTER;
}

export type Actions
  = InitSavedFilters
  | GetSavedFilters
  | GetSavedFiltersSuccess
  | ClearSavedFilters
  | SaveFilter
  | SaveFilterSuccess
  | MarkFilterToDelete
  | UnmarkFilterToDelete
  | DeleteSavedFilter
  | DeleteSavedFilterSuccess
  | SelectSavedFilter
  | UnselectSavedFilter
  | RemoveSavedFilterAsDefault
  | SavedFilterSaveConflict
  | SavedFilterSaveError
  | OpenSaveFilterModal
  | CloseSaveFilterModal
  | ApplyDefaultSavedFilter;
