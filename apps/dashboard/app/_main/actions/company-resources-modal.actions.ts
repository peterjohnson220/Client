import { Action } from '@ngrx/store';


export const OPENING_NEW_FOLDER_MODAL = '[Company Resources/Company Resources Page Modal] Opening New Folder Modal';
export const CLOSING_NEW_FOLDER_MODAL = '[Company Resources/Company Resources Page Modal] Closing New Folder Modal';


export class OpeningNewFolderModal implements Action {
  readonly type = OPENING_NEW_FOLDER_MODAL;
}

export class ClosingNewFolderModal implements Action {
  readonly type = CLOSING_NEW_FOLDER_MODAL;
}


export type Actions
  = OpeningNewFolderModal
  | ClosingNewFolderModal;
