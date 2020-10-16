import { Action } from '@ngrx/store';

import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { CompanyStructureRangeOverride, RoundingSettingsDataObj } from 'libs/models/structures';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';

import { RangeGroupMetadata } from '../models';

export const SET_METADATA = '[Structures - Job Based Range - Shared] Set Metadata';
export const RECALCULATE_RANGES_WITHOUT_MID = '[Structures - Job Based Range - Shared] Recalculate Ranges Without Mid';
export const UPDATE_ROUNDING_TYPE = '[Structures - Job Based Range - Shared] Update Rounding Type';
export const UPDATE_ROUNDING_POINT = '[Structures - Job Based Range - Shared] Update Rounding Point';
export const SHOW_REMOVE_RANGE_MODAL = '[Structures - Job Based Range - Shared] Show Remove Range Modal';
export const REMOVING_RANGE = '[Structures - Job Based Range - Shared] Removing Range';
export const REMOVING_RANGE_SUCCESS = '[Structures - Job Based Range - Shared] Removing Range Success';
export const REMOVING_RANGE_ERROR = '[Structures - Job Based Range - Shared] Removing Range Error';
export const RESET_ROUNDING_SETTING = '[Structures - Job Based Range - Shared] Reset Rounding Setting';
export const UPDATE_ROUNDING_POINTS = '[Structures - Job Based Range - Shared] Update Rounding Points';
export const GET_OVERRIDDEN_RANGES = '[Structures - Job Based Range - Shared] Get Overridden Ranges';
export const GET_OVERRIDDEN_RANGES_SUCCESS = '[Structures - Job Based Range - Shared] Get Overridden Ranges Success';
export const GET_OVERRIDDEN_RANGES_ERROR = '[Structures - Job Based Range - Shared] Get Overridden Ranges Error';
export const REVERTING_RANGE_CHANGES = '[Structures - Job Based Range - Shared] Reverting Range Changes';
export const REVERTING_RANGE_CHANGES_SUCCESS = '[Structures - Job Based Range - Shared] Reverting Range Changes Success';
export const REVERTING_RANGE_CHANGES_ERROR = '[Structures - Job Based Range - Shared] Reverting Range Changes Error';
export const UPDATE_OVERRIDES = '[Structures - Job Based Range - Shared] Update Overrides';
export const GET_CURRENT_RANGE_GROUP = '[Structures - Job Based Range - Shared] Get Current Range Group';
export const GET_CURRENT_RANGE_GROUP_SUCCESS = '[Structures - Job Based Range - Shared] Get Current Range Group Success';
export const GET_CURRENT_RANGE_GROUP_ERROR = '[Structures - Job Based Range - Shared] Get Current Range Group Error';
export const GET_DATA_BY_RANGE_GROUP_ID = '[Structures - Job Based Range - Shared] Get Data By Range Group Id';
export const GET_DATA_BY_RANGE_GROUP_ID_SUCCESS = '[Structures - Job Based Range - Shared] Get Data by Range Group Success';
export const GET_DATA_BY_RANGE_GROUP_ID_ERROR = '[Structures - Job Based Range - Shared] Get Data by Range Group Id Error';
export const COMPARING_MODELS = '[Structures - Job Based Range - Shared] Comparing Models';
export const END_COMPARING_MODELS = '[Structures - Job Based Range - Shared] End Comparing Models';

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

  constructor(public payload: { RoundingSetting: string; RoundingType: RoundingTypes }) {}
}

export class UpdateRoundingPoint implements Action {
  readonly type = UPDATE_ROUNDING_POINT;

  constructor(public payload: { RoundingSetting: string; RoundingPoint: number }) {}
}

export class ShowRemoveRangeModal implements Action {
  readonly type = SHOW_REMOVE_RANGE_MODAL;

  constructor() {}
}

export class RemovingRange implements Action {
  readonly type = REMOVING_RANGE;

  constructor(public payload: { StructuresRangeId: number; IsCurrent: boolean; }) {}
}

export class RemovingRangeSuccess implements Action {
  readonly type = REMOVING_RANGE_SUCCESS;

  constructor() {}
}

export class RemovingRangeError implements Action {
  readonly type = REMOVING_RANGE_ERROR;

