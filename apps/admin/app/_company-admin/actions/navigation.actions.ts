import { Action } from '@ngrx/store';
import { NavigationLinkGroup } from 'libs/models/navigation';

export const LOAD_NAVIGATION_LINKS_SUCCESS = '[Company Admin - Navigation] Load Company Admin Navigation Links Success';
export const LOAD_NAVIGATION_LINKS_ERROR = '[Company Admin - Navigation] Load Company Admin Navigation Links Error';
export const LOAD_NAVIGATION_LINKS = '[Company Admin - Navigation] Load Company Admin Navigation Links';

export class LoadCompanyAdminNavigationLinks implements Action {
    readonly type = LOAD_NAVIGATION_LINKS;
}

export class LoadCompanyAdminNavigationLinksSuccess implements Action {
    readonly type = LOAD_NAVIGATION_LINKS_SUCCESS;

    constructor(public payload: NavigationLinkGroup[]) {}
}

export class LoadCompanyAdminNavigationLinksError implements Action {
    readonly type = LOAD_NAVIGATION_LINKS_ERROR;
}

export type NavigationActions
    = LoadCompanyAdminNavigationLinks
    | LoadCompanyAdminNavigationLinksSuccess
    | LoadCompanyAdminNavigationLinksError;
