import { Action } from '@ngrx/store';

import { TemplateListItem } from 'libs/models/jdm';
import { LoadTemplateListRequest, LoadTemplateListByCompanyIdRequest } from '../models/requests';

export const LOAD_TEMPLATE_LIST = '[job-description-management / Template List] Load Template List';
export const LOAD_TEMPLATE_LIST_ERROR = '[job-description-management / Template List] Load Template List Error';
export const LOAD_TEMPLATE_LIST_SUCCESS = '[job-description-management / Template List] Load Template List Success';
export const LOAD_TEMPLATE_LIST_BY_COMPANY_ID = '[job-description-management / Template List] Load Template List By Company Id';
export const LOAD_TEMPLATE_LIST_BY_COMPANY_ID_SUCCESS =
  '[job-description-management / Template List] Load Template List By Company Id Success';

export class LoadTemplateList implements Action {
  readonly type = LOAD_TEMPLATE_LIST;

  constructor(public payload: LoadTemplateListRequest) {}
}

export class LoadTemplateListError implements Action {
  readonly type = LOAD_TEMPLATE_LIST_ERROR;
}

export class LoadTemplateListSuccess implements Action {
  readonly type = LOAD_TEMPLATE_LIST_SUCCESS;

  constructor(public payload: TemplateListItem[]) {}
}

export class LoadTemplateListByCompanyId implements Action {
  readonly type = LOAD_TEMPLATE_LIST_BY_COMPANY_ID;

  constructor(public payload: LoadTemplateListByCompanyIdRequest ) {}
}

export class LoadTemplateListByCompanyIdSuccess implements Action {
  readonly type = LOAD_TEMPLATE_LIST_BY_COMPANY_ID_SUCCESS;

  constructor(public payload: TemplateListItem[]) {}
}

export type Actions
  = LoadTemplateList
  | LoadTemplateListError
  | LoadTemplateListSuccess
  | LoadTemplateListByCompanyId
  | LoadTemplateListByCompanyIdSuccess;