  constructor(public error: any) {}
}

export class ResetRoundingSetting implements Action {
  readonly type = RESET_ROUNDING_SETTING;

  constructor() {}
}

export class UpdateRoundingPoints implements Action {
  readonly type = UPDATE_ROUNDING_POINTS;

  constructor(public payload: { RoundingPoint: number }) {}
}

export class GetOverriddenRanges implements Action {
  readonly type = GET_OVERRIDDEN_RANGES;

  constructor(public payload: { pageViewId: string, rangeGroupId: number }) {}
}

export class GetOverriddenRangesSuccess implements Action {
  readonly type = GET_OVERRIDDEN_RANGES_SUCCESS;

  constructor(public payload: CompanyStructureRangeOverride[]) {}
}

export class GetOverriddenRangesError implements Action {
  readonly type = GET_OVERRIDDEN_RANGES_ERROR;

  constructor(public error: any) {}
}

export class RevertingRangeChanges implements Action {
  readonly type = REVERTING_RANGE_CHANGES;

  constructor(public payload: {
    pageViewId: string,
    rangeId: number,
    rangeGroupId: number,
    rowIndex: number
    roundingSettings: RoundingSettingsDataObj,
    refreshRowDataViewFilter: DataViewFilter
  }) {}
}

export class RevertingRangeChangesSuccess implements Action {
  readonly type = REVERTING_RANGE_CHANGES_SUCCESS;

  constructor(public payload: { pageViewId: string, refreshRowDataViewFilter: DataViewFilter, rowIndex: number }) {}
}

export class RevertingRangeChangesError implements Action {
  readonly type = REVERTING_RANGE_CHANGES_ERROR;

  constructor(public error: any) {}
}

export class UpdateOverrides implements  Action {
  readonly type = UPDATE_OVERRIDES;

  constructor(public payload: { rangeId: number, overrideToUpdate: CompanyStructureRangeOverride, removeOverride: boolean}) {}
}

export class GetCurrentRangeGroup implements Action {
  readonly type = GET_CURRENT_RANGE_GROUP;

  constructor(public payload: any) {}
}

export class GetCurrentRangeGroupSuccess implements Action {
  readonly type = GET_CURRENT_RANGE_GROUP_SUCCESS;

  constructor(public payload: any) {}
}

export class GetCurrentRangeGroupError implements Action {
  readonly type = GET_CURRENT_RANGE_GROUP_ERROR;

  constructor(public payload: any) {}
}

export class GetDataByRangeGroupId implements Action {
  readonly type = GET_DATA_BY_RANGE_GROUP_ID;

  constructor(public payload: { pageViewId: string, filters: DataViewFilter[] }) {}
}

export class GetDataByRangeGroupIdSuccess implements Action {
  readonly type = GET_DATA_BY_RANGE_GROUP_ID_SUCCESS;

  constructor(public payload: any) {}
}

export class GetDataByRangeGroupIdError implements Action {
  readonly type = GET_DATA_BY_RANGE_GROUP_ID_ERROR;

  constructor(public payload: any) {}
}

export class ComparingModels implements Action {
  readonly type = COMPARING_MODELS;
}

export class EndComparingModels implements Action {
  readonly type = END_COMPARING_MODELS;
}

export type SharedActions
  = SetMetadata
  | RecalculateRangesWithoutMid
  | UpdateRoundingType
  | UpdateRoundingPoint
  | RemovingRange
  | RemovingRangeSuccess
  | RemovingRangeError
  | ShowRemoveRangeModal
  | UpdateRoundingPoint
  | ResetRoundingSetting
  | UpdateRoundingPoints
  | GetOverriddenRanges
  | GetOverriddenRangesSuccess
  | GetOverriddenRangesError
  | RevertingRangeChanges
  | RevertingRangeChangesSuccess
  | RevertingRangeChangesError
  | UpdateOverrides
  | GetCurrentRangeGroup
  | GetCurrentRangeGroupSuccess
  | GetCurrentRangeGroupError
  | GetDataByRangeGroupId
  | GetDataByRangeGroupIdSuccess
  | GetDataByRangeGroupIdError
  | ComparingModels
  | EndComparingModels;
