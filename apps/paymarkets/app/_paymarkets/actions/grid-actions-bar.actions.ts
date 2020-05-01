import { Action } from '@ngrx/store';
import { MultiSelectItemGroup } from 'libs/ui/common';
import { TreeViewItem } from 'libs/ui/common/multi-select-treeview/models';

export const GET_COMPANY_SCOPE_SIZES = '[PayMarkets / Grid Actions Bar] Get Company Scope Sizes';
export const GET_COMPANY_SCOPE_SIZES_SUCCESS = '[PayMarkets / Grid Actions Bar] Get Company Scope Sizes Success';
export const GET_COMPANY_SCOPE_SIZES_ERROR = '[PayMarkets / Grid Actions Bar] Get Company Scope Sizes Error';
export const UPDATE_SELECTED_SIZES = '[PayMarkets / Grid Actions Bar] Update Selected Sizes';
export const GET_COMPANY_INDUSTRIES = '[PayMarkets / PayMarkets Page] Get Company Industries';
export const GET_COMPANY_INDUSTRIES_SUCCESS = '[PayMarkets / PayMarkets Page] Get Company Industries Success';
export const GET_COMPANY_INDUSTRIES_ERROR = '[PayMarkets / PayMarkets Page] Get Company Industries Error';
export const SET_SELECTED_INDUSTRIES = '[PayMarkets / PayMarkets Page] Set Selected Industries';


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

export class GetCompanyIndustries implements Action {
  readonly type = GET_COMPANY_INDUSTRIES;

  constructor() {}
}

export class GetCompanyIndustriesSuccess implements Action {
  readonly type = GET_COMPANY_INDUSTRIES_SUCCESS;

  constructor(public payload: TreeViewItem[]) {}
}

export class GetCompanyIndustriesError implements Action {
  readonly type = GET_COMPANY_INDUSTRIES_ERROR;

  constructor() {}
}

export class SetSelectedIndustries implements Action {
  readonly type = SET_SELECTED_INDUSTRIES;

  constructor(public payload: string[]) {}
}



export type Actions
  = GetCompanyScopeSizes
  | GetCompanyScopeSizesSuccess
  | GetCompanyScopeSizesError
  | UpdateSelectedSizes
  | GetCompanyIndustries
  | GetCompanyIndustriesSuccess
  | GetCompanyIndustriesError
  | SetSelectedIndustries;
