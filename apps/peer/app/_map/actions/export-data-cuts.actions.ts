import { Action } from '@ngrx/store';

export const EXPORT_DATA_CUTS  = '[Peer Main/Map/Export Data Cuts] Export Data Cuts';
export const EXPORT_DATA_CUTS_SUCCESS  = 'Peer Main/Map/Export Data Cuts] Export Data Cuts Success';
export const EXPORT_DATA_CUTS_ERROR  = 'Peer Main/Map/Export Data Cuts] Export Data Cuts Error';
export const OPEN_EXPORT_DATA_CUTS_MODAL  = 'Peer Main/Map/Export Data Cuts] Open Export Data Cuts Modal';
export const CLOSE_EXPORT_DATA_CUTS_MODAL  = 'Peer Main/Map/Export Data Cuts] Close Export Data Cuts Modal';

export class ExportDataCuts implements Action {
  readonly type = EXPORT_DATA_CUTS;
}

export class ExportDataCutsSuccess implements Action {
  readonly type = EXPORT_DATA_CUTS_SUCCESS;
}

export class ExportDataCutsError implements Action {
  readonly type = EXPORT_DATA_CUTS_ERROR;
}

export class OpenExportDataCutsModal implements Action {
  readonly type = OPEN_EXPORT_DATA_CUTS_MODAL;
}

export class CloseExportDataCutsModal implements Action {
  readonly type = CLOSE_EXPORT_DATA_CUTS_MODAL;
}

export type Actions
  = ExportDataCuts
  | ExportDataCutsSuccess
  | ExportDataCutsError
  | OpenExportDataCutsModal
  | CloseExportDataCutsModal;
