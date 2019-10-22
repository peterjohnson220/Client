import { Action } from '@ngrx/store';
import { ViewField, DataViewConfig, DataViewEntityResponseWithCount, PagingOptions } from 'libs/models/payfactors-api';

export const LOAD_VIEW_CONFIG = '[PfDataGrid] Load View Config';
export const LOAD_VIEW_CONFIG_SUCCESS = '[PfDataGrid] Load View Config Success';
export const LOAD_DATA = '[PfDataGrid] Load Data';
export const LOAD_DATA_SUCCESS = '[PfDataGrid] Load Data Success';
export const UPDATE_FIELDS = '[PfDataGrid] Update Data Fields';
export const UPDATE_FIELDS_SUCCESS = '[PfDataGrid] Update Data Fields Success';
export const UPDATE_PAGING_OPTIONS = '[PfDataGrid] Update Paging Options';
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
    constructor(public pageViewId: string, public payload: DataViewEntityResponseWithCount) { }
}

export class UpdateFields implements Action {
    readonly type = UPDATE_FIELDS;
    constructor(public pageViewId: string, public fields: ViewField[]) { }
}

export class UpdateFieldsSuccess implements Action {
    readonly type = UPDATE_FIELDS_SUCCESS;
    constructor(public pageViewId: string) { }
}

export class UpdatePagingOptions implements Action {
    readonly type = UPDATE_PAGING_OPTIONS;
    constructor(public pageViewId: string, public pagingOptions: PagingOptions) { }
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
    | UpdatePagingOptions
    | HandleApiError;
