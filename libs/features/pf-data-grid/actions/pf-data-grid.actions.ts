import { Action } from '@ngrx/store';
import { ViewField, DataViewConfig, DataViewEntityResponseWithCount, PagingOptions, DataViewType } from 'libs/models/payfactors-api';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter } from '../models';
import { ColumnReorder } from '../models';

export const LOAD_VIEW_CONFIG = '[PfDataGrid] Load View Config';
export const LOAD_VIEW_CONFIG_SUCCESS = '[PfDataGrid] Load View Config Success';
export const LOAD_DATA = '[PfDataGrid] Load Data';
export const LOAD_DATA_SUCCESS = '[PfDataGrid] Load Data Success';
export const UPDATE_FIELDS = '[PfDataGrid] Update Data Fields';
export const UPDATE_FIELDS_SUCCESS = '[PfDataGrid] Update Data Fields Success';
export const UPDATE_SELECTION_FIELD = '[PfDataGrid] Update Selection Field';
export const UPDATE_PAGING_OPTIONS = '[PfDataGrid] Update Paging Options';
export const UPDATE_DEFAULT_SORT_DESCRIPTOR = '[PfDataGrid] Update Default Sort Descriptor';
export const UPDATE_SORT_DESCRIPTOR = '[PfDataGrid] Update Sort Descriptor';
export const UPDATE_SAVE_SORT = '[PfDataGrid] Update Save Sort';
export const UPDATE_APPLY_DEFAULT_FILTERS = '[PfDataGrid] Update Apply Default Filters';
export const UPDATE_APPLY_USER_DEFAULT_COMPENSATION_FIELDS = '[PfDataGrid] Update Apply User Default Compensation Fields';
export const UPDATE_INBOUND_FILTERS = '[PfDataGrid] Update Inbound Filters';
export const UPDATE_FILTER = '[PfDataGrid] Update Filter';
export const CLEAR_FILTER = '[PfDataGrid] Clear Filter';
export const CLEAR_ALL_NON_GLOBAL_FILTERS = '[PfDataGrid] Clear All Non Global Filters';
export const CLEAR_ALL_FILTERS = '[PfDataGrid] Clear All Filters';
export const TOGGLE_FILTER_PANEL = '[PfDataGrid] Toggle Filter Panel';
export const SET_FILTER_PANEL_DISPLAY = '[PfDataGrid] Set Filter Panel Display';
export const UPDATE_SELECTED_RECORD_ID = '[PfDataGrid] Update Selected Record Id';
export const EXPAND_ROW = '[PfDataGrid] Expand Row';
export const COLLAPSE_ROW = '[PfDataGrid] Collapse Row';
export const CLEAR_LOADING = '[PfDataGrid] Clear Loading';
export const DO_NOTHING = '[PfDataGrid] Do Nothing';
export const HANDLE_API_ERROR = '[PfDataGrid] Handle API Error';
export const LOAD_SAVED_VIEWS = '[PfDataGrid] Load Saved Views';
export const LOAD_SAVED_VIEWS_SUCCESS = '[PfDataGrid] Load Saved Views Success';
export const LOAD_SAVED_VIEWS_ERROR = '[PfDataGrid] Load Saved Views Error';
export const SAVE_VIEW = '[PfDataGrid] Save Filter';
export const SAVE_VIEW_SUCCESS = '[PfDataGrid] Save Filter Success';
export const SAVE_VIEW_ERROR = '[PfDataGrid] Save Filter Error';
export const OPEN_SAVE_VIEW_MODAL = '[PfDataGrid] Open Save View Modal';
export const CLOSE_SAVE_VIEW_MODAL = '[PfDataGrid] Close Save View Modal';
export const UPDATE_SELECTED_KEY = '[PfDataGrid] Update selected key';
export const SELECT_ALL = '[PfDataGrid] Select All';
export const CLEAR_SELECTIONS = '[PfDataGrid] Clear Selections';
export const HANDLE_SAVED_VIEW_CLICKED = '[PfDataGrid] Handle Saved View Clicked';
export const CLOSE_SPLIT_VIEW = '[PfDataGrid] Close Split View';
export const DELETE_SAVED_VIEW = '[PfDataGrid] Delete Saved View';
export const DELETE_SAVED_VIEW_SUCCESS = '[PfDataGrid] Delete Saved View Success';
export const PREPARE_VIEW_FOR_DELETE = '[PfDataGrid] Prepare View for Delete';
export const CANCEL_VIEW_DELETE = '[PfDataGrid] Cancel View Delete';
export const EXPORT_GRID = '[PfDataGrid] Export Grid';
export const EXPORT_GRID_SUCCESS = '[PfDataGrid] Export Grid Success';
export const EXPORT_GRID_ERROR = '[PfDataGrid] Export Grid Error';
export const EXPORTING_COMPLETE = '[PfDataGrid] Exporting Complete';
export const GET_EXPORTING_STATUS = '[PfDataGrid] Get Exporting Status';
export const GET_EXPORTING_STATUS_SUCCESS = '[PfDataGrid] Get Exporting Status Success';
export const GET_EXPORTING_STATUS_ERROR = '[PfDataGrid] Get Exporting Status Error';
export const RESET = '[PfDataGrid] Reset';
export const REORDER_COLUMNS = '[PfDataGrid] Reorder Columns';
export const REORDER_COLUMNS_SUCCESS = '[PfDataGrid] Reorder Columns Success';
export const UPDATE_ROW = '[PfDataGrid] Update Data Row';
export const UPDATE_FIELDS_EXCLUDED_FROM_EXPORT = '[PfDataGrid] Update Fields Excluded FromExport';
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

