import { Action } from '@ngrx/store';

export const CLOSE_SEARCH_PAGE = '[Search/Search Page] Close Search Page';
export const TOGGLE_FILTER_SEARCH = '[Search/Search Page] Toggle Filter Search';
export const TOGGLE_CHILD_FILTER_SEARCH = '[Search/Search Page] Toggle Child Filter Search';
export const HIDE_FILTER_SEARCH = '[Search/Search Page] Hide Filter Search';
export const HIDE_PAGE = '[Search/Search Page] Hide Page';
export const SHOW_PAGE = '[Search/Search Page] Show Page';

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

export class HidePage implements Action {
  readonly type = HIDE_PAGE;

  constructor() {}
}

export class ToggleChildFilterSearch implements Action {
  readonly type = TOGGLE_CHILD_FILTER_SEARCH;

  constructor() {}
}

export type Actions
  = CloseSearchPage
  | ToggleFilterSearch
  | ToggleChildFilterSearch
  | HideFilterSearch
  | HidePage
  | ShowPage;
