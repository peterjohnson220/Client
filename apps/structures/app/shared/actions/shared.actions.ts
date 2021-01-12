import { Action } from '@ngrx/store';

import { CompanyStructureRangeOverride, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';
import { DataViewFilter } from 'libs/models/payfactors-api';

import { SelectedPeerExchangeModel } from '../../_job-based-range/shared/models';

export const SET_METADATA = '[Structures - Shared] Set Metadata';
export const UPDATE_ROUNDING_TYPE = '[Structures - Shared] Update Rounding Type';
export const UPDATE_ROUNDING_POINT = '[Structures - Shared] Update Rounding Point';
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

export class SetMetadata implements Action {
  readonly type = SET_METADATA;

  constructor(public payload: RangeGroupMetadata) {}
}

export class UpdateRoundingType implements Action {
  readonly type = UPDATE_ROUNDING_TYPE;

  constructor(public payload: { RoundingSetting: string; RoundingType: RoundingTypes }) {}
}

export class UpdateOverrides implements  Action {
  readonly type = UPDATE_OVERRIDES;

  constructor(public payload: { rangeId: number, overrideToUpdate: CompanyStructureRangeOverride, removeOverride: boolean}) {}
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

  constructor() {}
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

export type SharedActions
  = SetMetadata
  | UpdateRoundingType
  | UpdateRoundingPoint
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
  | GetDistinctOverrideMessagesError;

