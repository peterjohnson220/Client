import { Action } from '@ngrx/store';

export const SET_PAGE_TITLE = '[Structures - Job Based Range] Set Page Title';

export class SetPageTitle implements Action {
  readonly type = SET_PAGE_TITLE;

  constructor(public payload: { pageTitle: string }) {}
}

export type PageActions
  = SetPageTitle;
