import { Action } from '@ngrx/store';

import { RoundingSettingsDataObj } from 'libs/models/structures';
import { DataViewFilter } from 'libs/models/payfactors-api';

export const UPDATE_MID = '[Feature - Structures - Midpoint Edit] Update Range Mid';
export const UPDATE_MID_SUCCESS = '[Feature - Structures - Midpoint Edit] Update Range Mid Success';
export const UPDATE_MID_ERROR = '[Feature - Structures - Midpoint Edit] Update Range Mid Error';

export class UpdateMid implements Action {
  readonly type = UPDATE_MID;

  constructor( public payload: {
    pageViewId: string,
    rangeGroupId: number
    rangeId: number
    mid: number
    rowIndex: number
    roundingSettings: RoundingSettingsDataObj,
    refreshRowDataViewFilter: DataViewFilter,
    metaInfo: any,
    successCallBackFn: any;
  }) {}
}

export class UpdateMidSuccess implements Action {
  readonly type = UPDATE_MID_SUCCESS;

  constructor(public payload: { pageViewId: string, refreshRowDataViewFilter: DataViewFilter, rowIndex: number }) {}
}

export class UpdateMidError implements Action {
  readonly type = UPDATE_MID_ERROR;
}

export type MidpointEditActions
  = UpdateMid
  | UpdateMidSuccess
  | UpdateMidError;
