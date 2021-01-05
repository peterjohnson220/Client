import { Action } from '@ngrx/store';

import { SearchFeatureIds } from '../enums/search-feature-ids';

export const SET_SEARCH_FEATURE_ID = '[Search/Search Feature] Set Search Feature Id';
export const RESET_SEARCH_FEATURE_ID = '[Search/Search Feature] Reset Search Feature Id';

export class SetSearchFeatureId implements Action {
  readonly type = SET_SEARCH_FEATURE_ID;

  constructor(public payload: SearchFeatureIds) {}
}
// TODO: Should this be separate actions?
export class ResetSearchFeatureId implements Action {
  readonly type = RESET_SEARCH_FEATURE_ID;

  constructor(public payload: SearchFeatureIds) {}
}

export type Actions
  = SetSearchFeatureId
  | ResetSearchFeatureId;
