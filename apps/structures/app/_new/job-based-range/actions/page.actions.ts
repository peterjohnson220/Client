import { Action } from '@ngrx/store';

export const SET_PAGE_METADATA = '[Structures - Job Based Range] Set Page Metadata';

export class SetPageMetadata implements Action {
  readonly type = SET_PAGE_METADATA;

  constructor(public payload: { pageTitle: string, currency: string }) {}
}

export type PageActions
  = SetPageMetadata;
