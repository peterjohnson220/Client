import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { CompanyResourcePost, CompanyResources } from '../models';

export const GETTING_COMPANY_RESOURCES = '[Company Resources/Company Resources Page] Getting Company Resources';
export const GETTING_COMPANY_RESOURCES_SUCCESS = '[Company Resources/Company Resources Page] Getting Company Resources Success';
export const GETTING_COMPANY_RESOURCES_ERROR = '[Company Resources/Company Resources Page] Getting Company Resources Error';

export const ADDING_COMPANY_RESOURCE = '[Company Resources/Company Resources Page] Adding Company Resource';
export const ADDING_COMPANY_RESOURCE_SUCCESS = '[Company Resources/Company Resources Page] Adding Company Resource Success';
export const ADDING_COMPANY_RESOURCE_ERROR = '[Company Resources/Company Resources Page] Adding Company Resource Error';

export const DELETING_COMPANY_RESOURCE = '[Company Resources/Company Resources Page] Deleting Company Resource';
export const DELETING_COMPANY_RESOURCE_SUCCESS = '[Company Resources/Company Resources Page] Deleting Company Resource Success';
export const DELETING_COMPANY_RESOURCE_ERROR = '[Company Resources/Company Resources Page] Deleting Company Resource Error';

export class GettingCompanyResources implements Action {
  readonly type = GETTING_COMPANY_RESOURCES;
}

export class GettingCompanyResourcesSuccess implements Action {
  readonly type = GETTING_COMPANY_RESOURCES_SUCCESS;

  constructor(public payload: CompanyResources) {}
}

export class GettingCompanyResourcesError implements Action {
  readonly type = GETTING_COMPANY_RESOURCES_ERROR;

  constructor(public error: HttpErrorResponse) {}
}

export class AddingCompanyResource implements Action {
  readonly type = ADDING_COMPANY_RESOURCE;

  constructor(public payload: CompanyResourcePost) {}
}

export class AddingCompanyResourceSuccess implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_SUCCESS;

  constructor(public payload) {}
}

export class AddingCompanyResourceError implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_ERROR;

  constructor(public error: HttpErrorResponse) {}
}

export class DeletingCompanyResource implements Action {
  readonly type = DELETING_COMPANY_RESOURCE;

  constructor(public payload: number) {}
}

export class DeletingCompanyResourceSuccess implements Action {
  readonly type = DELETING_COMPANY_RESOURCE_SUCCESS;

  constructor(public payload) {}
}

export class DeletingCompanyResourceError implements Action {
  readonly type = DELETING_COMPANY_RESOURCE_ERROR;

  constructor(public error: HttpErrorResponse) {}
}

export type Actions
  = GettingCompanyResources
  | GettingCompanyResourcesSuccess
  | GettingCompanyResourcesError
  | AddingCompanyResource
  | AddingCompanyResourceSuccess
  | AddingCompanyResourceError
  | DeletingCompanyResource
  | DeletingCompanyResourceSuccess
  | DeletingCompanyResourceError;
