import { Action } from '@ngrx/store';

import { ExportData } from 'libs/models/comphub';


export const SET_EXPORT_DATA = '[Comphub/Export Job Report] Set Export Data';
export const SET_EXPORT_DATA_SUCCESS = '[Comphub/Export Job Report] Set Export Data Success';
export const SET_EXPORT_DATA_ERROR = '[Comphub/Export Job Report] Set Export Data Error';
export const SAVE_EXPORT_DATA = '[Comphub/Export Data] Save Export Data';
export const SAVE_EXPORT_DATA_SUCCESS = '[Comphub/Export Data] Save Export Data Success';
export const SAVE_EXPORT_DATA_ERROR = '[Comphub/Export Data] Save Export Data Error';
export const GENERATE_PDF_EXPORT = '[Comphub/Export Data] Generate Pdf Export';
export const GENERATE_PDF_EXPORT_SUCCESS = '[Comphub/Export Data] Generate Pdf Export Success';
export const GENERATE_PDF_EXPORT_ERROR = '[Comphub/Export Data] Generate Pdf Export Error';

export class SetExportData implements Action {
  readonly type = SET_EXPORT_DATA;

  constructor() {}
}

export class SetExportDataSuccess implements Action {
  readonly type = SET_EXPORT_DATA_SUCCESS;

  constructor(public payload: ExportData) {}
}

export class SetExportDataError implements Action {
  readonly type = SET_EXPORT_DATA_ERROR;

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

export class GeneratePdfExport implements Action {
  readonly type = GENERATE_PDF_EXPORT;

  constructor(public payload: string) {}
}

export class GeneratePdfExportSuccess implements Action {
  readonly type = GENERATE_PDF_EXPORT_SUCCESS;

  constructor() {}
}

export class GeneratePdfExportError implements Action {
  readonly type = GENERATE_PDF_EXPORT_ERROR;

  constructor() {}
}


export type Actions
  = SetExportData
  | SetExportDataSuccess
  | SetExportDataError
  | SaveExportData
  | SaveExportDataSuccess
  | SaveExportDataError
  | GeneratePdfExport
  | GeneratePdfExportSuccess
  | GeneratePdfExportError;
