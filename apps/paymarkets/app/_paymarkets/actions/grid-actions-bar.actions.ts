import { Action } from '@ngrx/store';
import { MultiSelectItemGroup } from 'libs/ui/common';

export const GET_COMPANY_SCOPE_SIZES = '[PayMarkets / Grid Actions Bar] Get Company Scope Sizes';
export const GET_COMPANY_SCOPE_SIZES_SUCCESS = '[PayMarkets / Grid Actions Bar] Get Company Scope Sizes Success';
export const GET_COMPANY_SCOPE_SIZES_ERROR = '[PayMarkets / Grid Actions Bar] Get Company Scope Sizes Error';
export const UPDATE_SELECTED_SIZES = '[PayMarkets / Grid Actions Bar] Update Selected Sizes';

export class GetCompanyScopeSizes implements Action {
  readonly type = GET_COMPANY_SCOPE_SIZES;
  constructor() {}
}

export class GetCompanyScopeSizesSuccess implements Action {
  readonly type = GET_COMPANY_SCOPE_SIZES_SUCCESS;

  constructor(public payload: MultiSelectItemGroup[]) {}
}

export class GetCompanyScopeSizesError implements Action {
  readonly type = GET_COMPANY_SCOPE_SIZES_ERROR;
  constructor() {}
}

export class UpdateSelectedSizes implements Action {
  readonly type = UPDATE_SELECTED_SIZES;

  constructor(public payload: MultiSelectItemGroup[]) {}
}

export type Actions
  = GetCompanyScopeSizes
  | GetCompanyScopeSizesSuccess
  | GetCompanyScopeSizesError
  | UpdateSelectedSizes;
