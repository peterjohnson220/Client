import { Action } from '@ngrx/store';
import { ViewField, DataViewConfig, DataViewEntityResponseWithCount, PagingOptions } from 'libs/models/payfactors-api';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter } from '../models';

export const LOAD_VIEW_CONFIG = '[PfDataGrid] Load View Config';
export const LOAD_VIEW_CONFIG_SUCCESS = '[PfDataGrid] Load View Config Success';
export const LOAD_DATA = '[PfDataGrid] Load Data';
export const LOAD_DATA_SUCCESS = '[PfDataGrid] Load Data Success';
export const UPDATE_FIELDS = '[PfDataGrid] Update Data Fields';
export const UPDATE_FIELDS_SUCCESS = '[PfDataGrid] Update Data Fields Success';
export const UPDATE_PAGING_OPTIONS = '[PfDataGrid] Update Paging Options';
export const UPDATE_DEFAULT_SORT_DESCRIPTOR = '[PfDataGrid] Update Default Sort Descriptor';
export const UPDATE_SORT_DESCRIPTOR = '[PfDataGrid] Update Sort Descriptor';
export const UPDATE_INBOUND_FILTERS = '[PfDataGrid] Update Inbound Filters';
export const UPDATE_FILTER = '[PfDataGrid] Update Filter';
export const CLEAR_FILTER = '[PfDataGrid] Clear Filter';
export const CLEAR_ALL_FILTERS = '[PfDataGrid] Clear All Filters';
export const TOGGLE_FILTER_PANEL = '[PfDataGrid] Toggle Filter Panel';
export const SET_FILTER_PANEL_DISPLAY = '[PfDataGrid] Set Filter Panel Display';
export const UPDATE_SELECTED_ROW_ID = '[PfDataGrid] Set Selected Row Id';
export const CLEAR_LOADING = '[PfDataGrid] Clear Loading';
export const HANDLE_API_ERROR = '[PfDataGrid] Handle API Error';
export const LOAD_SAVED_VIEWS = '[PfDataGrid] Load Saved Views';
export const LOAD_SAVED_VIEWS_SUCCESS = '[PfDataGrid] Load Saved Views Success';
export const LOAD_SAVED_VIEWS_ERROR = '[PfDataGrid] Load Saved Views Error';
export const SAVE_VIEW = '[PfDataGrid] Save Filter';
export const SAVE_VIEW_SUCCESS = '[PfDataGrid] Save Filter Success';
export const SAVE_VIEW_ERROR = '[PfDataGrid] Save Filter Error';
export const OPEN_SAVE_VIEW_MODAL = '[PfDataGrid] Open Save View Modal';
export const CLOSE_SAVE_VIEW_MODAL = '[PfDataGrid] Close Save View Modal';
export const UPDATE_SELECTED_KEY =  '[PfDataGrid] Update selected key';
export const SELECT_ALL =  '[PfDataGrid] Select All';

export class LoadViewConfig implements Action {
    readonly type = LOAD_VIEW_CONFIG;
    constructor(public pageViewId: string, public name: string = null) { }
}

export class LoadViewConfigSuccess implements Action {
    readonly type = LOAD_VIEW_CONFIG_SUCCESS;
    constructor(public pageViewId: string, public payload: DataViewConfig) { }
}

export class UpdatePagingOptions implements Action {
  readonly type = UPDATE_PAGING_OPTIONS;
  constructor(public pageViewId: string, public pagingOptions: PagingOptions) { }
}

export class UpdateDefaultSortDescriptor implements Action {
  readonly type = UPDATE_DEFAULT_SORT_DESCRIPTOR;
  constructor(public pageViewId: string, public sortDescriptor: SortDescriptor[]) { }
}

export class UpdateSortDescriptor implements Action {
  readonly type = UPDATE_SORT_DESCRIPTOR;
  constructor(public pageViewId: string, public sortDescriptor: SortDescriptor[]) { }
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
  constructor(public pageViewId: string, public payload: PfDataGridFilter[]) { }
}

export class UpdateFilter implements Action {
  readonly type = UPDATE_FILTER;
  constructor(public pageViewId: string, public payload: ViewField) { }
}

export class ClearFilter implements Action {
  readonly type = CLEAR_FILTER;
  constructor(public pageViewId: string, public payload: ViewField) { }
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

export class LoadSavedViews implements Action {
  readonly type = LOAD_SAVED_VIEWS;
  constructor(public pageViewId: string) {}
}

export class LoadSavedViewsSuccess implements Action {
  readonly type = LOAD_SAVED_VIEWS_SUCCESS;
  constructor(public pageViewId: string, public payload: DataViewConfig[]) {}
}

export class LoadSavedViewsError implements Action {
  readonly type = LOAD_SAVED_VIEWS_ERROR;
  constructor(public pageViewId: string, public payload: string) {}
}

export class SaveView implements Action {
  readonly type = SAVE_VIEW;
  constructor(public pageViewId: string, public viewName: string) {}
}

export class SaveViewSuccess implements Action {
  readonly type = SAVE_VIEW_SUCCESS;
  constructor(public pageViewId: string, public payload: DataViewConfig) {}
}

export class SaveViewError implements Action {
  readonly type = SAVE_VIEW_ERROR;
  constructor(public pageViewId: string, public payload: string) {}
}

export class OpenSaveViewModal implements Action {
  readonly type = OPEN_SAVE_VIEW_MODAL;
  constructor(public pageViewId: string) {}
}

export class CloseSaveViewModal implements Action {
  readonly type = CLOSE_SAVE_VIEW_MODAL;
  constructor(public pageViewId: string) {}
}

export class  UpdateSelectedKey implements  Action {
  readonly  type = UPDATE_SELECTED_KEY;
  constructor(public pageViewId: string, public payload: number) { }
}

export class  SelectAll implements  Action {
  readonly  type = SELECT_ALL;
  constructor(public pageViewId: string, public primaryKey: string) { }
}

export type DataGridActions =
    | LoadViewConfig
    | LoadViewConfigSuccess
    | UpdatePagingOptions
    | UpdateDefaultSortDescriptor
    | UpdateSortDescriptor
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
    | UpdateSelectedKey
    | UpdateSelectedRowId
    | ClearLoading
    | HandleApiError
    | LoadSavedViews
    | LoadSavedViewsSuccess
    | LoadSavedViewsError
    | SaveView
    | SaveViewSuccess
    | SaveViewError
    | OpenSaveViewModal
    | CloseSaveViewModal
    | SelectAll;
