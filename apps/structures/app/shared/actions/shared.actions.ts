import { Action } from '@ngrx/store';

import { CompanyStructureRangeOverride, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { CurrentRangeGroupRequestModel, DataViewFilter } from 'libs/models/payfactors-api';

import { SelectedPeerExchangeModel } from '../models';

export const SET_METADATA = '[Structures - Shared] Set Metadata';
export const SET_METADATA_FROM_RANGE_GROUP_ID = '[Structures - Shared] Set Metadata From RangeGroupId';
export const UPDATE_ROUNDING_TYPE = '[Structures - Shared] Update Rounding Type';
export const UPDATE_ROUNDING_POINT = '[Structures - Shared] Update Rounding Point';
export const UPDATE_ROUNDING_SETTINGS = '[Structures - Shared] Update Rounding Settings';
export const RESET_ROUNDING_SETTING = '[Structures - Shared] Reset Rounding Setting';
export const UPDATE_ROUNDING_POINTS = '[Structures - Shared] Update Rounding Points';
export const GET_COMPANY_EXCHANGES = '[Structures - Shared] Get Company Exchanges';
export const GET_COMPANY_EXCHANGES_SUCCESS = '[Structures - Shared] Get Company Exchanges Success';
export const GET_COMPANY_EXCHANGES_ERROR = '[Structures - Shared] Get Company Exchanges Error';
export const SET_SELECTED_PEER_EXCHANGE = '[Structures - Shared] Set Selected Peer Exchange';
export const GET_OVERRIDDEN_RANGES = '[Structures - Shared] Get Overridden Ranges';
export const GET_OVERRIDDEN_RANGES_SUCCESS = '[Structures - Shared] Get Overridden Ranges Success';
export const GET_OVERRIDDEN_RANGES_ERROR = '[Structures - Shared] Get Overridden Ranges Error';
export const UPDATE_OVERRIDES = '[Structures - Shared] Update Overrides';
export const GET_DISTINCT_OVERRIDE_MESSAGES = '[Structures - Shared] Get Distinct Override Messages';
export const GET_DISTINCT_OVERRIDE_MESSAGES_SUCCESS = '[Structures - Shared] Get Distinct Override Messages Success';
export const GET_DISTINCT_OVERRIDE_MESSAGES_ERROR = '[Structures - Shared] Get Distinct Override Messages Error';
export const REVERTING_RANGE_CHANGES = '[Structures - Shared] Reverting Range Changes';
export const REVERTING_RANGE_CHANGES_SUCCESS = '[Structures - Shared] Reverting Range Changes Success';
export const REVERTING_RANGE_CHANGES_ERROR = '[Structures - Shared] Reverting Range Changes Error';
export const COMPARING_MODELS = '[Structures - Shared] Comparing Models';
export const END_COMPARING_MODELS = '[Structures - Shared] End Comparing Models';
export const ENABLE_COMPARE_FLAG = '[Structures - Shared] Enable Compare Flag';
export const DISABLE_COMPARE_FLAG = '[Structures - Shared] Disable Compare Flag';
export const RECALCULATE_RANGES_WITHOUT_MID = '[Structures - Shared] Recalculate Ranges Without Mid';
export const GET_CURRENT_RANGE_GROUP = '[Structures - Shared] Get Current Range Group';
export const GET_CURRENT_RANGE_GROUP_SUCCESS = '[Structures - Shared] Get Current Range Group Success';
export const GET_CURRENT_RANGE_GROUP_ERROR = '[Structures - Shared] Get Current Range Group Error';
export const GET_GRADE_RANGE_DETAILS = '[Structures - Grade Based Range - Shared] Get Grade Range Details';
export const GET_GRADE_RANGE_DETAILS_SUCCESS = '[Structures - Grade Based Range - Shared] Get Grade Range Details Success';
export const GET_GRADE_RANGE_DETAILS_ERROR = '[Structures - Grade Based Range - Shared] Get Grade Range Details Error';

export class SetMetadata implements Action {
  readonly type = SET_METADATA;

  constructor(public payload: RangeGroupMetadata) {}
}

export class SetMetadataFromRangeGroupId implements Action {
  readonly type = SET_METADATA_FROM_RANGE_GROUP_ID;

  constructor(public rangeGroupId: any, public companyId: any ) {}
}


export class UpdateRoundingType implements Action {
  readonly type = UPDATE_ROUNDING_TYPE;

  constructor(public payload: { RoundingSetting: string; RoundingType: RoundingTypes }) {}
}

export class UpdateOverrides implements  Action {
  readonly type = UPDATE_OVERRIDES;

  constructor(public payload: { rangeId: number, overrideToUpdate: CompanyStructureRangeOverride, removeOverride: boolean}) {}
}

export class UpdateRoundingSettings implements Action {
  readonly type = UPDATE_ROUNDING_SETTINGS;

  constructor(public payload: RoundingSettingsDataObj) {}
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

export class UpdateRoundingPoint implements Action {
  readonly type = UPDATE_ROUNDING_POINT;

  constructor(public payload: { RoundingSetting: string; RoundingPoint: number }) {}
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

export class ResetRoundingSetting implements Action {
  readonly type = RESET_ROUNDING_SETTING;

  constructor(public rate: string) {}
}

export class UpdateRoundingPoints implements Action {
  readonly type = UPDATE_ROUNDING_POINTS;

  constructor(public payload: { RoundingPoint: number }) {}
}

export class GetCompanyExchanges implements Action {
  readonly type = GET_COMPANY_EXCHANGES;

  constructor(public payload: number) {}
}

export class GetCompanyExchangesSuccess implements Action {
  readonly type = GET_COMPANY_EXCHANGES_SUCCESS;

  constructor(public payload: any) {}
}

export class GetCompanyExchangesError implements Action {
  readonly type = GET_COMPANY_EXCHANGES_ERROR;

  constructor(public payload: any) {}
}

export class SetSelectedPeerExchange implements Action {
  readonly type = SET_SELECTED_PEER_EXCHANGE;

  constructor(public payload: SelectedPeerExchangeModel) {}
}


export class RevertingRangeChanges implements Action {
  readonly type = REVERTING_RANGE_CHANGES;

  constructor(public payload: {
    pageViewId: string,
    rangeId: number,
    rangeGroupId: number,
    rowIndex: number
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

export class RecalculateRangesWithoutMid implements Action {
  readonly type = RECALCULATE_RANGES_WITHOUT_MID;

  constructor(public payload: number) {}
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

export class GetGradeRangeDetails implements Action {
  readonly type = GET_GRADE_RANGE_DETAILS;

  constructor(public payload: any) {}
}

export class GetGradeRangeDetailsSuccess implements Action {
  readonly type = GET_GRADE_RANGE_DETAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetGradeRangeDetailsError implements Action {
  readonly type = GET_GRADE_RANGE_DETAILS_ERROR;

  constructor(public payload: any) {}
}

export type SharedActions
  = SetMetadata
  | UpdateRoundingType
  | UpdateRoundingPoint
  | UpdateRoundingSettings
  | ResetRoundingSetting
  | GetCompanyExchanges
  | GetCompanyExchangesSuccess
  | GetCompanyExchangesError
  | UpdateRoundingPoints
  | SetSelectedPeerExchange
  | RevertingRangeChanges
  | RevertingRangeChangesSuccess
  | RevertingRangeChangesError
  | GetOverriddenRanges
  | GetOverriddenRangesSuccess
  | GetOverriddenRangesError
  | UpdateOverrides
  | GetDistinctOverrideMessages
  | GetDistinctOverrideMessagesSuccess
  | GetDistinctOverrideMessagesError
  | ComparingModels
  | EndComparingModels
  | EnableCompareFlag
  | DisableCompareFlag
  | GetCurrentRangeGroup
  | GetCurrentRangeGroupSuccess
  | GetCurrentRangeGroupError
  | GetGradeRangeDetails
  | GetGradeRangeDetailsSuccess
  | GetGradeRangeDetailsError
  | SetMetadataFromRangeGroupId;

