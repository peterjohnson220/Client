import { Action } from '@ngrx/store';

import { SavedFilter } from '../models';

export const OPEN_POPOVER = '[User Filter/Popover] Open Save Filters Popover';
export const CLOSE_POPOVER = '[User Filter/Popover] Close Save Filters Popover';
export const EDIT_SAVED_FILTER = '[User Filter/Popover] Edit Saved Filter';
export const TOGGLE_SAVED_FILTER_SELECTION = '[User Filter/Popover] Toggle Saved Filter Selection';

export class OpenPopover implements Action {
  readonly type = OPEN_POPOVER;
}

export class ClosePopover implements Action {
  readonly type = CLOSE_POPOVER;
}

export class Edit implements Action {
  readonly type = EDIT_SAVED_FILTER;

  constructor(public payload: SavedFilter) {}
}

export class ToggleSavedFilterSelection implements Action {
  readonly type = TOGGLE_SAVED_FILTER_SELECTION;

  constructor(public payload: SavedFilter) {}
}

export type Actions
  = OpenPopover
  | ClosePopover
  | Edit
  | ToggleSavedFilterSelection;
