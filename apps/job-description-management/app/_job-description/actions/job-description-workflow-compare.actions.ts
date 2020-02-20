import { Action } from '@ngrx/store';

import { JobDescriptionWorkflowCompareListItem } from '../models';

export const LOADING_JOB_DESCRIPTION_COMPARISON = '[JobDescription/JobDescriptionWorkflowCompare] Loading Comparison';
export const LOAD_JOB_DESCRIPTION_COMPARISON_SUCCESS = '[JobDescription/JobDescriptionWorkflowCompare] Load Comparison Success';
export const LOAD_JOB_DESCRIPTION_COMPARISON_ERROR = '[JobDescription/JobDescriptionWorkflowCompare] Load Comparison Error';
export const LOAD_COMPARE_LIST_SUCCESS = '[JobDescription/JobDescriptionWorkflowCompare] Load Compare List Success';
export const LOAD_COMPARE_LIST = '[JobDescription/JobDescriptionWorkflowCompare] Load Compare List';
export const LOAD_COMPARE_LIST_ERROR = '[JobDescription/JobDescriptionWorkflowCompare] Load Compare List Error';
export const SET_SELECTED_SOURCE_COMPARE_LIST_ITEM = '[JobDescription/JobDescriptionWorkflowCompare] Set Selected Compare List Item';
export const SET_SELECTED_COMPARISON_COMPARE_LIST_ITEM = '[JobDescription/JobDescriptionWorkflowCompare] Set Selected Comparison Compare List Item';

export class LoadingJobDescriptionComparison implements Action {
  readonly type = LOADING_JOB_DESCRIPTION_COMPARISON;
  constructor(public payload: any) { }
}

export class LoadJobDescriptionComparisonSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadJobDescriptionComparisonError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_COMPARISON_ERROR;
}

export class LoadCompareListSuccess implements Action {
  readonly type = LOAD_COMPARE_LIST_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadCompareList implements Action {
  readonly type = LOAD_COMPARE_LIST;
  constructor(public payload: any) { }
}

export class LoadCompareListError implements Action {
  readonly type = LOAD_COMPARE_LIST_ERROR;
}

export class SetSelectedSourceCompareListItem implements Action {
  readonly type = SET_SELECTED_SOURCE_COMPARE_LIST_ITEM;
  constructor(public payload: JobDescriptionWorkflowCompareListItem) { }
}

export class SetSelectedComparisonCompareListItem implements Action {
  readonly type = SET_SELECTED_COMPARISON_COMPARE_LIST_ITEM;
  constructor(public payload: JobDescriptionWorkflowCompareListItem) { }
}


export type Actions
  = LoadingJobDescriptionComparison
  | LoadJobDescriptionComparisonSuccess
  | LoadJobDescriptionComparisonError
  | LoadCompareListSuccess
  | SetSelectedSourceCompareListItem
  | SetSelectedComparisonCompareListItem
  | LoadCompareList
  | LoadCompareListError;
