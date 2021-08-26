import { Action } from '@ngrx/store';

import { ExportData } from 'libs/models/comphub';


export const GET_EXPORT_DATA = '[Comphub/Export Job Report] Get Export Data';
export const GET_EXPORT_DATA_SUCCESS = '[Comphub/Export Job Report] Get Export Data Success';
export const GET_EXPORT_DATA_ERROR = '[Comphub/Export Job Report] Get Export Data Error';
export const SAVE_EXPORT_DATA = '[Comphub/Export Data] Save Export Data';
export const SAVE_EXPORT_DATA_SUCCESS = '[Comphub/Export Data] Save Export Data Success';
export const SAVE_EXPORT_DATA_ERROR = '[Comphub/Export Data] Save Export Data Error';

export class GetExportData implements Action {
  readonly type = GET_EXPORT_DATA;

  constructor() {}
}

export class GetExportDataSuccess implements Action {
  readonly type = GET_EXPORT_DATA_SUCCESS;

  constructor(public payload: ExportData) {}
}

export class GetExportDataError implements Action {
  readonly type = GET_EXPORT_DATA_ERROR;

  constructor() {}
}

export class SaveExportData implements Action {
  readonly type = SAVE_EXPORT_DATA;

  constructor() {}
}

export class SaveExportDataSuccess implements Action {
  readonly type = SAVE_EXPORT_DATA_SUCCESS;

  constructor() {}
}

export class SaveExportDataError implements Action {
  readonly type = SAVE_EXPORT_DATA_ERROR;

  constructor() {}
}

export type Actions
  = GetExportData
  | GetExportDataSuccess
  | GetExportDataError
  | SaveExportData
  | SaveExportDataSuccess
  | SaveExportDataError;
