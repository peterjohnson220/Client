import { Action } from '@ngrx/store';

import { UserFilterTypeData } from 'libs/features/user-filter/models';

import { SearchFilterMappingDataObj } from '../models';
import { SearchFeatureIds } from '../enums/search-feature-ids';

export const SET_SEARCH_FILTER_MAPPING_DATA = '[Search/Search Page] Set Search Filter Mapping Data';
export const SET_SEARCH_FEATURE_ID = '[Search/Search Page] Set Search Feature Id';
export const SET_USER_FILTER_TYPE_DATA = '[Search/Search Page] Set User Filter Type Data';
export const CLOSE_SEARCH_PAGE = '[Search/Search Page] Close Search Page';
export const TOGGLE_FILTER_SEARCH = '[Search/Search Page] Toggle Filter Search';
export const TOGGLE_CHILD_FILTER_SEARCH = '[Search/Search Page] Toggle Child Filter Search';
export const HIDE_FILTER_SEARCH = '[Search/Search Page] Hide Filter Search';
export const HIDE_CHILD_FILTER_SEARCH = '[Search/Search Page] Hide Child Filter Search';
export const HIDE_PAGE = '[Search/Search Page] Hide Page';
export const SHOW_PAGE = '[Search/Search Page] Show Page';
export const CANCEL = '[Search/Search Page] Cancel';
export const RESET = '[Search/Search Page] Reset';

export class SetSearchFeatureId implements Action {
  readonly type = SET_SEARCH_FEATURE_ID;

  constructor(public payload: SearchFeatureIds) {}
}

export class SetSearchFilterMappingData implements Action {
  readonly type = SET_SEARCH_FILTER_MAPPING_DATA;

  constructor(public payload: SearchFilterMappingDataObj) {}
}

export class SetUserFilterTypeData implements Action {
  readonly type = SET_USER_FILTER_TYPE_DATA;

  constructor(public payload: UserFilterTypeData) {}
}

export class CloseSearchPage implements Action {
  readonly type = CLOSE_SEARCH_PAGE;

  constructor() {}
}

export class ShowPage implements Action {
  readonly type = SHOW_PAGE;

  constructor() {}
}

export class ToggleFilterSearch implements Action {
  readonly type = TOGGLE_FILTER_SEARCH;

  constructor() {}
}

export class HideFilterSearch implements Action {
  readonly type = HIDE_FILTER_SEARCH;

  constructor() {}
}

export class HideChildFilterSearch implements Action {
  readonly type = HIDE_CHILD_FILTER_SEARCH;

  constructor() {}
}

export class HidePage implements Action {
  readonly type = HIDE_PAGE;

  constructor() {}
}

export class ToggleChildFilterSearch implements Action {
  readonly type = TOGGLE_CHILD_FILTER_SEARCH;

  constructor() {}
}

export class Cancel implements Action {
  readonly type = CANCEL;

  constructor() {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export type Actions
  = SetSearchFeatureId
  | SetSearchFilterMappingData
  | SetUserFilterTypeData
  | CloseSearchPage
  | ToggleFilterSearch
  | ToggleChildFilterSearch
  | HideFilterSearch
  | HideChildFilterSearch
  | HidePage
  | ShowPage
  | Reset;
