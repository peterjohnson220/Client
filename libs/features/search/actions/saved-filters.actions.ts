import { Action } from '@ngrx/store';

import { SaveFilterModalData, SavedFilter } from '../models';

export const INIT_SAVED_FILTERS = '[Search/Saved Filters] Init Saved Filters';
export const GET_SAVED_FILTERS = '[Search/Saved Filters] Get Saved Filters';
export const GET_SAVED_FILTERS_SUCCESS = '[Search/Saved Filters] Get Saved Filters Success';
export const CLEAR_SAVED_FILTERS = '[Search/Saved Filters] Clear Saved Filters';
export const SAVE_FILTER = '[Search/Saved Filters] Save Filter';
export const SAVE_FILTER_SUCCESS = '[Search/Saved Filters] Save Filter Success';
export const MARK_FILTER_TO_DELETE = '[Search/Saved Filters] Mark Filter to Delete';
export const UNMARK_FILTER_TO_DELETE = '[Search/Saved Filters] Unmark Filter to Delete';
export const DELETE_SAVED_FILTER = '[Search/Saved Filters] Delete Saved Filter';
export const DELETE_SAVED_FILTER_SUCCESS = '[Search/Saved Filters] Delete Saved Filter Success';
export const SELECT_SAVED_FILTER = '[Search/Saved Filters] Select Saved Filter';
export const UNSELECT_SAVED_FILTER = '[Search/Saved Filters] Unselect Saved Filter';
export const REMOVE_SAVED_FILTER_AS_DEFAULT = '[Search/Saved Filters] Remove Saved Filter as Default';
export const SAVED_FILTER_SAVE_CONFLICT = '[Search/Saved Filters] Saved Filter Save Conflict';
export const SAVED_FILTER_SAVE_ERROR = '[Search/Saved Filters] Saved Filter Save Error';
export const OPEN_SAVE_FILTER_MODAL = '[Search/Saved Filters] Open Save Filter Modal';
export const CLOSE_SAVE_FILTER_MODAL = '[Search/Saved Filters] Close Save Filter Modal';
export const APPLY_DEFAULT_SAVED_FILTER = '[Search/Saved Filters] Apply Default Saved Filter';
export const EDIT_SAVED_FILTER = '[Search/Saved Filters] Edit Saved Filter';
export const SET_FILTER_DATA_TO_EDIT = '[Search/Saved Filters] Set Filter Data to Edit';
export const OPEN_SAVED_FILTERS_POPOVER = '[Search/Saved Filters] Open Saved Filters Popover';
export const CLOSE_SAVED_FILTERS_POPOVER = '[Search/Saved Filters] Close Saved Filters Popover';
export const SET_DEFAULT_FILTER = '[Search/Saved Filters] Set Default Filter';
export const TOGGLE_SAVED_FILTER_SELECTION = '[Search/Saved Filters] Toggle Saved Filter Selection';
export const CREATE_SAVED_FILTER = '[Search/Saved Filters] Create New Saved Filter';

export class InitSavedFilters implements Action {
  readonly type = INIT_SAVED_FILTERS;
}

export class GetSavedFilters implements Action {
  readonly type = GET_SAVED_FILTERS;
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

  constructor(public payload: SaveFilterModalData) {}
}

export class SaveFilterSuccess implements Action {
  readonly type = SAVE_FILTER_SUCCESS;

  constructor(public payload: { isNew: boolean, savedFilterId: string }) {}
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

export class EditSavedFilter implements Action {
  readonly type = EDIT_SAVED_FILTER;

  constructor(public payload: SavedFilter) {}
}

export class SetFilterDataToEdit implements Action {
  readonly type = SET_FILTER_DATA_TO_EDIT;

  constructor(public payload: SaveFilterModalData) {}
}

export class OpenSavedFiltersPopover implements Action {
  readonly type = OPEN_SAVED_FILTERS_POPOVER;
}

export class CloseSavedFiltersPopover implements Action {
  readonly type = CLOSE_SAVED_FILTERS_POPOVER;
}

export class SetDefaultFilter implements Action {
  readonly type = SET_DEFAULT_FILTER;

  constructor(public payload: string) {}
}

export class ToggleSavedFilterSelection implements Action {
  readonly type = TOGGLE_SAVED_FILTER_SELECTION;

  constructor(public payload: SavedFilter) {}
}

export class CreateSavedFilter implements Action {
  readonly type = CREATE_SAVED_FILTER;
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
  | ApplyDefaultSavedFilter
  | EditSavedFilter
  | SetFilterDataToEdit
  | OpenSavedFiltersPopover
  | CloseSavedFiltersPopover
  | SetDefaultFilter
  | ToggleSavedFilterSelection
  | CreateSavedFilter;
