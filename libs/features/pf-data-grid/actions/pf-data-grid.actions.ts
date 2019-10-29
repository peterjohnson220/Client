import { Action } from '@ngrx/store';
import { ViewField, DataViewConfig, DataViewEntityResponseWithCount, PagingOptions, DataViewFilter } from 'libs/models/payfactors-api';

export const LOAD_VIEW_CONFIG = '[PfDataGrid] Load View Config';
export const LOAD_VIEW_CONFIG_SUCCESS = '[PfDataGrid] Load View Config Success';
export const LOAD_DATA = '[PfDataGrid] Load Data';
export const LOAD_DATA_SUCCESS = '[PfDataGrid] Load Data Success';
export const UPDATE_FIELDS = '[PfDataGrid] Update Data Fields';
export const UPDATE_FIELDS_SUCCESS = '[PfDataGrid] Update Data Fields Success';
export const UPDATE_PAGING_OPTIONS = '[PfDataGrid] Update Paging Options';
export const UPDATE_INBOUND_FILTERS = '[PfDataGrid] Update Inbound Filters';
export const UPDATE_FILTER = '[PfDataGrid] Update Filter';
export const CLEAR_FILTER = '[PfDataGrid] Clear Filter';
export const CLEAR_ALL_FILTERS = '[PfDataGrid] Clear All Filters';
export const TOGGLE_FILTER_PANEL = '[PfDataGrid] Toggle Filter Panel';
export const SET_FILTER_PANEL_DISPLAY = '[PfDataGrid] Set Filter Panel Display';
export const UPDATE_SELECTED_ROW_ID = '[PfDataGrid] Set Selected Row Id';
export const HANDLE_API_ERROR = '[PfDataGrid] Handle API Error';
export const CLEAR_LOADING = '[PfDataGrid] Clear Loading';

export class LoadViewConfig implements Action {
    readonly type = LOAD_VIEW_CONFIG;
    constructor(public pageViewId: string) { }
}

export class LoadViewConfigSuccess implements Action {
    readonly type = LOAD_VIEW_CONFIG_SUCCESS;
    constructor(public pageViewId: string, public payload: DataViewConfig) { }
}

export class UpdatePagingOptions implements Action {
  readonly type = UPDATE_PAGING_OPTIONS;
  constructor(public pageViewId: string, public pagingOptions: PagingOptions) { }
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

export class UpdateInboundFilters implements Action {
  readonly type = UPDATE_INBOUND_FILTERS;
  constructor(public pageViewId: string, public payload: DataViewFilter[]) { }
}

export class UpdateFilter implements Action {
  readonly type = UPDATE_FILTER;
  constructor(public pageViewId: string, public payload: DataViewFilter) { }
}

export class ClearFilter implements Action {
  readonly type = CLEAR_FILTER;
  constructor(public pageViewId: string, public payload: DataViewFilter) { }
}

export class ClearAllFilters implements Action {
  readonly type = CLEAR_ALL_FILTERS;
  constructor(public pageViewId: string) {}
}

export class ToggleFilterPanel implements Action {
  readonly type = TOGGLE_FILTER_PANEL;
  constructor(public pageViewId: string) {}
}

export class SetFilterPanelDisplay implements Action {
  readonly type = SET_FILTER_PANEL_DISPLAY;
  constructor(public pageViewId: string, public displayValue: boolean) {}
}

export class UpdateSelectedRowId implements Action {
  readonly type = UPDATE_SELECTED_ROW_ID;
  constructor(public pageViewId: string, public rowId: number, public fieldName: string) {}
}

export class ClearLoading implements Action {
  readonly type = CLEAR_LOADING;
  constructor(public pageViewId: string) { }
}

export class HandleApiError implements Action {
  readonly type = HANDLE_API_ERROR;
  constructor(public pageViewId: string, public payload: string) { }
}

export type DataGridActions =
    | LoadViewConfig
    | LoadViewConfigSuccess
    | UpdatePagingOptions
    | LoadData
    | LoadDataSuccess
    | UpdateFields
    | UpdateFieldsSuccess
    | UpdateInboundFilters
    | UpdateFilter
    | ClearFilter
    | ClearAllFilters
    | ToggleFilterPanel
    | SetFilterPanelDisplay
    | UpdateSelectedRowId
    | ClearLoading
    | HandleApiError;
