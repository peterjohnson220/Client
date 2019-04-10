import { Action } from '@ngrx/store';

import { NavigationLinkGroup } from 'libs/models/navigation';

export const LOAD_NAVIGATION_LINKS = '[Pf-Admin / Navigation] Load Pf-Admin Navigation Links';
export const LOAD_NAVIGATION_LINKS_SUCCESS = '[Pf-Admin / Navigation] Load Pf-Admin Navigation Links Success';
export const LOAD_NAVIGATION_LINKS_ERROR = '[Pf-Admin / Navigation] Load Pf-Admin Navigation Links Error';

export class LoadNavigationLinks implements Action {
    readonly type = LOAD_NAVIGATION_LINKS;
}

export class LoadNavigationLinksSuccess implements Action {
    readonly type = LOAD_NAVIGATION_LINKS_SUCCESS;

    constructor(public payload: NavigationLinkGroup[]) {}
}

export class LoadNavigationLinksError implements Action {
    readonly type = LOAD_NAVIGATION_LINKS_ERROR;
}

export type Actions
 = LoadNavigationLinks
 | LoadNavigationLinksSuccess
 | LoadNavigationLinksError;
