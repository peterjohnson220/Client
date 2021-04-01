import { Action } from '@ngrx/store';
import { CompanyResourceUploadState } from '../models/company-resource-upload-state.model';

export const OPEN_ADD_RESOURCE_MODAL = '[Company Resources/Add Resource Modal] Open Company Resources Add Resource Modal';
export const CLOSE_ADD_RESOURCE_MODAL = '[Company Resources/Add Resource Modal] Close Company Resources Add Resource Modal';
export const SAVE_COMPANY_RESOURCES_UPLOAD_STATE = '[Company Resources/Add Resource Modal] Save Company Resources Upload State';
export const CLEAR_COMPANY_RESOURCES_UPLOAD_STATE = '[Company Resources/Add Resource Modal] Clear Company Resources Upload State';
export const COMPANY_RESOURCE_SCAN_SUCCESS = '[Company Resources/Add Resource Modal] Company Resource Scan Success';
export const COMPANY_RESOURCE_SCAN_FAILURE = '[Company Resources/Add Resource Modal] Company Resource Scan Failure';
export const DISCARD_COMPANY_RESOURCE = '[Company Resources/Add Resource Modal] Discard Company Resource';
export const DISCARD_COMPANY_RESOURCE_SUCCESS = '[Company Resources/Add Resource Modal] Discard Company Resource Success';
export const DISCARD_COMPANY_RESOURCE_ERROR = '[Company Resources/Add Resource Modal] Discard Company Resource Error';

export class OpenAddResourceModal implements Action {
  readonly type = OPEN_ADD_RESOURCE_MODAL;
  constructor(public folderName?: string) {}
}

export class CloseAddResourceModal implements Action {
  readonly type = CLOSE_ADD_RESOURCE_MODAL;
}

export class SaveCompanyResourcesUploadState implements Action {
  readonly type = SAVE_COMPANY_RESOURCES_UPLOAD_STATE;
  constructor(public payload: CompanyResourceUploadState) {}
}

export class ClearCompanyResourcesUploadState implements Action {
  readonly type = CLEAR_COMPANY_RESOURCES_UPLOAD_STATE;
}

export class CompanyResourceScanSuccess implements Action {
  readonly type = COMPANY_RESOURCE_SCAN_SUCCESS;
  constructor(public attachmentId: string) {}
}

export class CompanyResourceScanFailure implements Action {
  readonly type = COMPANY_RESOURCE_SCAN_FAILURE;
  constructor(public attachmentId: string) {}
}

export class DiscardCompanyResource implements Action {
  readonly type = DISCARD_COMPANY_RESOURCE;
  constructor(public payload: string) {}
}

export class DiscardCompanyResourceSuccess implements Action {
  readonly type = DISCARD_COMPANY_RESOURCE_SUCCESS;
}

export class DiscardCompanyResourceError implements Action {
  readonly type = DISCARD_COMPANY_RESOURCE_ERROR;
}

export type Actions
  = OpenAddResourceModal
  | CloseAddResourceModal
  | SaveCompanyResourcesUploadState
  | ClearCompanyResourcesUploadState
  | CompanyResourceScanSuccess
  | CompanyResourceScanFailure
  | DiscardCompanyResource
  | DiscardCompanyResourceSuccess
  | DiscardCompanyResourceError;
