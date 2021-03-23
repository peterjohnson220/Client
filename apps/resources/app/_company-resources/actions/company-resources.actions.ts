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
export const UPDATE_RESOURCE_TITLE = '[Company Resources Page] Update Resource Title';
export const UPDATE_RESOURCE_TITLE_WITH_FOLDER_SUCCESS = '[Company Resources Page] Update Resource Title With Folder Success';
export const UPDATE_RESOURCE_TITLE_SUCCESS = '[Company Resources Page] Update Resource Title Success';
export const UPDATE_RESOURCE_TITLE_ERROR = '[Company Resources Page] Update Resource Title Error';
export const OPEN_RENAME_RESOURCE_MODAL = '[Company Resources Page] Open Rename Resource Modal';
export const CLOSE_RENAME_RESOURCE_MODAL = '[Company Resources Page] Close Rename Resource Modal';
export const UPDATE_FOLDER_NAME = '[Company Resources Page] Update Folder Name';
export const UPDATE_FOLDER_NAME_SUCCESS = '[Company Resources Page] Update Folder Name Success';
export const UPDATE_FOLDER_NAME_ERROR = '[Company Resources Page] Update Folder Name Error';
export const OPEN_RENAME_FOLDER_MODAL = '[Company Resources Page] Open Rename Folder Modal';
export const CLOSE_RENAME_FOLDER_MODAL = '[Company Resources Page] Close Rename Folder Modal';

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

  constructor(public payload) {}
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

export class UpdateResourceTitle implements Action {
  readonly type = UPDATE_RESOURCE_TITLE;
  constructor(public payload: {companyResourceId: number, title: string, companyResourceFolderId?: number}) {}
}

export class UpdateResourceTitleWithFolderSuccess implements Action {
  readonly type = UPDATE_RESOURCE_TITLE_WITH_FOLDER_SUCCESS;
  constructor(public payload: {companyResourceId: number, title: string, companyResourceFolderId: number}) {}
}

export class UpdateResourceTitleSuccess implements Action {
  readonly type = UPDATE_RESOURCE_TITLE_SUCCESS;
  constructor(public payload: {companyResourceId: number, title: string}) {}
}

export class UpdateResourceTitleError implements Action {
  readonly type = UPDATE_RESOURCE_TITLE_ERROR;
  constructor() {}
}

export class OpenRenameResourceModal implements Action {
  readonly type = OPEN_RENAME_RESOURCE_MODAL;
  constructor() {}
}

export class CloseRenameResourceModal implements Action {
  readonly type = CLOSE_RENAME_RESOURCE_MODAL;
  constructor() {}
}

export class UpdateFolderName implements Action {
  readonly type = UPDATE_FOLDER_NAME;
  constructor(public payload: {companyResourcesFolderId: number, folderName: string}) {}
}

export class UpdateFolderNameSuccess implements Action {
  readonly type = UPDATE_FOLDER_NAME_SUCCESS;
  constructor(public payload: {companyResourcesFolderId: number, folderName: string}) {}
}

export class UpdateFolderNameError implements Action {
  readonly type = UPDATE_FOLDER_NAME_ERROR;
  constructor(public errorMessage: string) {}
}

export class OpenRenameFolderModal implements Action {
  readonly type = OPEN_RENAME_FOLDER_MODAL;
  constructor() {}
}

export class CloseRenameFolderModal implements Action {
  readonly type = CLOSE_RENAME_FOLDER_MODAL;
  constructor() {}
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
  | DeletingFolderFromCompanyResourcesError
  | UpdateResourceTitle
  | UpdateResourceTitleSuccess
  | UpdateResourceTitleWithFolderSuccess
  | UpdateResourceTitleError
  | OpenRenameResourceModal
  | CloseRenameResourceModal
  | OpenRenameFolderModal
  | CloseRenameFolderModal
  | UpdateFolderName
  | UpdateFolderNameSuccess
  | UpdateFolderNameError;
