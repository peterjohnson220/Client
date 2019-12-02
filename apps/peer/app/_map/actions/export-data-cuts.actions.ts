import { Action } from '@ngrx/store';

export const EXPORT_DATA_CUTS = '[Peer Main/Map/Export Data Cuts] Export Data Cuts';
export const EXPORT_DATA_CUTS_NEW = '[Peer Main/Map/Export Data Cuts New] Export Data Cuts New';
export const EXPORT_DATA_CUTS_SUCCESS = '[Peer Main/Map/Export Data Cuts] Export Data Cuts Success';
export const EXPORT_DATA_CUTS_ERROR = '[Peer Main/Map/Export Data Cuts] Export Data Cuts Error';
export const OPEN_EXPORT_DATA_CUTS_MODAL = '[Peer Main/Map/Export Data Cuts] Open Export Data Cuts Modal';
export const CLOSE_EXPORT_DATA_CUTS_MODAL = '[Peer Main/Map/Export Data Cuts] Close Export Data Cuts Modal';
export const SELECT_RATE = '[Peer Main/Map/Export Data Cuts] Select Rate';
export const SELECTED_RATE_PERSISTED = '[Peer Main/Map/Export Data Cuts] Selected Rate Persisted';

export class ExportDataCuts implements Action {
  readonly type = EXPORT_DATA_CUTS;

  constructor(public payload: {selectedRate: string, scopes: string[], exportCurrentMap: boolean}) {}
}

export class ExportDataCutsNew implements Action {
  readonly type = EXPORT_DATA_CUTS_NEW;

  constructor(public payload: {selectedRate: string, scopes: string[], exportCurrentMap: boolean}) {}
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

export class SelectRate implements Action {
  readonly type = SELECT_RATE;

  constructor(public payload: {newRate: string}) {}
}

export class SelectedRatePersisted implements Action {
  readonly type = SELECTED_RATE_PERSISTED;
}

export type Actions
  = ExportDataCuts
  | ExportDataCutsNew
  | ExportDataCutsSuccess
  | ExportDataCutsError
  | OpenExportDataCutsModal
  | CloseExportDataCutsModal
  | SelectRate
  | SelectedRatePersisted;
