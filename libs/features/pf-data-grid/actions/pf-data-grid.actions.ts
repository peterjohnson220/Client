import { Action } from '@ngrx/store';
import { PfDataGridFieldModel } from 'libs/models';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {PfGridFieldFilter} from '../../../models/common/pf-data-grid';

export const INIT_GRID = '[PfDataGrid] Init Grid';
export const LOAD_FIELDS = '[PfDataGrid] Load Fields';
export const LOAD_FIELDS_SUCCESS = '[PfDataGrid] Load Fields Success';
export const LOAD_DATA = '[PfDataGrid] Load Data';
export const LOAD_DATA_SUCCESS = '[PfDataGrid] Load Data Success';
export const UPDATE_FIELDS = '[PfDataGrid] Update Data Fields';
export const HANDLE_API_ERROR = '[PfDataGrid] Handle API Error';
export const UPDATE_FILTER = '[PfDataGrid] Update Filter'
export const CLEAR_FILTER = '[PfDataGrid] Clear Filter';
export const CLEAR_ALL_FILTERS = '[PfDataGrid] Clear All Filters';

export class InitGrid implements Action {
    readonly type = INIT_GRID;
    constructor(public entity: string) { }
}

export class LoadFields implements Action {
    readonly type = LOAD_FIELDS;
    constructor(public entity: string) { }
}

export class LoadFieldsSuccess implements Action {
    readonly type = LOAD_FIELDS_SUCCESS;
    constructor(public entity: string, public payload: PfDataGridFieldModel[]) { }
}

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor(public entity: string) { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public entity: string, public payload: GridDataResult) { }
}

export class UpdateFields implements Action {
    readonly type = UPDATE_FIELDS;
    constructor(public entity: string, public fields: PfDataGridFieldModel[]) { }
}

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public payload: string) { }
}

export class UpdateFilter implements Action {
  readonly type = UPDATE_FILTER;
  constructor(public entity: string, public payload: PfGridFieldFilter) { }
}

export class ClearFilter implements Action {
  readonly type = CLEAR_FILTER;
  constructor(public entity: string, public payload: PfGridFieldFilter) { }
}

export class ClearAllFilters implements Action {
  readonly type = CLEAR_ALL_FILTERS;
  constructor(public entity: string) {}
}

export type DataGridActions =
    | InitGrid
    | LoadFields
    | LoadFieldsSuccess
    | LoadData
    | LoadDataSuccess
    | UpdateFields
    | HandleApiError
    | UpdateFilter
    | ClearFilter
    | ClearAllFilters;
