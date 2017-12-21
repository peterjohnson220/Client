import { Action } from '@ngrx/store';

import { SidebarLink } from '../../../models';

export const GET_LEFT_SIDEBAR_NAVIGATION_LINKS = '[Layout Wrapper/Left Sidebar] Get Left Sidebar Navigation Links';
export const GET_LEFT_SIDEBAR_NAVIGATION_LINKS_SUCCESS = '[Layout Wrapper/Left Sidebar] Get Left Sidebar Navigation Links Success';
export const GET_LEFT_SIDEBAR_NAVIGATION_LINKS_ERROR = '[Layout Wrapper/Left Sidebar] Get Left Sidebar Navigation Links Error';

export class GetLeftSidebarNavigationLinks implements Action {
  readonly type = GET_LEFT_SIDEBAR_NAVIGATION_LINKS;

  constructor() {}
}

export class GetLeftSidebarNavigationLinksSuccess implements Action {
  readonly type = GET_LEFT_SIDEBAR_NAVIGATION_LINKS_SUCCESS;

  constructor(public payload: SidebarLink[]) {}
}

export class GetLeftSidebarNavigationLinksError implements Action {
  readonly type = GET_LEFT_SIDEBAR_NAVIGATION_LINKS_ERROR;

  constructor() {}
}

export type Actions =
  | GetLeftSidebarNavigationLinks
  | GetLeftSidebarNavigationLinksSuccess
  | GetLeftSidebarNavigationLinksError;
