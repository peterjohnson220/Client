import { Action } from '@ngrx/store';

import { RangeGroupMetadata } from '../models';
import { Pages } from '../constants/pages';

export const SET_METADATA = '[Structures - Job Based Range - Shared] Set Metadata';
export const UPDATE_MID = '[Structures - Job Based Range - Shared] Update Range Mid';
export const UPDATE_MID_ERROR = '[Structures - Job Based Range - Shared] Update Range Mid Error';
export const SET_IS_NEW_MODEL_ADD_JOBS = '[Structures - Job Based Range - Shared] Set Is New Model Add Jobs';
export const SET_IS_NEW_MODEL_MODEL_SETTINGS = '[Structures - Job Based Range - Shared] Set Is New Model Model Settings';

export class SetMetadata implements Action {
  readonly type = SET_METADATA;

  constructor(public payload: RangeGroupMetadata) {}
}

export class UpdateMid implements Action {
  readonly type = UPDATE_MID;

  constructor(public payload: { RangeGroupId: number; RangeId: number; Mid: number; RowIndex: number; Page: Pages }) {}
}


export class UpdateMidError implements Action {
  readonly type = UPDATE_MID_ERROR;
}

export class SetIsNewModelAddJobs implements Action {
  readonly type = SET_IS_NEW_MODEL_ADD_JOBS;

  constructor(public payload: boolean) {}
}

export class SetIsNewModelModelSettings implements Action {
  readonly type = SET_IS_NEW_MODEL_MODEL_SETTINGS;

  constructor(public payload: boolean) {}
}

export type SharedActions
  = SetMetadata
  | UpdateMid
  | UpdateMidError
  | SetIsNewModelAddJobs
  | SetIsNewModelModelSettings;
