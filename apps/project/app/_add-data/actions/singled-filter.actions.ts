import { Action } from '@ngrx/store';

import { SearchFilterOption } from 'libs/models/survey-search';

import { Filter, MultiSelectOption } from '../models';

export const SET_SINGLED_FILTER = '[Project Add Data/Singled Filter] Set Singled Filter';
export const SEARCH_AGGREGATION = '[Project Add Data/Singled Filter] Search Aggregation';
export const SEARCH_AGGREGATION_SUCCESS = '[Project Add Data/Singled Filter] Search Aggregation Success';
export const SEARCH_AGGREGATION_ERROR = '[Project Add Data/Singled Filter] Search Aggregation Error';
export const TOGGLE_MULTI_SELECT_OPTION = '[Project Add Data/Singled Filter] Toggle Multi Select Option';
export const CLEAR_SELECTIONS = '[Project Add Data/Singled Filter] Clear Selections';
export const SET_SEARCH_VALUE = '[Project Add Data/Singled Filter] Set Search Value';
export const REMOVE_FILTER_VALUE = '[Project Add Data/Singled Filter] Remove Value';

export class SetSingledFilter implements Action {
  readonly type = SET_SINGLED_FILTER;

  constructor(public payload: Filter) {}
}

export class SearchAggregation implements Action {
  readonly type = SEARCH_AGGREGATION;

  constructor() {}
}

export class SearchAggregationSuccess implements Action {
  readonly type = SEARCH_AGGREGATION_SUCCESS;

  constructor(public payload: { newOptions: SearchFilterOption[], currentSelections: MultiSelectOption[] }) {}
}

export class SearchAggregationError implements Action {
  readonly type = SEARCH_AGGREGATION_ERROR;

  constructor() {}
}

export class ToggleMultiSelectOption implements Action {
  readonly type = TOGGLE_MULTI_SELECT_OPTION;

  constructor(public payload: any) {}
}

export class ClearSelections implements Action {
  readonly type = CLEAR_SELECTIONS;

  constructor() {}
}

export class SetSearchValue implements Action {
  readonly type = SET_SEARCH_VALUE;

  constructor(public payload: string) {}
}

export class RemoveFilterValue implements Action {
  readonly type = REMOVE_FILTER_VALUE;

  constructor(public payload: {value: any}) {}
}

export type Actions
  = SetSingledFilter
  | SearchAggregation
  | SearchAggregationSuccess
  | SearchAggregationError
  | ToggleMultiSelectOption
  | ClearSelections
  | SetSearchValue
  | RemoveFilterValue;
