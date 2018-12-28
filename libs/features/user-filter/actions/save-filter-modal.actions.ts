import { Action } from '@ngrx/store';

import { SaveFilterModalData, SavedFilter } from '../models';

export const OPEN_SAVE_MODAL = '[User Filter/Save Filter Modal] Open Save Filter Modal';
export const CLOSE_SAVE_MODAL = '[User Filter/Save Filter Modal] Close Save Filter Modal';
export const CREATE_SAVED_FILTER = '[User Filter/Save Filter Modal] Create Saved Filter';
export const SET_MODAL_DATA = '[User Filter/Save Filter Modal] Set Modal Data';
export const SAVE = '[User Filter/Save Filter Modal] Save';
export const UPDATE_META_INFO = '[User Filter/Save Filter Modal] Update Saved Filter MetaInfo';
export const UPDATE_META_INFO_SUCCESS = '[User Filter/Save Filter Modal] Update MetaInfo Success';

export class OpenSaveModal {
  readonly type = OPEN_SAVE_MODAL;
}

export class CloseSaveModal {
  readonly type = CLOSE_SAVE_MODAL;
}

export class CreateSavedFilter {
  readonly type = CREATE_SAVED_FILTER;
}

export class SetModalData {
  readonly type = SET_MODAL_DATA;

  constructor(public payload: SaveFilterModalData) {}
}

export class Save {
  readonly type = SAVE;

  constructor(public payload: SaveFilterModalData) {}
}

export class UpdateMetaInfo implements Action {
  readonly type = UPDATE_META_INFO;

  constructor(public payload: { savedFilter: SavedFilter, metaInfo: any }) {}
}

export class UpdateMetaInfoSuccess implements Action {
  readonly type = UPDATE_META_INFO_SUCCESS;
}

export type Actions
  = OpenSaveModal
  | CloseSaveModal
  | CreateSavedFilter
  | SetModalData
  | Save
  | UpdateMetaInfo
  | UpdateMetaInfoSuccess;
