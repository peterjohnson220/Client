import { Action } from '@ngrx/store';

import { LoaderSettingKeyName } from 'libs/models/data-loads';

export const GET_WORKSHEET_NAMES = '[Survey Loader / Upload Survey File] Get Worksheet Names';
export const GET_WORKSHEET_NAMES_SUCCESS = '[Survey Loader / Upload Survey File] Get Worksheet Names Success';
export const GET_WORKSHEET_NAMES_ERROR = '[Survey Loader / Upload Survey File] Get Worksheet Names Error';
export const UPDATE_LOADER_SETTING = '[Survey Loader / Upload Survey File] Update Loader Setting';
export const RESET_UPLOAD_STATE = '[Survey Loader / Upload Survey File] Reset Upload State';

export class GetWorksheetNames implements Action {
  readonly type = GET_WORKSHEET_NAMES;
  constructor(public payload: File) {}
}

export class GetWorksheetNamesSuccess implements Action {
  readonly type = GET_WORKSHEET_NAMES_SUCCESS;
  constructor(public payload: { worksheetNames: string[] }) {}
}

export class GetWorksheetNamesError implements Action {
  readonly type = GET_WORKSHEET_NAMES_ERROR;
  constructor() {}
}

export class UpdateLoaderSetting implements Action {
  readonly type = UPDATE_LOADER_SETTING;
  constructor(public payload: { keyName: LoaderSettingKeyName, keyValue: string }) {}
}

export class ResetUploadState implements Action {
  readonly type = RESET_UPLOAD_STATE;
  constructor() {}
}

export type Actions
  = GetWorksheetNames
  | GetWorksheetNamesSuccess
  | GetWorksheetNamesError
  | UpdateLoaderSetting
  | ResetUploadState;
