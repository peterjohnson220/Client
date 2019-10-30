import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { CompanyResources, CompanyResourceFolderPost } from '../models';


export const GETTING_COMPANY_RESOURCES = '[Company Resources/Company Resources Page] Getting Company Resources';
export const GETTING_COMPANY_RESOURCES_SUCCESS = '[Company Resources/Company Resources Page] Getting Company Resources Success';
export const GETTING_COMPANY_RESOURCES_ERROR = '[Company Resources/Company Resources Page] Getting Company Resources Error';
export const ADDING_COMPANY_RESOURCE = '[Company Resources/Company Resources Page] Adding Company Resource';
export const ADDING_COMPANY_RESOURCE_SUCCESS = '[Company Resources/Company Resources Page] Adding Company Resource Success';
export const ADDING_COMPANY_RESOURCE_TO_FOLDER_SUCCESS = '[Company Resources/Company Resources Page] Adding Company Resource To Folder Success';
export const ADDING_COMPANY_RESOURCE_ORPHAN_SUCCESS = '[Company Resources/Company Resources Page] Adding Company Resource Orphan Success';
export const ADDING_COMPANY_RESOURCE_AND_FOLDER_SUCCESS = '[Company Resources/Company Resources Page] Adding Company Resource and Folder Success';
export const ADDING_COMPANY_RESOURCE_ERROR = '[Company Resources/Company Resources Page] Adding Company Resource Error';
export const DELETING_COMPANY_RESOURCE = '[Company Resources/Company Resources Page] Deleting Company Resource';
export const DELETING_COMPANY_RESOURCE_SUCCESS = '[Company Resources/Company Resources Page] Deleting Company Resource Success';
export const DELETING_COMPANY_RESOURCE_ERROR = '[Company Resources/Company Resources Page] Deleting Company Resource Error';
export const ADDING_FOLDER_TO_COMPANY_RESOURCES = '[Company Resources/Company Resources Page] Adding Folder To Company Resources';
export const ADDING_FOLDER_TO_COMPANY_RESOURCES_SUCCESS = '[Company Resources/Company Resources Page] Adding Folder To Company Resources Success';
export const ADDING_FOLDER_TO_COMPANY_RESOURCES_ERROR = '[Company Resources/Company Resources Page] Adding Folder To Company Resources Error';
export const DELETING_FOLDER_FROM_COMPANY_RESOURCES = '[Company Resources/Company Resources Page] Deleting Folder From Company Resources';
export const DELETING_FOLDER_FROM_COMPANY_RESOURCES_SUCCESS = '[Company Resources/Company Resources Page] Deleting Folder From Company Resources Success';
export const DELETING_FOLDER_FROM_COMPANY_RESOURCES_ERROR = '[Company Resources/Company Resources Page] Deleting Folder From Company Resources Error';


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

  constructor(public payload) {}
}

export class AddingCompanyResourceSuccess implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_SUCCESS;
}

export class AddingCompanyResourceToFolderSuccess implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_TO_FOLDER_SUCCESS;

  constructor(public payload) {}
}

export class AddingCompanyResourceOrphanSuccess implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_ORPHAN_SUCCESS;

  constructor(public payload) {}
}

export class AddingCompanyResourceAndFolderSuccess implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_AND_FOLDER_SUCCESS;

  constructor(public payload) {}
}

export class AddingCompanyResourceError implements Action {
  readonly type = ADDING_COMPANY_RESOURCE_ERROR;

  constructor(public error) {}
}

export class DeletingCompanyResource implements Action {
  readonly type = DELETING_COMPANY_RESOURCE;

  constructor(public payload) {}
}

export class DeletingCompanyResourceSuccess implements Action {
  readonly type = DELETING_COMPANY_RESOURCE_SUCCESS;

  constructor(public payload) {}
}

export class DeletingCompanyResourceError implements Action {
  readonly type = DELETING_COMPANY_RESOURCE_ERROR;

  constructor(public error: HttpErrorResponse) {}
}


export class AddingFolderToCompanyResources implements Action {
  readonly type = ADDING_FOLDER_TO_COMPANY_RESOURCES;

  constructor(public payload: CompanyResourceFolderPost) {}
}

export class AddingFolderToCompanyResourcesSuccess implements Action {
  readonly type = ADDING_FOLDER_TO_COMPANY_RESOURCES_SUCCESS;

  constructor(public payload) {}
}

export class AddingFolderToCompanyResourcesError implements Action {
  readonly type = ADDING_FOLDER_TO_COMPANY_RESOURCES_ERROR;

  constructor(public payload) {}
}

export class DeletingFolderFromCompanyResources implements Action {
  readonly type = DELETING_FOLDER_FROM_COMPANY_RESOURCES;

  constructor(public payload: number) {}
}

export class DeletingFolderFromCompanyResourcesSuccess implements Action {
  readonly type = DELETING_FOLDER_FROM_COMPANY_RESOURCES_SUCCESS;

  constructor(public payload) {}
}

export class DeletingFolderFromCompanyResourcesError implements Action {
  readonly type = DELETING_FOLDER_FROM_COMPANY_RESOURCES_ERROR;

  constructor(public payload) {}
}

export type Actions
  = GettingCompanyResources
  | GettingCompanyResourcesSuccess
  | GettingCompanyResourcesError
  | AddingCompanyResource
  | AddingCompanyResourceSuccess
  | AddingCompanyResourceToFolderSuccess
  | AddingCompanyResourceOrphanSuccess
  | AddingCompanyResourceAndFolderSuccess
  | AddingCompanyResourceError
  | DeletingCompanyResource
  | DeletingCompanyResourceSuccess
  | DeletingCompanyResourceError
  | AddingFolderToCompanyResources
  | AddingFolderToCompanyResourcesSuccess
  | AddingFolderToCompanyResourcesError
  | DeletingFolderFromCompanyResources
  | DeletingFolderFromCompanyResourcesSuccess
  | DeletingFolderFromCompanyResourcesError;
