import { Action } from '@ngrx/store';

import { ProjectTemplate } from 'libs/models/payfactors-api/project/response';

export const GET_PROJECT_TEMPLATES  = '[User Settings / User Settings Page] Get Project Templates';
export const GET_PROJECT_TEMPLATES_SUCCESS  = '[User Settings / User Settings Page] Get Project Templates Success';
export const GET_PROJECT_TEMPLATES_ERROR  = '[User Settings / User Settings Page] Get Project Templates Error';
export const DELETE_PROJECT_TEMPLATE  = '[User Settings / User Settings Page] Delete Project Template';
export const DELETE_PROJECT_TEMPLATE_SUCCESS  = '[User Settings / User Settings Page] Delete Project Template Success';
export const DELETE_PROJECT_TEMPLATE_ERROR  = '[User Settings / User Settings Page] Delete Project Template Error';

export class GetProjectTemplates implements Action {
  readonly type = GET_PROJECT_TEMPLATES;

  constructor() {}
}

export class GetProjectTemplatesSuccess implements Action {
  readonly type = GET_PROJECT_TEMPLATES_SUCCESS;

  constructor(public payload: ProjectTemplate[]) {}
}

export class GetProjectTemplatesError implements Action {
  readonly type = GET_PROJECT_TEMPLATES_ERROR;

  constructor() {}
}

export class DeleteProjectTemplate implements Action {
  readonly type = DELETE_PROJECT_TEMPLATE;

  constructor(public payload: number) {}
}

export class DeleteProjectTemplateSuccess implements Action {
  readonly type = DELETE_PROJECT_TEMPLATE_SUCCESS;

  constructor(public payload: number) {}
}

export class DeleteProjectTemplateError implements Action {
  readonly type = DELETE_PROJECT_TEMPLATE_ERROR;

  constructor() {}
}


export type Actions
  = GetProjectTemplates
  | GetProjectTemplatesSuccess
  | GetProjectTemplatesError
  | DeleteProjectTemplate
  | DeleteProjectTemplateSuccess
  | DeleteProjectTemplateError;
