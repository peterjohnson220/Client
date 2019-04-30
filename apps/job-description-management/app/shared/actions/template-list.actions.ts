import { Action } from '@ngrx/store';

import { TemplateListItem } from '../models/template-list-item.model';

export const LOAD_TEMPLATE_LIST = '[job-description-management / Template List] Load Template List';
export const LOAD_TEMPLATE_LIST_ERROR = '[job-description-management / Template List] Load Template List Error';
export const LOAD_TEMPLATE_LIST_SUCCESS = '[job-description-management / Template List] Load Template List Success';

export class LoadTemplateList implements Action {
  readonly type = LOAD_TEMPLATE_LIST;

  constructor(public payload: { PublishedOnly: boolean }) {}
}

export class LoadTemplateListError implements Action {
  readonly type = LOAD_TEMPLATE_LIST_ERROR;
}

export class LoadTemplateListSuccess implements Action {
  readonly type = LOAD_TEMPLATE_LIST_SUCCESS;

  constructor(public payload: TemplateListItem[]) {}
}

export type Actions
  = LoadTemplateList
  | LoadTemplateListError
  | LoadTemplateListSuccess;
