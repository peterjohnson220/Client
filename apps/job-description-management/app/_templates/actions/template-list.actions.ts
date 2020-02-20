import { Action } from '@ngrx/store';

import { TemplateListItem } from '../models';

export const LOAD_TEMPLATE_LIST = '[JobDescription/Template List] Load Templates List';
export const LOAD_TEMPLATE_LIST_SUCCESS = '[JobDescription/Template List] Load Templates List Success';

export class LoadTemplateList implements Action {
  readonly type = LOAD_TEMPLATE_LIST;
}

export class LoadTemplateListSuccess implements Action {
  readonly type = LOAD_TEMPLATE_LIST_SUCCESS;

  constructor(public payload: TemplateListItem[]) {}
}

export type TemplateListActions
 = LoadTemplateList
 | LoadTemplateListSuccess;
