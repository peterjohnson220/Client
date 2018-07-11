import { Action } from '@ngrx/store';

import { StaticFilterValue } from '../models';

export const CLEAR_STATIC_FILTERS = '[Project Add Data/Search Filters] Clear Static Filters';
export const UPDATE_STATIC_FILTER_VALUE = '[Project Add Data/Search Filters] Update Static Filter Value';

export class ClearStaticFilters implements Action {
  readonly type = CLEAR_STATIC_FILTERS;
}

export class UpdateStaticFilterValue implements Action {
  readonly type = UPDATE_STATIC_FILTER_VALUE;

  constructor(public payload: StaticFilterValue) {}
}

export type Actions
  = ClearStaticFilters
  | UpdateStaticFilterValue;
