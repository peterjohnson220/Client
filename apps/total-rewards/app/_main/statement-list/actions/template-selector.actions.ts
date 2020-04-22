import { Action } from '@ngrx/store';

export const LOAD_TEMPLATES = '[Total Rewards/Statement List/Template Selector] Load Templates';
export const LOAD_TEMPLATES_SUCCESS = '[Total Rewards/Statement List/Template Selector] Load Templates Success';
export const LOAD_TEMPLATES_ERROR = '[Total Rewards/Statement List/Template Selector] Load Templates Error';

export class LoadTemplates implements Action {
  readonly type = LOAD_TEMPLATES;
}

export class LoadTemplatesSuccess implements Action {
  readonly type = LOAD_TEMPLATES_SUCCESS;
  constructor(public payload: any[]) {}
}

export class LoadTemplatesError implements Action {
  readonly type = LOAD_TEMPLATES_ERROR;
}

export type TemplateSelectorActions =
  LoadTemplates |
  LoadTemplatesSuccess |
  LoadTemplatesError;
