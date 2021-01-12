import { Action } from '@ngrx/store';

import { RoundingSettingsDataObj } from 'libs/models/structures';
import {
  ConvertCurrencyAndRateRequestModel,
  CurrentRangeGroupRequestModel,
  GetStructureHasSettingsRequestModel,
} from 'libs/models/payfactors-api/structures/request';

export const RECALCULATE_RANGES_WITHOUT_MID = '[Structures - Job Based Range - Shared] Recalculate Ranges Without Mid';
export const SHOW_REMOVE_RANGE_MODAL = '[Structures - Job Based Range - Shared] Show Remove Range Modal';
export const REMOVING_RANGE = '[Structures - Job Based Range - Shared] Removing Range';
export const REMOVING_RANGE_SUCCESS = '[Structures - Job Based Range - Shared] Removing Range Success';
export const REMOVING_RANGE_ERROR = '[Structures - Job Based Range - Shared] Removing Range Error';
export const GET_CURRENT_RANGE_GROUP = '[Structures - Job Based Range - Shared] Get Current Range Group';
export const GET_CURRENT_RANGE_GROUP_SUCCESS = '[Structures - Job Based Range - Shared] Get Current Range Group Success';
export const GET_CURRENT_RANGE_GROUP_ERROR = '[Structures - Job Based Range - Shared] Get Current Range Group Error';
export const CONVERT_CURRENCY_AND_RATE = '[Structures - Job Based Range - Shared] Convert Currency And Rate';
export const CONVERT_CURRENCY_AND_RATE_SUCCESS = '[Structures - Job Based Range - Shared] Convert Currency And Rate Success';
export const CONVERT_CURRENCY_AND_RATE_ERROR = '[Structures - Job Based Range - Shared] Convert Currency And Rate Error';
export const GET_STRUCTURE_HAS_SETTINGS = '[Structures - Job Based Range - Shared] Get Structure Has Settings';
export const GET_STRUCTURE_HAS_SETTINGS_SUCCESS = '[Structures - Job Based Range - Shared] Get Structure Has Settings Success';
export const GET_STRUCTURE_HAS_SETTINGS_ERROR = '[Structures - Job Based Range - Shared] Get Structure Has Settings Error';

export class RecalculateRangesWithoutMid implements Action {
  readonly type = RECALCULATE_RANGES_WITHOUT_MID;

  constructor(public payload: { rangeGroupId: number; rounding: RoundingSettingsDataObj; }) {}
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


export type SharedActions
  = RecalculateRangesWithoutMid
  | RemovingRange
  | RemovingRangeSuccess
  | RemovingRangeError
  | ShowRemoveRangeModal
  | GetCurrentRangeGroup
  | GetCurrentRangeGroupSuccess
  | GetCurrentRangeGroupError
  | ConvertCurrencyAndRate
  | ConvertCurrencyAndRateSuccess
  | ConvertCurrencyAndRateError
  | GetStructureHasSettings
  | GetStructureHasSettingsSuccess
  | GetStructureHasSettingsError;


