import { Action } from '@ngrx/store';

import { NavigationLink, HomePageLink } from '../../../models';

export const GET_HEADER_DROPDOWN_NAVIGATION_LINKS = '[Layout Wrapper/Header] Get Header Dropdown Navigation Links';
export const GET_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS = '[Layout Wrapper/Header] Get Header Dropdown Navigation Links Success';
export const GET_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR = '[Layout Wrapper/Header] Get Header Dropdown Navigation Links Error';

export const GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS = '[Layout Wrapper/Header] Get SSO Header Dropdown Navigation Links';
export const GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS = '[Layout Wrapper/Header] Get SSO Header Dropdown Navigation Links Success';
export const GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR = '[Layout Wrapper/Header] Get SSO Header Dropdown Navigation Links Error';

export const GET_HEADER_USER_HOMEPAGE_LINK = '[Layout Wrapper/Header] Get Header User Homepage Link';
export const GET_HEADER_USER_HOMEPAGE_LINK_SUCCESS = '[Layout Wrapper/Header] Get Header User Homepage Link Success';
export const GET_HEADER_USER_HOMEPAGE_LINK_ERROR = '[Layout Wrapper/Header] Get Header User Homepage Link Error';

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

export class GetSsoHeaderDropdownNavigationLinks implements Action {
  readonly type = GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS;

  constructor() {}
}

export class GetSsoHeaderDropdownNavigationLinksSuccess implements Action {
  readonly type = GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS;

  constructor(public payload: NavigationLink[]) {}
}

export class GetSsoHeaderDropdownNavigationLinksError implements Action {
  readonly type = GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR;

  constructor() {}
}

export class GetHeaderUserHomePageLink implements Action {
  readonly type = GET_HEADER_USER_HOMEPAGE_LINK;

  constructor(public payload: any) {}
}

export class GetHeaderUserHomePageLinkSuccess implements Action {
  readonly type = GET_HEADER_USER_HOMEPAGE_LINK_SUCCESS;

  constructor(public payload: HomePageLink) {}
}

export class GetHeaderUserHomePageLinkError implements Action {
  readonly type = GET_HEADER_USER_HOMEPAGE_LINK_ERROR;

  constructor() {}
}

export type Actions =
  | GetHeaderDropdownNavigationLinks
  | GetHeaderDropdownNavigationLinksSuccess
  | GetHeaderDropdownNavigationLinksError
  | GetSsoHeaderDropdownNavigationLinks
  | GetSsoHeaderDropdownNavigationLinksSuccess
  | GetSsoHeaderDropdownNavigationLinksError
  | GetHeaderUserHomePageLink
  | GetHeaderUserHomePageLinkSuccess
  | GetHeaderUserHomePageLinkError;
