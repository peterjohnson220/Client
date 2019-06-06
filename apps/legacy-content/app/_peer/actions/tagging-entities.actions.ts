import { Action } from '@ngrx/store';

import { TagInformation, TagInformationRequest, Tag, SaveTagInformationRequest } from 'libs/models/peer';

export const LOAD_TAG_INFORMATION = '[Legacy Content/Tagging Entities] Load Tag Information';
export const LOAD_TAG_INFORMATION_SUCCESS = '[Legacy Content/Tagging Entities] Load Tag Information Success';
export const LOAD_TAG_INFORMATION_ERROR = '[Legacy Content/Tagging Entities] Load Tag Information Error';
export const ADD_TAG = '[Legacy Content/Tagging Entities] Add Tag';
export const REMOVE_TAG = '[Legacy Content/Tagging Entities] Remove Tag';
export const SAVE_TAG_INFORMATION = '[Legacy Content/Tagging Entities] Save Tag Information';
export const SAVE_TAG_INFORMATION_SUCCESS = '[Legacy Content/Tagging Entities] Save Tag Information Success';
export const SAVE_TAG_INFORMATION_ERROR = '[Legacy Content/Tagging Entities] Save Tag Information Error';
export const CLOSE_TAGGING_ENTITIES_MODAL = '[Legacy Content/Tagging Entities] Close Tagging Entities Modal';

export class LoadTagInformation implements Action {
  readonly type = LOAD_TAG_INFORMATION;

  constructor(public payload: TagInformationRequest) {}
}

export class LoadTagInformationSuccess implements Action {
  readonly type = LOAD_TAG_INFORMATION_SUCCESS;

  constructor(public payload: TagInformation[]) {}
}

export class LoadTagInformationError implements Action {
  readonly type = LOAD_TAG_INFORMATION_ERROR;
}

export class AddTag implements Action {
  readonly type = ADD_TAG;

  constructor(public payload: Tag) {}
}

export class RemoveTag implements Action {
  readonly type = REMOVE_TAG;

  constructor(public payload: Tag) {}
}

export class SaveTagInformation implements Action {
  readonly type = SAVE_TAG_INFORMATION;

  constructor(public payload: SaveTagInformationRequest) {}
}

export class SaveTagInformationSuccess implements Action {
  readonly type = SAVE_TAG_INFORMATION_SUCCESS;
}

export class SaveTagInformationError implements Action {
  readonly type = SAVE_TAG_INFORMATION_ERROR;
}

export class CloseTaggingEntitiesModal implements Action {
  readonly type = CLOSE_TAGGING_ENTITIES_MODAL;
}

export type Actions
  = LoadTagInformation
  | LoadTagInformationSuccess
  | LoadTagInformationError
  | AddTag
  | RemoveTag
  | SaveTagInformation
  | SaveTagInformationSuccess
  | SaveTagInformationError
  | CloseTaggingEntitiesModal;
