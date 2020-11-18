import { Action } from '@ngrx/store';

import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { CompanyStructureRangeOverride, RoundingSettingsDataObj } from 'libs/models/structures';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import { RangeGroupMetadata } from 'libs/models/structures';
import {
  ConvertCurrencyAndRateRequestModel,
  CurrentRangeGroupRequestModel,
  GetStructureHasSettingsRequestModel,
} from 'libs/models/payfactors-api/structures/request';

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
export const COMPARING_MODELS = '[Structures - Job Based Range - Shared] Comparing Models';
export const END_COMPARING_MODELS = '[Structures - Job Based Range - Shared] End Comparing Models';
export const ENABLE_COMPARE_FLAG = '[Structures - Job Based Range - Shared] Enable Compare Flag';
export const DISABLE_COMPARE_FLAG = '[Structures - Job Based Range - Shared] Disable Compare Flag';
export const CONVERT_CURRENCY_AND_RATE = '[Structures - Job Based Range - Shared] Convert Currency And Rate';
export const CONVERT_CURRENCY_AND_RATE_SUCCESS = '[Structures - Job Based Range - Shared] Convert Currency And Rate Success';
export const CONVERT_CURRENCY_AND_RATE_ERROR = '[Structures - Job Based Range - Shared] Convert Currency And Rate Error';
export const GET_DISTINCT_OVERRIDE_MESSAGES = '[Structures - Job Based Range - Shared] Get Distinct Override Messages';
export const GET_DISTINCT_OVERRIDE_MESSAGES_SUCCESS = '[Structures - Job Based Range - Shared] Get Distinct Override Messages Success';
export const GET_DISTINCT_OVERRIDE_MESSAGES_ERROR = '[Structures - Job Based Range - Shared] Get Distinct Override Messages Error';
export const GET_STRUCTURE_HAS_SETTINGS = '[Structures - Job Based Range - Shared] Get Structure Has Settings';
export const GET_STRUCTURE_HAS_SETTINGS_SUCCESS = '[Structures - Job Based Range - Shared] Get Structure Has Settings Success';
export const GET_STRUCTURE_HAS_SETTINGS_ERROR = '[Structures - Job Based Range - Shared] Get Structure Has Settings Error';


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

  constructor(public payload: CurrentRangeGroupRequestModel) {}
}

export class GetCurrentRangeGroupSuccess implements Action {
  readonly type = GET_CURRENT_RANGE_GROUP_SUCCESS;

  constructor(public payload: any) {}
}

export class GetCurrentRangeGroupError implements Action {
  readonly type = GET_CURRENT_RANGE_GROUP_ERROR;

  constructor(public payload: any) {}
}

export class ComparingModels implements Action {
  readonly type = COMPARING_MODELS;
}

export class EndComparingModels implements Action {
  readonly type = END_COMPARING_MODELS;
}

export class EnableCompareFlag implements Action {
  readonly type = ENABLE_COMPARE_FLAG;
}

export class DisableCompareFlag implements Action {
  readonly type = DISABLE_COMPARE_FLAG;
}

export class ConvertCurrencyAndRate implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE;

  constructor(public payload: ConvertCurrencyAndRateRequestModel) {}
}

export class ConvertCurrencyAndRateSuccess implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE_SUCCESS;

  constructor(public payload: any) {}
}

export class ConvertCurrencyAndRateError implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE_ERROR;

  constructor(public payload: any) {}
}

export class GetStructureHasSettings implements Action {
  readonly type = GET_STRUCTURE_HAS_SETTINGS;

  constructor(public payload: GetStructureHasSettingsRequestModel) {}
}

export class GetStructureHasSettingsSuccess implements Action {
  readonly type = GET_STRUCTURE_HAS_SETTINGS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetStructureHasSettingsError implements Action {
  readonly type = GET_STRUCTURE_HAS_SETTINGS_ERROR;

  constructor(public payload: any) {}
}

export class GetDistinctOverrideMessages implements Action {
  readonly type = GET_DISTINCT_OVERRIDE_MESSAGES;

  constructor(public rangeGroupId: any) {}
}

export class GetDistinctOverrideMessagesSuccess implements Action {
  readonly type = GET_DISTINCT_OVERRIDE_MESSAGES_SUCCESS;

  constructor(public payload: any) {}
}

export class GetDistinctOverrideMessagesError implements Action {
  readonly type = GET_DISTINCT_OVERRIDE_MESSAGES_ERROR;

  constructor(public payload: any) {}
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
  | ComparingModels
  | EndComparingModels
  | EnableCompareFlag
  | DisableCompareFlag
  | ConvertCurrencyAndRate
  | ConvertCurrencyAndRateSuccess
  | ConvertCurrencyAndRateError
  | GetStructureHasSettings
  | GetStructureHasSettingsSuccess
  | GetStructureHasSettingsError
  | GetDistinctOverrideMessages
  | GetDistinctOverrideMessagesSuccess
  | GetDistinctOverrideMessagesError;

