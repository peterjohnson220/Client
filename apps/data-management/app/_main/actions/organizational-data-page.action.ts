import { Action } from '@ngrx/store';

import { ConfigurationGroup } from 'libs/models/data-loads';

import { FileUploadDataModel } from '../models';

export const GET_ORGANIZATIONAL_HEADERS_LINK = '[Data Management / Org Data Load Page] Get Organizational Headers Link';
export const GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS = '[Data Management / Org Data Load Page] Get Organizational Headers Link Success';
export const GET_ORGANIZATIONAL_HEADERS_LINK_ERROR = '[Data Management / Org Data Load Page] Get Organizational Headers Link Error';
export const SET_MODAL_STATE_OPEN = '[Data Management / Org Data Load Page] Set Modal State';
export const GET_CONFIGURATION_GROUPS = '[Data Management / Org Data Load Page] Get Configuration Groups';
export const GET_CONFIGURATION_GROUPS_SUCCESS = '[Data Management / Org Data Load Page] Get Configuration Groups Success';
export const GET_CONFIGURATION_GROUPS_FAILED = '[Data Management / Org Data Load Page] Get Configuration Groups Failed';
export const UPLOAD_DATA = '[Data Management / Org Data Load Page] Upload Data';
export const UPLOAD_DATA_SUCCESS = '[Data Management / Org Data Load Page] Upload Data Success';
export const UPLOAD_DATA_FAILED = '[Data Management / Org Data Load Page] Upload Data Failed';
export const SAVE_CONFIGURATION_GROUP = '[Data Management / Org Data Load Page] Save Configuration Group';
export const SAVE_CONFIGURATION_GROUP_SUCCESS = '[Data Management / Org Data Load Page] Save Configuration Group Success';
export const SAVE_CONFIGURATION_GROUP_FAILED = '[Data Management / Org Data Load Page] Save Configuration Group Failed';
export const PUBLISH_DOWNLOAD_ORGANIZATIONAL_DATA = '[Data Management / Org Data Load Page] Publish Download Org Data Message';
export const PUBLISH_DOWNLOAD_ORGANIZATIONAL_DATA_SUCCESS = '[Data Management / Org Data Load Page] Publish Download Org Data Message Success';
export const PUBLISH_DOWNLOAD_ORGANIZATIONAL_DATA_ERROR = '[Data Management / Org Data Load Page] Publish Download Org Data Message Error';


export class PublishDownloadOrgDataMessage implements Action {
  readonly type = PUBLISH_DOWNLOAD_ORGANIZATIONAL_DATA;
  constructor(public companyId: number) { }
}

export class PublishDownloadOrgDataMessageSuccess implements Action {
  readonly type = PUBLISH_DOWNLOAD_ORGANIZATIONAL_DATA_SUCCESS;
  constructor(public payload: boolean) { }
}

export class PublishDownloadOrgDataMessageError implements Action {
  readonly type = PUBLISH_DOWNLOAD_ORGANIZATIONAL_DATA_ERROR;
}

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

export class GetConfigGroups implements Action {
  readonly type = GET_CONFIGURATION_GROUPS;
  constructor(public companyId: number, public loadType: string) { }
}

export class GetConfigGroupsSuccess implements Action {
  readonly type = GET_CONFIGURATION_GROUPS_SUCCESS;
  constructor(public payload: ConfigurationGroup[]) { }
}

export class GetConfigGroupsFailed implements Action {
  readonly type = GET_CONFIGURATION_GROUPS_FAILED;
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

export class SaveConfigGroup implements Action {
  readonly type = SAVE_CONFIGURATION_GROUP;
  constructor(public payload: ConfigurationGroup) { }
}

export class SaveConfigGroupSuccess implements Action {
  readonly type = SAVE_CONFIGURATION_GROUP_SUCCESS;
  constructor(public payload: ConfigurationGroup) { }
}

export class SaveConfigGroupFailed implements Action {
  readonly type = SAVE_CONFIGURATION_GROUP_FAILED;
}

export type Actions
  = GetOrganizationalHeadersLink
  | GetOrganizationalHeadersLinkSuccess
  | GetOrganizationalHeadersLinkError
  | SetModalStateOpen
  | GetConfigGroups
  | GetConfigGroupsSuccess
  | GetConfigGroupsFailed
  | UploadData
  | UploadDataSuccess
  | UploadDataFailed
  | SaveConfigGroup
  | SaveConfigGroupSuccess
  | SaveConfigGroupFailed
  | PublishDownloadOrgDataMessage
  | PublishDownloadOrgDataMessageError
  | PublishDownloadOrgDataMessageSuccess;
