import { Action } from '@ngrx/store';

import { RoundingSettingsDataObj } from 'libs/models/structures';
import { DataViewFilter } from 'libs/models/payfactors-api';

export const UPDATE_RANGE_FIELD = '[Feature - Structures - Range Field Edit] Update Range Field';
export const UPDATE_RANGE_FIELD_SUCCESS = '[Feature - Structures - Range Field Edit] Update Range Field Success';
export const UPDATE_RANGE_FIELD_ERROR = '[Feature - Structures - Range Field Edit] Update Range Field Error';

export class UpdateRangeField implements Action {
  readonly type = UPDATE_RANGE_FIELD;

  constructor( public payload: {
    pageViewId: string,
    rangeGroupId: number
    rangeId: number
    fieldValue: number
    fieldName: string
    isMid: boolean
    rowIndex: number
    roundingSettings: RoundingSettingsDataObj,
    refreshRowDataViewFilter: DataViewFilter,
    metaInfo: any,
    successCallBackFn: any;
  }) {}
}

export class UpdateRangeFieldSuccess implements Action {
  readonly type = UPDATE_RANGE_FIELD_SUCCESS;

  constructor(public payload: { pageViewId: string, refreshRowDataViewFilter: DataViewFilter, rowIndex: number }) {}
}

export class UpdateRangeFieldError implements Action {
  readonly type = UPDATE_RANGE_FIELD_ERROR;
}


export type RangeFieldEditActions
  = UpdateRangeField
  | UpdateRangeFieldSuccess
  | UpdateRangeFieldError;
