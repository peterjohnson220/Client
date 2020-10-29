import { Action } from '@ngrx/store';

import { NavigationLinkGroup } from 'libs/models/navigation';

export const LOAD_NAVIGATION_LINKS = '[Navigation] Load Navigation Links';
export const LOAD_NAVIGATION_LINKS_SUCCESS = '[Navigation] Load Navigation Links Success';
export const LOAD_NAVIGATION_LINKS_ERROR = '[Navigation] Load Navigation Links Error';

export class LoadNavigationLinks implements Action {
    readonly type = LOAD_NAVIGATION_LINKS;

    constructor(public payload: string) {}
}

export class LoadNavigationLinksSuccess implements Action {
    readonly type = LOAD_NAVIGATION_LINKS_SUCCESS;

    constructor(public payload: {adminLinks: NavigationLinkGroup[]}) {}
}

export class LoadNavigationLinksError implements Action {
    readonly type = LOAD_NAVIGATION_LINKS_ERROR;
}

export type Actions
 = LoadNavigationLinks
 | LoadNavigationLinksSuccess
 | LoadNavigationLinksError;
