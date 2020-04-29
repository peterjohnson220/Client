import { Action } from '@ngrx/store';

import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { RoundingSettingsDataObj } from 'libs/models/structures';

import { RangeGroupMetadata } from '../models';
import { Pages } from '../constants/pages';

export const SET_METADATA = '[Structures - Job Based Range - Shared] Set Metadata';
export const RECALCULATE_RANGES_WITHOUT_MID = '[Structures - Job Based Range - Shared] Recalculate Ranges Without Mid';
export const UPDATE_ROUNDING_TYPE = '[Structures - Job Based Range - Shared] Update Rounding Type';
export const UPDATE_ROUNDING_POINT = '[Structures - Job Based Range - Shared] Update Rounding Point';

export class SetMetadata implements Action {
  readonly type = SET_METADATA;

  constructor(public payload: RangeGroupMetadata) {}
}

export class RecalculateRangesWithoutMid implements Action {
  readonly type = RECALCULATE_RANGES_WITHOUT_MID;

  constructor(public payload: { rangeGroupId: number; rounding: RoundingSettingsDataObj; }) {}
}

export class UpdateRoundingType implements Action {
  readonly type = UPDATE_ROUNDING_TYPE;

  constructor(public payload: { RoundingSetting: string; RoundingType: RoundingTypes } ) {}
}

export class UpdateRoundingPoint implements Action {
  readonly type = UPDATE_ROUNDING_POINT;

  constructor(public payload: { RoundingSetting: string; RoundingPoint: number } ) {}
}

export type SharedActions
  = SetMetadata
  | RecalculateRangesWithoutMid
  | UpdateRoundingType
  | UpdateRoundingPoint;
