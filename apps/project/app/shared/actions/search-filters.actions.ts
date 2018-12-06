import { Action } from '@ngrx/store';

import { SearchFilter } from 'libs/models/survey-search';

import { Filter } from '../models';

export const REMOVE_FILTERS = '[Project Add Data/Search Filters] Remove Filters';
export const CLEAR_FILTER = '[Project Add Data/Search Filters] Clear Filter';
export const UPDATE_FILTER_VALUE = '[Project Add Data/Search Filters] Update Value';
export const GET_DEFAULT_SURVEY_SCOPES_FILTER = '[Project Add Data/Add Survey Data Page] Get Default Survey Scopes Filter';
export const GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS = '[Project Add Data/Add Survey Data Page] Get Default Survey Scopes Filter Success';
export const TOGGLE_MULTI_SELECT_OPTION = '[Project Add Data/Search Filters] Toggle Multi Select Option';
export const UPDATE_RANGE_FILTER = '[Project Add Data/Search Filters] Update Range';
export const REFRESH_FILTERS = '[Project Add Data/Search Filters] Refresh Filters';
export const RESET_ALL_FILTERS = '[Project Add Data/Search Filters] Reset All Filters';
export const ADD_FILTERS = '[Project Add Data/Search Filters] Add Filters';
export const SET_DEFAULT_VALUE = '[Project Add Data/Search Filters] Set Default Value';
export const REPLACE_FILTERS = '[Project Add Data/Search Filters] Replace Filter';
export const REMOVE_FILTER_VALUE = '[Project Add Data/Search Filters] Remove Value';
export const APPLY_SAVED_FILTERS = '[Project Add Data/Search Filters] Apply Saved Filters';
export const CLEAR_SAVED_FILTERS = '[Project Add Data/Search Filters] Clear Saved Filters';

export class RemoveFilters implements Action {
  readonly type = REMOVE_FILTERS;
}

export class ApplySavedFilters implements Action {
  readonly type = APPLY_SAVED_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class UpdateFilterValue implements Action {
  readonly type = UPDATE_FILTER_VALUE;

  constructor(public payload: any) {}
}

export class SetDefaultValue implements Action {
  readonly type = SET_DEFAULT_VALUE;

  constructor(public payload: any) {}
}

export class GetDefaultScopesFilter implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER;
}

export class GetDefaultScopesFilterSuccess implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS;

  constructor(public payload: SearchFilter) {}
}

export class ToggleMultiSelectOption implements Action {
  readonly type = TOGGLE_MULTI_SELECT_OPTION;

  constructor(public payload: any) {}
}

export class UpdateRangeFilter implements Action {
  readonly type = UPDATE_RANGE_FILTER;

  constructor(public payload: any) {}
}

export class RefreshFilters implements Action {
  readonly type = REFRESH_FILTERS;

  constructor(public payload: {
    searchFilters: Filter[],
    keepFilteredOutOptions: boolean
  }) {}
}

export class ClearFilter implements Action {
  readonly type = CLEAR_FILTER;

  constructor(public payload: {filterId: string}) {}
}

export class RemoveFilterValue implements Action {
  readonly type = REMOVE_FILTER_VALUE;

  constructor(public payload: {filterId: string, value: any}) {}
}

export class ResetAllFilters implements Action {
  readonly type = RESET_ALL_FILTERS;

  constructor() {}
}

export class AddFilters implements Action {
  readonly type = ADD_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class ReplaceFilters implements Action {
  readonly type = REPLACE_FILTERS;

  constructor(public payload: Filter[]) {}
}

export class ClearSavedFilters implements Action {
  readonly type = CLEAR_SAVED_FILTERS;

  constructor(public payload: Filter[]) {}
}

export type Actions
  = RemoveFilters
  | ApplySavedFilters
  | ClearSavedFilters
  | UpdateFilterValue
  | UpdateRangeFilter
  | GetDefaultScopesFilter
  | GetDefaultScopesFilterSuccess
  | ToggleMultiSelectOption
  | RefreshFilters
  | ClearFilter
  | ResetAllFilters
  | AddFilters
  | SetDefaultValue
  | RemoveFilterValue
  | ReplaceFilters;

