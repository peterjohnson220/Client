import { Action } from '@ngrx/store';

import { LoadAndExportFilesCardState } from '../reducers/load-and-export-files-card.reducer';

export const INIT_LOAD_AND_EXPORT_FILES_CARD = '[Data Management/Load And Export Files Card] Init Load And Export Files Card';
export const INIT_LOAD_AND_EXPORT_FILES_CARD_ERROR = '[Data Management/Load And Export Files Card] Init Load And Export Files Card Error';
export const INIT_LOAD_AND_EXPORT_FILES_CARD_SUCCESS = '[Data Management/Load And Export Files Card] Init Load And Export Files Card Success';

export class InitLoadAndExportFilesCard implements Action {
  readonly type = INIT_LOAD_AND_EXPORT_FILES_CARD;
}
export class InitLoadAndExportFilesCardError implements Action {
  readonly type = INIT_LOAD_AND_EXPORT_FILES_CARD_ERROR;
}
export class InitLoadAndExportFilesCardSuccess implements Action {
  readonly type = INIT_LOAD_AND_EXPORT_FILES_CARD_SUCCESS;

  constructor(public payload: LoadAndExportFilesCardState) {}
}

export type Actions
  = InitLoadAndExportFilesCard
  | InitLoadAndExportFilesCardError
  | InitLoadAndExportFilesCardSuccess;
