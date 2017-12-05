import { Action } from '@ngrx/store';

import { NavigationLink } from '../../../models';

export const GET_HEADER_DROPDOWN_NAVIGATION_LINKS = '[Layout Wrapper/Header] Get Header Dropdown Navigation Links';
export const GET_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS = '[Layout Wrapper/Header] Get Header Dropdown Navigation Links Success';
export const GET_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR = '[Layout Wrapper/Header] Get Header Dropdown Navigation Links Error';

export class GetHeaderDropdownNavigationLinks implements Action {
  readonly type = GET_HEADER_DROPDOWN_NAVIGATION_LINKS;

  constructor() {}
}

export class GetHeaderDropdownNavigationLinksSuccess implements Action {
  readonly type = GET_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS;

  constructor(public payload: NavigationLink[]) {}
}

export class GetHeaderDropdownNavigationLinksError implements Action {
  readonly type = GET_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR;

  constructor() {}
}

export type Actions =
  | GetHeaderDropdownNavigationLinks
  | GetHeaderDropdownNavigationLinksSuccess
  | GetHeaderDropdownNavigationLinksError;
