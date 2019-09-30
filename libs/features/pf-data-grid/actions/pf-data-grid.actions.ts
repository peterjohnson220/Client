import { Action } from '@ngrx/store';
import { ViewField, DataViewConfig } from 'libs/models/payfactors-api';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_VIEW_CONFIG = '[PfDataGrid] Load View Config';
export const LOAD_VIEW_CONFIG_SUCCESS = '[PfDataGrid] Load View Config Success';
export const LOAD_DATA = '[PfDataGrid] Load Data';
export const LOAD_DATA_SUCCESS = '[PfDataGrid] Load Data Success';
export const UPDATE_FIELDS = '[PfDataGrid] Update Data Fields';
export const UPDATE_FIELDS_SUCCESS = '[PfDataGrid] Update Data Fields Success';
export const UPDATE_TOTAL_COUNT = '[PfDataGrid] Update Total Count';
export const UPDATE_PAGE_SIZE = '[PfDataGrid] Update Page Size';
export const UPDATE_SKIP = '[PfDataGrid] Update Skip';
export const HANDLE_API_ERROR = '[PfDataGrid] Handle API Error';

export class LoadViewConfig implements Action {
    readonly type = LOAD_VIEW_CONFIG;
    constructor(public pageViewId: string) { }
}

export class LoadViewConfigSuccess implements Action {
    readonly type = LOAD_VIEW_CONFIG_SUCCESS;
    constructor(public pageViewId: string, public payload: DataViewConfig) { }
}

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor(public pageViewId: string) { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public pageViewId: string, public payload: any[]) { }
}

export class UpdateFields implements Action {
    readonly type = UPDATE_FIELDS;
    constructor(public pageViewId: string, public fields: ViewField[]) { }
}

export class UpdateFieldsSuccess implements Action {
    readonly type = UPDATE_FIELDS_SUCCESS;
    constructor(public pageViewId: string) { }
}

export class UpdateTotalCount implements Action {
    readonly type = UPDATE_TOTAL_COUNT;
    constructor(public pageViewId: string, public totalCount: number) { }
}

export class UpdatePageSize implements Action {
    readonly type = UPDATE_PAGE_SIZE;
    constructor(public pageViewId: string, public pageSize: number) { }
}

export class UpdateSkip implements Action {
    readonly type = UPDATE_SKIP;
    constructor(public pageViewId: string, public skip: number) { }
}

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public pageViewId: string, public payload: string) { }
}

export type DataGridActions =
    | LoadViewConfig
    | LoadViewConfigSuccess
    | LoadData
    | LoadDataSuccess
    | UpdateFields
    | UpdateFieldsSuccess
    | UpdateTotalCount
    | UpdatePageSize
    | UpdateSkip
    | HandleApiError;
