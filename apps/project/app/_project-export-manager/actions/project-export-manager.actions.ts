import { Action } from '@ngrx/store';

import { ProjectTemplate } from 'libs/models/projects/project-templates';

export const GET_PROJECT_TEMPLATES = '[Project Export Manager] Get Project Templates';
export const GET_PROJECT_TEMPLATES_SUCCESS = '[Project Export Manager] Get Project Templates Success';
export const GET_PROJECT_TEMPLATES_ERROR = '[Project Export Manager] Get Project Templates Error';

export class GetProjectTemplates implements Action {
  readonly type = GET_PROJECT_TEMPLATES;
  constructor() {
  }
}

export class GetProjectTemplatesSuccess implements Action {
  readonly type = GET_PROJECT_TEMPLATES_SUCCESS;
  constructor(public payload: ProjectTemplate[]) {
  }
}

export class GetProjectTemplatesError implements Action {
  readonly type = GET_PROJECT_TEMPLATES_ERROR;
  constructor(public payload: any) {
  }
}

export type Actions
  = GetProjectTemplates
  | GetProjectTemplatesSuccess
  | GetProjectTemplatesError;
