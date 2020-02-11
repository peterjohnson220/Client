import { Action } from '@ngrx/store';

import { Filter, MultiSelectOption } from '../models';

export const APPLY_SELECTIONS = '[Search/Singled Filter] Apply Selections';
export const CLEAR_SELECTIONS = '[Search/Singled Filter] Clear Selections';
export const SEARCH_AGGREGATION = '[Search/Singled Filter] Search Aggregation';
export const SEARCH_AGGREGATION_ERROR = '[Search/Singled Filter] Search Aggregation Error';
export const SEARCH_AGGREGATION_SUCCESS = '[Search/Singled Filter] Search Aggregation Success';
export const SET_SEARCH_VALUE = '[Search/Singled Filter] Set Search Value';
export const SET_SINGLED_FILTER = '[Search/Singled Filter] Set Singled Filter';
export const REMOVE_FILTER_VALUE = '[Search/Singled Filter] Remove Value';
export const TOGGLE_MULTI_SELECT_OPTION = '[Search/Singled Filter] Toggle Multi Select Option';

export class ApplySelections implements Action {
  readonly type = APPLY_SELECTIONS;

  constructor(public payload: MultiSelectOption[]) {}
}

export class ClearSelections implements Action {
  readonly type = CLEAR_SELECTIONS;

  constructor() {}
}

export class SearchAggregation implements Action {
  readonly type = SEARCH_AGGREGATION;

  constructor() {}
}

export class SearchAggregationError implements Action {
  readonly type = SEARCH_AGGREGATION_ERROR;

  constructor() {}
}

export class SearchAggregationSuccess implements Action {
  readonly type = SEARCH_AGGREGATION_SUCCESS;

  constructor(public payload: { newOptions: MultiSelectOption[], currentSelections: MultiSelectOption[], subFilters?: Filter[] }) {}
}

export class SetSearchValue implements Action {
  readonly type = SET_SEARCH_VALUE;

  constructor(public payload: string) {}
}

export class SetSingledFilter implements Action {
  readonly type = SET_SINGLED_FILTER;

  constructor(public payload: Filter) {}
}

export class RemoveFilterValue implements Action {
  readonly type = REMOVE_FILTER_VALUE;

  constructor(public payload: {value: any}) {}
}

export class ToggleMultiSelectOption implements Action {
  readonly type = TOGGLE_MULTI_SELECT_OPTION;

  constructor(public payload: any) {}
}

export type Actions
  = SetSingledFilter
  | SearchAggregation
  | SearchAggregationSuccess
  | SearchAggregationError
  | ToggleMultiSelectOption
  | ClearSelections
  | SetSearchValue
  | RemoveFilterValue
  | ApplySelections;