export class UpdateSaveSort implements Action {
  readonly type = UPDATE_SAVE_SORT;
  constructor(public pageViewId: string, public saveSort: boolean) { }
}

export class UpdateFieldsExcludedFromExport implements Action {
  readonly type = UPDATE_FIELDS_EXCLUDED_FROM_EXPORT;
  constructor(public pageViewId: string, public fieldsExcludedFromExport: []) { }
}

export class UpdateApplyDefaultFilters implements Action {
  readonly type = UPDATE_APPLY_DEFAULT_FILTERS;
  constructor(public pageViewId: string, public value: boolean) { }
}

export class UpdateApplyUserDefaultCompensationFields implements Action {
  readonly type = UPDATE_APPLY_USER_DEFAULT_COMPENSATION_FIELDS;
  constructor(public pageViewId: string, public value: boolean) {}
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

export class UpdateSelectionField implements Action {
  readonly type = UPDATE_SELECTION_FIELD;
  constructor(public pageViewId: string, public selectionField: string) { }
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
  constructor(public pageViewId: string, public field: ViewField, public resetOperator = false) { }
}

export class ClearAllNonGlobalFilters implements Action {
  readonly type = CLEAR_ALL_NON_GLOBAL_FILTERS;
  constructor(public pageViewId: string) { }
}

export class ClearAllFilters implements Action {
  readonly type = CLEAR_ALL_FILTERS;
  constructor(public pageViewId: string) { }
}

export class ToggleFilterPanel implements Action {
  readonly type = TOGGLE_FILTER_PANEL;
  constructor(public pageViewId: string) { }
}

export class SetFilterPanelDisplay implements Action {
  readonly type = SET_FILTER_PANEL_DISPLAY;
  constructor(public pageViewId: string, public displayValue: boolean) { }
}

export class UpdateSelectedRecordId implements Action {
  readonly type = UPDATE_SELECTED_RECORD_ID;
  constructor(public pageViewId: string, public recordId: number, public operator: string) { }
}

export class ExpandRow implements Action {
  readonly type = EXPAND_ROW;
  constructor(public pageViewId: string, public rowIndex: number) { }
}

export class CollapseRow implements Action {
  readonly type = COLLAPSE_ROW;
  constructor(public pageViewId: string, public rowIndex: number) { }
}

export class ClearLoading implements Action {
  readonly type = CLEAR_LOADING;
  constructor(public pageViewId: string) { }
}

export class DoNothing implements Action {
  readonly type = DO_NOTHING;
  constructor(public pageViewId: string) { }
}

export class HandleApiError implements Action {
  readonly type = HANDLE_API_ERROR;
  constructor(public pageViewId: string, public payload: string) { }
}

export class LoadSavedViews implements Action {
  readonly type = LOAD_SAVED_VIEWS;
  constructor(public pageViewId: string) { }
}

export class LoadSavedViewsSuccess implements Action {
  readonly type = LOAD_SAVED_VIEWS_SUCCESS;
  constructor(public pageViewId: string, public payload: DataViewConfig[]) { }
}

export class LoadSavedViewsError implements Action {
  readonly type = LOAD_SAVED_VIEWS_ERROR;
  constructor(public pageViewId: string, public payload: string) { }
}

export class SaveView implements Action {
  readonly type = SAVE_VIEW;
  constructor(public pageViewId: string, public viewName: string, public viewType: DataViewType) { }
}

export class SaveViewSuccess implements Action {
  readonly type = SAVE_VIEW_SUCCESS;
  constructor(public pageViewId: string, public payload: DataViewConfig, public viewType: DataViewType) { }
}

export class SaveViewError implements Action {
  readonly type = SAVE_VIEW_ERROR;
  constructor(public pageViewId: string, public payload: string) { }
}

export class OpenSaveViewModal implements Action {
  readonly type = OPEN_SAVE_VIEW_MODAL;
  constructor(public pageViewId: string) { }
}

export class CloseSaveViewModal implements Action {
  readonly type = CLOSE_SAVE_VIEW_MODAL;
  constructor(public pageViewId: string) { }
}

export class UpdateSelectedKey implements Action {
  readonly type = UPDATE_SELECTED_KEY;
  constructor(public pageViewId: string, public payload: number) { }
}

export class SelectAll implements Action {
  readonly type = SELECT_ALL;
  constructor(public pageViewId: string) { }
}

export class ClearSelections implements Action {
  readonly type = CLEAR_SELECTIONS;
  constructor(public pageViewId: string, public selectionsToClear?: number[]) { }
}

export class HandleSavedViewClicked implements Action {
  readonly type = HANDLE_SAVED_VIEW_CLICKED;
  constructor(public pageViewId: string, public viewName: string) { }
}

export class CloseSplitView implements Action {
  readonly type = CLOSE_SPLIT_VIEW;
  constructor(public pageViewId: string) { }
}

export class DeleteSavedView implements Action {
  readonly type = DELETE_SAVED_VIEW;
  constructor(public pageViewId: string, public viewName: string) { }
}

export class DeleteSavedViewSuccess implements Action {
  readonly type = DELETE_SAVED_VIEW_SUCCESS;
  constructor(public pageViewId: string) { }
}

export class PrepareViewForDelete implements Action {
  readonly type = PREPARE_VIEW_FOR_DELETE;
  constructor(public pageViewId: string, public viewName: string) { }
}

export class CancelViewDelete implements Action {
  readonly type = CANCEL_VIEW_DELETE;
  constructor(public pageViewId: string) { }
}

export class ExportGrid implements Action {
  readonly type = EXPORT_GRID;
  constructor(public pageViewId: string, public source: string) {}
}

export class ExportGridSuccess implements Action {
  readonly type = EXPORT_GRID_SUCCESS;
  constructor(public pageViewId: string, public exportEventId: any) {}
}

export class ExportGridError implements Action {
  readonly type = EXPORT_GRID_ERROR;
  constructor() {}
}

export class ExportingComplete implements Action {
  readonly type = EXPORTING_COMPLETE;

