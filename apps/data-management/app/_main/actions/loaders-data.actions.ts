import { Action } from '@ngrx/store';

import { CompositeDataLoadViewResponse, CompositeSummaryDownloadRequest } from 'libs/models';

export const GET_LATEST_ORG_DATA_LOAD = '[Data Management/Loaders Data] Get Latest Org Data Load';
export const GET_LATEST_ORG_DATA_LOAD_ERROR = '[Data Management/Loaders Data] Get Latest Org Data Load Error';
export const GET_LATEST_ORG_DATA_LOAD_SUCCESS = '[Data Management/Loaders Data] Get Latest Org Data Load Success';
export const OPEN_LATEST_ORG_DATA_LOAD_MODAL = '[Data Management/Loaders Data] Open Latest Org Data Load Modal';
export const CLOSE_LATEST_ORG_DATA_LOAD_MODAL = '[Data Management/Loaders Data] Close Latest Org Data Load Modal';
export const DOWNLOAD_IVRF = '[Data Management/Loaders Data] Download Invalid Records File';

export class GetLatestOrgDataLoad implements Action {
  readonly type = GET_LATEST_ORG_DATA_LOAD;

}
export class GetLatestOrgDataLoadError implements Action {
  readonly type = GET_LATEST_ORG_DATA_LOAD_ERROR;

}
export class GetLatestOrgDataLoadSuccess implements Action {
  readonly type = GET_LATEST_ORG_DATA_LOAD_SUCCESS;

  constructor(public payload: CompositeDataLoadViewResponse) {}
}
export class OpenLatestOrgDataLoadModal implements Action {
  readonly type = OPEN_LATEST_ORG_DATA_LOAD_MODAL;
}
export class CloseLatestOrgDataLoadModal implements Action {
  readonly type = CLOSE_LATEST_ORG_DATA_LOAD_MODAL;
}
export class DownloadIVRF implements Action {
  readonly type = DOWNLOAD_IVRF;

  constructor(public payload: CompositeSummaryDownloadRequest) {}
}

export type Actions
  = GetLatestOrgDataLoad
  | GetLatestOrgDataLoadError
  | GetLatestOrgDataLoadSuccess
  | OpenLatestOrgDataLoadModal
  | CloseLatestOrgDataLoadModal
  | DownloadIVRF
;
