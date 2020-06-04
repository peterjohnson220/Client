import { Action } from '@ngrx/store';

import { TemplateListItem } from 'libs/models';

export const LOAD_TEMPLATE_LIST = '[JobDescription/Template List] Load Templates List';
export const LOAD_TEMPLATE_LIST_SUCCESS = '[JobDescription/Template List] Load Templates List Success';
export const LOAD_TEMPLATE_LIST_ERROR = '[JobDescription/Template List] Load Templates List Error';

export const DELETE_TEMPLATE = '[JobDescription/Template] Delete Template';
export const DELETE_TEMPLATE_SUCCESS = '[JobDescription/Template] Delete Template Success';
export const DELETE_TEMPLATE_ERROR = '[JobDescription/Template] Delete Template Error';

export class LoadTemplateList implements Action {
  readonly type = LOAD_TEMPLATE_LIST;
}

export class LoadTemplateListSuccess implements Action {
  readonly type = LOAD_TEMPLATE_LIST_SUCCESS;

  constructor(public payload: TemplateListItem[]) {}
}

export class LoadTemplateListError implements Action {
  readonly type = LOAD_TEMPLATE_LIST_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class DeleteTemplate implements Action {
  readonly type = DELETE_TEMPLATE;

  constructor(public payload: {id: number}) {}
}

export class DeleteTemplateSuccess implements Action {
  readonly type = DELETE_TEMPLATE_SUCCESS;
}

export class DeleteTemplateError implements Action {
  readonly type = DELETE_TEMPLATE_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export type TemplateListActions
 = LoadTemplateList
 | LoadTemplateListSuccess
 | LoadTemplateListError
 | DeleteTemplate
 | DeleteTemplateSuccess
 | DeleteTemplateError;
