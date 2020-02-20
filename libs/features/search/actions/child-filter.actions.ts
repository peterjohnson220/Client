import { Action } from '@ngrx/store';

import {Filter, FilterableMultiSelectOption, MultiSelectOption} from '../models';

export const APPLY_SELECTIONS = '[Search/Child Filter] Apply Selections';
export const CLEAR_SELECTIONS = '[Search/Child Filter] Clear Selections';
export const SEARCH_AGGREGATION = '[Search/Child Filter] Search Aggregation';
export const SEARCH_AGGREGATION_ERROR = '[Search/Child Filter] Search Aggregation Error';
export const SEARCH_AGGREGATION_SUCCESS = '[Search/Child Filter] Search Aggregation Success';
export const SET_SEARCH_VALUE = '[Search/Child Filter] Set Search Value';
export const SET_CHILD_FILTER = '[Search/Child Filter] Set Child Filter';
export const REMOVE_FILTER_VALUE = '[Search/Child Filter] Remove Value';
export const TOGGLE_MULTI_SELECT_OPTION = '[Search/Child Filter] Toggle Multi Select Option';
export const CLEAR_CHILD_FILTER = '[Search/Child Filter] Clear';

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

  constructor(public payload: { newOptions: MultiSelectOption[], currentSelections: MultiSelectOption[] }) {}
}

export class SetSearchValue implements Action {
  readonly type = SET_SEARCH_VALUE;

  constructor(public payload: string) {}
}

export class SetChildFilter implements Action {
  readonly type = SET_CHILD_FILTER;

  constructor(public payload: {filter: Filter, parentOption: FilterableMultiSelectOption}) {}
}

export class ClearChildFilter implements Action {
  readonly type = CLEAR_CHILD_FILTER;

  constructor() {}
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
  = SetChildFilter
  | SearchAggregation
  | SearchAggregationSuccess
  | SearchAggregationError
  | ToggleMultiSelectOption
  | ClearSelections
  | SetSearchValue
  | RemoveFilterValue
  | ApplySelections
  | ClearChildFilter;