  constructor(public pageViewId: string) {}
}

export class GetExportingStatus implements Action {
  readonly type = GET_EXPORTING_STATUS;
  constructor(public pageViewId: string, public dataViewId: number) {}
}

export class GetExportingStatusSuccess implements Action {
  readonly type = GET_EXPORTING_STATUS_SUCCESS;
  constructor(public pageViewId: string, public payload: any) {}
}

export class GetExportingStatusError implements Action {
  readonly type = GET_EXPORTING_STATUS_ERROR;
  constructor(public pageViewId: string) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export class ReorderColumns implements Action {
  readonly type = REORDER_COLUMNS;

  constructor(public pageViewId: string, public payload: ColumnReorder) {}
}

export class ReorderColumnsSuccess {
  readonly type = REORDER_COLUMNS_SUCCESS;

  constructor() {}
}

export class UpdateRow {
  readonly type = UPDATE_ROW;

  constructor(public pageViewId: string, public rowIndex: number, public data: any, public fieldNames?: any[]) {}
}

export type DataGridActions =
  | LoadViewConfig
  | LoadViewConfigSuccess
  | UpdatePagingOptions
  | UpdateDefaultSortDescriptor
  | UpdateSortDescriptor
  | UpdateSaveSort
  | UpdateApplyDefaultFilters
  | UpdateApplyUserDefaultCompensationFields
  | LoadData
  | LoadDataSuccess
  | UpdateFields
  | UpdateFieldsSuccess
  | UpdateSelectionField
  | UpdateInboundFilters
  | UpdateFilter
  | ClearFilter
  | ClearAllNonGlobalFilters
  | ClearAllFilters
  | ToggleFilterPanel
  | SetFilterPanelDisplay
  | UpdateSelectedKey
  | UpdateSelectedRecordId
  | ExpandRow
  | CollapseRow
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
  | SelectAll
  | ClearSelections
  | HandleSavedViewClicked
  | CloseSplitView
  | DeleteSavedView
  | DeleteSavedViewSuccess
  | PrepareViewForDelete
  | CancelViewDelete
  | ExportGrid
  | ExportGridSuccess
  | ExportGridError
  | ExportingComplete
  | GetExportingStatus
  | GetExportingStatusSuccess
  | GetExportingStatusError
  | Reset
  | ReorderColumns
  | ReorderColumnsSuccess
  | UpdateFieldsExcludedFromExport
  | UpdateRow;
