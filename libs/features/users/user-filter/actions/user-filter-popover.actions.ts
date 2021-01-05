import { Action } from '@ngrx/store';

import { SavedFilter } from '../models';

export const OPEN_POPOVER = '[User Filter/Popover] Open Save Filters Popover';
export const CLOSE_POPOVER = '[User Filter/Popover] Close Save Filters Popover';
export const SELECT = '[User Filter/Popover] Select Saved Filter';
export const UNSELECT = '[User Filter/Popover] Unselect Saved Filter';
export const EDIT = '[User Filter/Popover] Edit Saved Filter';
export const TOGGLE_SAVED_FILTER_SELECTION = '[User Filter/Popover] Toggle Saved Filter Selection';

export class OpenPopover implements Action {
  readonly type = OPEN_POPOVER;
}

export class ClosePopover implements Action {
  readonly type = CLOSE_POPOVER;
}

export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: SavedFilter) {}
}

export class Unselect implements Action {
  readonly type = UNSELECT;

  constructor(public payload: SavedFilter) {}
}

export class Edit implements Action {
  readonly type = EDIT;

  constructor(public payload: SavedFilter) {}
}

export class ToggleSavedFilterSelection implements Action {
  readonly type = TOGGLE_SAVED_FILTER_SELECTION;

  constructor(public payload: SavedFilter) {}
}

export type Actions
  = OpenPopover
  | ClosePopover
  | Select
  | Unselect
  | Edit
  | ToggleSavedFilterSelection;
