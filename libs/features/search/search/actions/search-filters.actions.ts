import { Action } from '@ngrx/store';

import { Filter, MultiSelectFilter, MultiSelectOption } from '../models';
import { State } from '../reducers/search-filters.reducer';

export const ADD_FILTERS = '[Search/Search Filters] Add Filters';
export const ADD_FILTER_AND_SELECT_ALL_OPTIONS = '[Search/Search Filters] Add filter and select all options';
export const APPLY_SAVED_FILTERS = '[Search/Search Filters] Apply Saved Filters';
export const CLEAR_FILTER = '[Search/Search Filters] Clear Filter';
export const CLEAR_FILTERS = '[Search/Search Filters] Clear Filters';
export const CLEAR_SAVED_FILTERS = '[Search/Search Filters] Clear Saved Filters';
export const REFRESH_FILTERS = '[Search/Search Filters] Refresh Filters';
export const RESET_ALL_FILTERS = '[Search/Search Filters] Reset All Filters';
export const REMOVE_FILTER_VALUE = '[Search/Search Filters] Remove Value';
export const REMOVE_FILTERS = '[Search/Search Filters] Remove Filters';
export const REPLACE_FILTERS = '[Search/Search Filters] Replace Filters';
export const SET_DEFAULT_VALUE = '[Search/Search Filters] Set Default Value';
export const TOGGLE_MULTI_SELECT_OPTION = '[Search/Search Filters] Toggle Multi Select Option';
export const UPDATE_FILTER_VALUE = '[Search/Search Filters] Update Value';
export const UPDATE_RANGE_FILTER = '[Search/Search Filters] Update Range';
export const SHOW_MORE = '[Search/Search Filters] Show More';
export const SHOW_LESS = '[Search/Search Filters] Show Less';
export const ADD_FILTER_OPTIONS = '[Search/Search Filters] Add Filter Options';
export const RESET = '[Search/Search Filters] Reset';
export const SET = '[Search/Search Filters] Set';

export class AddFilters implements Action {
  readonly type = ADD_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class AddFilterAndSelectAllOptions implements Action {
  readonly type = ADD_FILTER_AND_SELECT_ALL_OPTIONS;

  constructor(public payload: MultiSelectFilter) {}
}

export class ApplySavedFilters implements Action {
  readonly type = APPLY_SAVED_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class ClearFilter implements Action {
  readonly type = CLEAR_FILTER;

  constructor(public payload: {filterId: string, parentOptionValue?: string}) {}
}

export class ClearFilters implements Action {
  readonly type = CLEAR_FILTERS;

  constructor() {}
}

export class ClearSavedFilters implements Action {
  readonly type = CLEAR_SAVED_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class RefreshFilters implements Action {
  readonly type = REFRESH_FILTERS;

  constructor(public payload: {
    filters: Filter[],
    keepFilteredOutOptions: boolean,
    singleFilter?: Filter
  }) {}
}

export class ResetAllFilters implements Action {
  readonly type = RESET_ALL_FILTERS;

  constructor() {}
}

export class RemoveFilterValue implements Action {
  readonly type = REMOVE_FILTER_VALUE;

  constructor(public payload: {filterId: string, value: any}) {}
}

export class RemoveFilters implements Action {
  readonly type = REMOVE_FILTERS;
}

export class ReplaceFilters implements Action {
  readonly type = REPLACE_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class SetDefaultValue implements Action {
  readonly type = SET_DEFAULT_VALUE;

  constructor(public payload: any) {}
}

export class ToggleMultiSelectOption implements Action {
  readonly type = TOGGLE_MULTI_SELECT_OPTION;

  constructor(public payload: any) {}
}

export class UpdateFilterValue implements Action {
  readonly type = UPDATE_FILTER_VALUE;

  constructor(public payload: any) {}
}

export class UpdateRangeFilter implements Action {
  readonly type = UPDATE_RANGE_FILTER;

  constructor(public payload: any) {}
}

export class ShowMore implements Action {
  readonly type = SHOW_MORE;

  constructor(public payload: { backingField: string }) {}
}

export class ShowLess implements Action {
  readonly type = SHOW_LESS;

  constructor(public payload: { backingField: string }) {}
}

export class AddFilterOptions implements Action {
  readonly type = ADD_FILTER_OPTIONS;

  constructor(public payload: {
    backingField: string,
    newOptions: MultiSelectOption[],
    currentSelections: MultiSelectOption[]
  }) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export class Set implements Action {
  readonly type = SET;

  constructor(public payload: State) { }
}

export type Actions
  = RemoveFilters
  | ApplySavedFilters
  | ClearSavedFilters
  | UpdateFilterValue
  | UpdateRangeFilter
  | ToggleMultiSelectOption
  | RefreshFilters
  | ClearFilter
  | ResetAllFilters
  | AddFilters
  | SetDefaultValue
  | RemoveFilterValue
  | ReplaceFilters
  | AddFilterAndSelectAllOptions
  | ClearFilters
  | ShowMore
  | ShowLess
  | AddFilterOptions
  | Reset
  | Set;

