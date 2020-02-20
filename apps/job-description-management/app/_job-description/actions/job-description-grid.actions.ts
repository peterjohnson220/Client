import { Action } from '@ngrx/store';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State as KendoState } from '@progress/kendo-data-query';

import { GetListAreaColumnsRequest, SaveListAreaColumnsRequest } from 'libs/models/payfactors-api/user-profile/request';
import { ListAreaColumn } from 'libs/models/common';
import { QueryListStateRequest } from 'libs/models/payfactors-api/job-description/request/query-liststate-request.model';

export const LOAD_JOB_DESCRIPTION_GRID = '[job-description-management / Job Description Grid] Load Job Description Grid';
export const LOAD_JOB_DESCRIPTION_GRID_ERROR = '[job-description-management / Job Description Grid] Load Job Description Grid Error';
export const LOAD_JOB_DESCRIPTION_GRID_SUCCESS = '[job-description-management / Job Description Grid] Load Job Description Grid Success';
export const LOAD_LIST_AREA_COLUMNS = '[job-description-management / Job Description Grid] Load List Area Columns';
export const LOAD_LIST_AREA_COLUMNS_ERROR = '[job-description-management / Job Description Grid] Load List Area Columns Error';
export const LOAD_LIST_AREA_COLUMNS_SUCCESS = '[job-description-management / Job Description Grid] Load List Area Columns Success';
export const SAVE_LIST_AREA_COLUMNS = '[job-description-management / Job Description Grid] Save List Area Columns';
export const SAVE_LIST_AREA_COLUMNS_ERROR = '[job-description-management / Job Description Grid] Save List Area Columns Error';
export const SAVE_LIST_AREA_COLUMNS_SUCCESS = '[job-description-management / Job Description Grid] Save List Area Columns Success';
export const UPDATE_GRID_STATE = '[job-description-management / Job Description Grid] Update Grid State';
export const UPDATE_LIST_AREA_COLUMN = '[job-description-management / Job Description Grid] Update List Area Column';
export const UPDATE_SEARCH_TERM = '[job-description-management / Job Description Grid] Update Search Term';
export const UPDATE_PUBLIC_VIEW = '[job-description-management / Job Description Grid] Update Public View';
export const UPDATE_PUBLIC_VIEW_SUCCESS = '[job-description-management / Job Description Grid] Update Public View Success';
export const UPDATE_PUBLIC_VIEW_ERROR = '[job-description-management / Job Description Grid] Update Public View Error';
export const LOAD_PUBLIC_JDM_COLUMNS = '[job-description-management / Job Description Grid] Load Public JDM Columns';
export const LOAD_PUBLIC_JDM_COLUMNS_ERROR = '[job-description-management / Job Description Grid] Load Public JDM Columns Error';
export const LOAD_PUBLIC_JDM_COLUMNS_SUCCESS = '[job-description-management / Job Description Grid] Load Public JDM Columns Success';


export class LoadJobDescriptionGrid implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_GRID;

  constructor(public payload: QueryListStateRequest) {}
}

export class LoadJobDescriptionGridError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_GRID_ERROR;
}

export class LoadJobDescriptionGridSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_GRID_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadListAreaColumns implements Action {
  readonly type = LOAD_LIST_AREA_COLUMNS;

  constructor(public payload: GetListAreaColumnsRequest) {}
}

export class LoadListAreaColumnsError implements Action {
  readonly type = LOAD_LIST_AREA_COLUMNS_ERROR;
}

export class LoadListAreaColumnsSuccess implements Action {
  readonly type = LOAD_LIST_AREA_COLUMNS_SUCCESS;

  constructor(public payload: ListAreaColumn[]) {}
}

export class SaveListAreaColumns implements Action {
  readonly type = SAVE_LIST_AREA_COLUMNS;

  constructor(public payload: SaveListAreaColumnsRequest) {}
}

export class SaveListAreaColumnsError implements Action {
  readonly type = SAVE_LIST_AREA_COLUMNS_ERROR;
}

export class SaveListAreaColumnsSuccess implements Action {
  readonly type = SAVE_LIST_AREA_COLUMNS_SUCCESS;

  constructor(public payload: { ListAreaColumns: ListAreaColumn[] }) {}
}

export class UpdateGridState implements Action {
  readonly type = UPDATE_GRID_STATE;

  constructor(public payload: KendoState) {}
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;

  constructor(public payload: string) {}
}

export class UpdatePublicView implements Action {
  readonly type = UPDATE_PUBLIC_VIEW;

  constructor(public payload) {}
}

export class UpdatePublicViewSuccess implements Action {
  readonly type = UPDATE_PUBLIC_VIEW_SUCCESS;

  constructor(public payload) {}
}

export class UpdatePublicViewError implements Action {
  readonly type = UPDATE_PUBLIC_VIEW_ERROR;
}

export class LoadPublicJdmColumns implements Action {
  readonly type = LOAD_PUBLIC_JDM_COLUMNS;

  constructor(public payload: number) {}
}

export class LoadPublicJdmColumnsError implements Action {
  readonly type = LOAD_PUBLIC_JDM_COLUMNS_ERROR;
}

export class LoadPublicJdmColumnsSuccess implements Action {
  readonly type = LOAD_PUBLIC_JDM_COLUMNS_SUCCESS;

  constructor(public payload: ListAreaColumn[]) {}
}

export type Actions
  = LoadJobDescriptionGrid
  | LoadJobDescriptionGridError
  | LoadJobDescriptionGridSuccess
  | LoadListAreaColumns
  | LoadListAreaColumnsError
  | LoadListAreaColumnsSuccess
  | SaveListAreaColumns
  | SaveListAreaColumnsError
  | SaveListAreaColumnsSuccess
  | UpdateGridState
  | UpdateSearchTerm
  | UpdatePublicView
  | UpdatePublicViewSuccess
  | UpdatePublicViewError
  | LoadPublicJdmColumns
  | LoadPublicJdmColumnsError
  | LoadPublicJdmColumnsSuccess;
