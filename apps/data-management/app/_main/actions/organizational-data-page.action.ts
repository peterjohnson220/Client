import { Action } from '@ngrx/store';

import { ConfigurationGroup, FileUploadDataModel } from '../models';

export const GET_ORGANIZATIONAL_HEADERS_LINK = '[Data Management / Org Data Load Page] Get Organizational Headers Link';
export const GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS = '[Data Management / Org Data Load Page] Get Organizational Headers Link Success';
export const GET_ORGANIZATIONAL_HEADERS_LINK_ERROR = '[Data Management / Org Data Load Page] Get Organizational Headers Link Error';
export const SET_MODAL_STATE_OPEN = '[Data Management / Org Data Load Page] Set Modal State';
export const GET_CONFIGURATION_GROUP = '[Data Management / Org Data Load Page] Get Manual Mapping';
export const GET_CONFIGURATION_GROUP_SUCCESS = '[Data Management / Org Data Load Page] Get Manual Mapping Success';
export const GET_CONFIGURATION_GROUP_FAILED = '[Data Management / Org Data Load Page] Get Manual Mapping Failed';
export const UPLOAD_DATA = '[Data Management / Org Data Load Page] Upload Data Mapping';
export const UPLOAD_DATA_SUCCESS = '[Data Management / Org Data Load Page] Upload Data Success';
export const UPLOAD_DATA_FAILED = '[Data Management / Org Data Load Page] Upload Data Failed';


export class GetOrganizationalHeadersLink implements Action {
  readonly type = GET_ORGANIZATIONAL_HEADERS_LINK;
}

export class GetOrganizationalHeadersLinkSuccess implements Action {
  readonly type = GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS;

  constructor(public payload: string) { }
}

export class GetOrganizationalHeadersLinkError implements Action {
  readonly type = GET_ORGANIZATIONAL_HEADERS_LINK_ERROR;
}

export class SetModalStateOpen implements Action {
  readonly type = SET_MODAL_STATE_OPEN;
  constructor(public payload: boolean) { }
}

export class GetConfigGroup implements Action {
  readonly type = GET_CONFIGURATION_GROUP;
  constructor(public companyId: number) { }
}

export class GetConfigGroupSuccess implements Action {
  readonly type = GET_CONFIGURATION_GROUP_SUCCESS;
  constructor(public payload: ConfigurationGroup) { }
}

export class GetConfigGroupFailed implements Action {
  readonly type = GET_CONFIGURATION_GROUP_FAILED;
}

export class UploadData implements Action {
  readonly type = UPLOAD_DATA;
  constructor(public payload: FileUploadDataModel) { }
}

export class UploadDataSuccess implements Action {
  readonly type = UPLOAD_DATA_SUCCESS;
  constructor(public payload: boolean) { }
}

export class UploadDataFailed implements Action {
  readonly type = UPLOAD_DATA_FAILED;
}

export type Actions
  = GetOrganizationalHeadersLink
  | GetOrganizationalHeadersLinkSuccess
  | GetOrganizationalHeadersLinkError
  | SetModalStateOpen
  | GetConfigGroup
  | GetConfigGroupSuccess
  | GetConfigGroupFailed
  | UploadData
  | UploadDataSuccess
  | UploadDataFailed;
