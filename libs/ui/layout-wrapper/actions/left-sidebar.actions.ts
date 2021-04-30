import { Action } from '@ngrx/store';

import { SidebarLink } from '../../../models';

export const GET_LEFT_SIDEBAR_NAVIGATION_LINKS = '[Layout Wrapper/Left Sidebar] Get Left Sidebar Navigation Links';
export const GET_LEFT_SIDEBAR_NAVIGATION_LINKS_SUCCESS = '[Layout Wrapper/Left Sidebar] Get Left Sidebar Navigation Links Success';
export const GET_LEFT_SIDEBAR_NAVIGATION_LINKS_ERROR = '[Layout Wrapper/Left Sidebar] Get Left Sidebar Navigation Links Error';
export const TOGGLE_LEFT_SIDEBAR = '[Layout Wrapper/Left Sidebar] Toggle Left Sidebar';
export const CLOSE_LEFT_SIDEBAR = '[Layout Wrapper/Left Sidebar] Close Left Sidebar';
export const URL_REDIRECT_APPLICATION_SUCCESS = '[Layout Wrapper/Left Sidebar] Url Redirect Application Success';

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

export class ToggleLeftSidebar implements Action {
  readonly type = TOGGLE_LEFT_SIDEBAR;
  constructor(public payload: boolean) {}
}

export class CloseLeftSidebar implements Action {
  readonly type = CLOSE_LEFT_SIDEBAR;
  constructor() {}
}

export class UrlRedirectApplicationSuccess implements Action {
  readonly type = URL_REDIRECT_APPLICATION_SUCCESS;
  constructor(public payload: SidebarLink[]) {
  }
}

export type Actions =
  | GetLeftSidebarNavigationLinks
  | GetLeftSidebarNavigationLinksSuccess
  | GetLeftSidebarNavigationLinksError
  | ToggleLeftSidebar
  | CloseLeftSidebar
  | UrlRedirectApplicationSuccess;
