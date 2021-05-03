import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import isNumber from 'lodash/isNumber';
import concat from 'lodash/concat';

import { ContentScrollEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { groupBy, GroupResult, SortDescriptor } from '@progress/kendo-data-query';

import { arrayMoveMutate, arraySortByString, SortDirection } from 'libs/core/functions';
import { DataViewConfig, DataViewEntity, DataViewType, PagingOptions, SimpleDataView, ViewField } from 'libs/models/payfactors-api';
import { Between } from 'libs/ui/formula-editor/models';

import * as fromPfGridActions from '../actions';
import { PfDataGridFilter, GridConfig, ColumnReorder, PfDataGridCustomFilterOptions } from '../models';
import { getDefaultFilterOperator, getSimpleDataViewDescription, getUserFilteredFields } from '../components';

export interface DataGridState {
  pageViewId: string;
  loading: boolean;
  baseEntity: DataViewEntity;
  selectionField: string;
  linkGroups: [];
  selectionFieldExistsOnBase: boolean;
  fields: ViewField[];
  groupedFields: any[];
  inboundFilters: PfDataGridFilter[];
  splitViewFilters: PfDataGridFilter[];
  filterPanelOpen: boolean;
  pagingOptions: PagingOptions;
  applyDefaultFilters: boolean;
  applyUserDefaultCompensationFields: boolean;
  useReportingDB: boolean;
  defaultSortDescriptor: SortDescriptor[];
  sortDescriptor: SortDescriptor[];
  saveSort: boolean;
  preserveSelectionsOnGetConfig: boolean;
  data: GridDataResult;
  selectedRecordId: number;
  selectedRow: any;
  // The Kendo grid does not provide api access to know which rows are expanded
  // We need to keep track of the expandedRows separately from the Kendo Grid to in order to trigger collapse of a row by clicking on it
  expandedRows: number[];
  saveViewModalOpen: boolean;
  savedViews: SimpleDataView[];
  viewIsSaving: boolean;
  viewIsDeleting: boolean;
  selectedKeys: any[];
  selectedData: any[];
  selectAllState: string;
  exportEventId: number;
  exportingGrid: boolean;
  exportViewId: number;
  loadingExportingStatus: boolean;
  fieldsExcludedFromExport: [];
  gridConfig: GridConfig;
  modifiedKeys: any[];
  gridScrolledContent: ContentScrollEvent;
  hasMoreDataOnServer: boolean;
  loadingMoreData: boolean;
  totalCount: number;
  lastUpdateFieldsDate: Date;
  visibleKeys: number[];
  unexpectedError: boolean;
  fadeInKeys: any[];
  fieldsWithCustomFilterTemplates: string[];
  customFilterOptions: PfDataGridCustomFilterOptions[];
}

export interface DataGridStoreState {
  grids: { [key: string]: DataGridState };
}

const INITIAL_STATE: DataGridStoreState = {
  grids: {}
};

export const DEFAULT_PAGING_OPTIONS: PagingOptions = {
  From: 0,
  Count: 40
};

export enum SelectAllStatus {
  checked = 'checked',
  unchecked = 'unchecked',
  indeterminate = 'indeterminate',
}


export const getState = (state: DataGridStoreState) => state;
export const getGrid = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId];
export const getLoading = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].loading : null;
export const getBaseEntity = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].baseEntity : null;
export const getLinkGroups = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].linkGroups : null;
export const getSelectionField = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectionField : null;
export const getFieldsExcludedForExport = (state: DataGridStoreState, pageViewId: string) =>
  state.grids[pageViewId] ? state.grids[pageViewId].fieldsExcludedFromExport : [];
export const getPrimaryKey = (state: DataGridStoreState, pageViewId: string) => {
  if (state.grids[pageViewId] && state.grids[pageViewId].baseEntity) {
    return state.grids[pageViewId].selectionFieldExistsOnBase ?
      `${state.grids[pageViewId].baseEntity.SourceName}_${state.grids[pageViewId].selectionField}` :
      state.grids[pageViewId].selectionField;
  } else {
    return '';
  }
};
export const getFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId]
  ? state.grids[pageViewId].fields : null;
export const getVisibleOrderedFields = (state: DataGridStoreState, pageViewId: string) => {
  if (!!state.grids[pageViewId] && !!state.grids[pageViewId].fields) {
    return state.grids[pageViewId]
      ? orderBy(state.grids[pageViewId].fields.filter(f => f.IsSelectable && f.IsSelected), 'Order')
      : null;
  }
};
export const getSelectableFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].fields
  ? state.grids[pageViewId].fields.filter(f => f.IsSelectable) : null;
export const getGroupedFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].groupedFields : null;
export const getGlobalFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] && state.grids[pageViewId].fields ? state.grids[pageViewId].fields.filter(f => f.IsGlobalFilter) : null;
};
export const getFilterableFields = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] && state.grids[pageViewId].fields
    ? state.grids[pageViewId].fields.filter(f => !f.IsGlobalFilter && f.IsFilterable && (f.IsSelected || f.CustomFilterStrategy || f.IsAlwaysInResponse))
    : [];
};
export const getPagingOptions = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] && state.grids[pageViewId].pagingOptions ? state.grids[pageViewId].pagingOptions : null;
};
export const getDefaultSortDescriptor = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].defaultSortDescriptor : null;
};
export const getSortDescriptor = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].sortDescriptor : null;
export const getSaveSort = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].saveSort : null;
export const getPreserveSelectionsOnGetConfig = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId]
  ? state.grids[pageViewId].preserveSelectionsOnGetConfig : null;
export const getData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].data : null;
export const getApplyDefaultFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].applyDefaultFilters : null;
};
export const getApplyUserDefaultCompensationFields = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].applyUserDefaultCompensationFields : null;
};
export const getUseReportingDB = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].useReportingDB : null;
};
export const getInboundFilters = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].inboundFilters : [];
export const getFilterPanelDisplay = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].filterPanelOpen;
export const getSelectedRecordId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedRecordId : null;
export const getSelectedRow = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedRow : null;
export const getExpandedRows = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].expandedRows : null;
export const getSplitViewFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].splitViewFilters : null;
};
export const getSavedViews = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].savedViews;
export const getSaveViewModalOpen = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].saveViewModalOpen;
export const getViewIsSaving = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewIsSaving;
export const getSelectedKeys = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedKeys : null;
export const getSelectedData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedData : null;
export const getSelectAllState = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].selectAllState;
export const getViewIsDeleting = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewIsDeleting;
export const getExportEventId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].exportEventId;
export const getExportingGrid = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].exportingGrid;
export const getExportViewId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].exportViewId;
export const getLoadingExportingStatus = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].loadingExportingStatus;
export const getFieldsFilterCount = (state: DataGridStoreState, pageViewId: string) => {
  let filterCount = 0;
  if (!!state.grids[pageViewId] && !!state.grids[pageViewId].fields) {
    state.grids[pageViewId].fields.forEach(f => {
      if (!!f.FilterValues) {
        filterCount++;
      }
    });
  }
  return filterCount;
};
export const getGridConfig = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].gridConfig : null;
export const getFilterPanelOpen = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].filterPanelOpen : null;
export const getModifiedKeys = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].modifiedKeys : null;
export const getGridScrolledContent = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].gridScrolledContent;
export const getTotalCount = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].totalCount;
export const getHasMoreDataOnServer = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].hasMoreDataOnServer;
export const getLoadingMoreData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].loadingMoreData;
export const getLastUpdateFieldsDate = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].lastUpdateFieldsDate;
export const getVisibleKeys = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].visibleKeys;
export const getUnexpectedError = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].unexpectedError;
export const getFadeInKeys = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].fadeInKeys : null;

export function reducer(state = INITIAL_STATE, action: fromPfGridActions.DataGridActions): DataGridStoreState {
  switch (action.type) {
    case fromPfGridActions.LOAD_VIEW_CONFIG:
      const gridState = state.grids[action.pageViewId];
      const pagingOptions = gridState && gridState.pagingOptions
        ? { From: 0, Count: gridState.pagingOptions.Count }
        : DEFAULT_PAGING_OPTIONS;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            pageViewId: action.pageViewId,
            loading: true,
            pagingOptions: pagingOptions,
            expandedRows: [],
            selectAllState: SelectAllStatus.unchecked,
            data: null,
            applyDefaultFilters: state.grids[action.pageViewId] ? state.grids[action.pageViewId].applyDefaultFilters : true,
            saveSort: state.grids[action.pageViewId] ? state.grids[action.pageViewId].saveSort : false,
            splitViewFilters: [],
            selectedKeys:
              (state.grids[action.pageViewId] && state.grids[action.pageViewId].preserveSelectionsOnGetConfig && state.grids[action.pageViewId].selectedKeys)
                ? state.grids[action.pageViewId].selectedKeys
                : []
          }
        }
      };
    case fromPfGridActions.LOAD_VIEW_CONFIG_SUCCESS:
      const payload: DataViewConfig = cloneDeep(action.payload);
      if (payload && payload.Fields) {
        payload.Fields.forEach(v => {
          v.DisplayName = !!v.Group ? v.DisplayName.replace(`${v.Group} `, '') : v.DisplayName;
        });
      }
      const currSplitViewFilters = payload && payload.Fields ?
        payload.Fields.filter(f => isFilter(f))
          .map(f => buildExternalFilter(f.FilterOperator, f.SourceName, f.FilterValues)) : [];
      const sorts = findSortDescriptor(payload.Fields);
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: updateFieldsWithFilters(payload.Fields, state.grids[action.pageViewId].inboundFilters),
            groupedFields: buildGroupedFields(resetFilters(payload.Fields)),
            baseEntity: payload.Entity,
            loading: false,
            splitViewFilters: currSplitViewFilters,
            exportViewId: payload.ExportViewId,
            sortDescriptor: sorts.length ? sorts : state.grids[action.pageViewId].defaultSortDescriptor
          }
        }
      };
    case fromPfGridActions.LOAD_DATA:
    case fromPfGridActions.RELOAD_DATA:

      const currentGridPagingOptions = cloneDeep(state.grids[action.pageViewId]?.pagingOptions);

      const newPagingOptions = currentGridPagingOptions && !state.grids[action.pageViewId]?.gridConfig?.EnableInfiniteScroll
        ? currentGridPagingOptions
        : DEFAULT_PAGING_OPTIONS;

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loading: true,
            pagingOptions: newPagingOptions
          }
        }
      };
    case fromPfGridActions.LOAD_DATA_SUCCESS:
    case fromPfGridActions.RELOAD_DATA_SUCCESS:
      const loadDataVisibleFieldsIds = getVisibleFieldsIds(state, action.pageViewId, action.payload.Data);

      const selectedVisibleFields = loadDataVisibleFieldsIds.filter(k => state.grids[action.pageViewId].selectedKeys.includes(k));
      const loadDataSelectAllState =
        selectedVisibleFields.length === 0 ? SelectAllStatus.unchecked :
          selectedVisibleFields.length === loadDataVisibleFieldsIds.length ? SelectAllStatus.checked :
            SelectAllStatus.indeterminate;

      const loadDataVisibleKeys = uniq(loadDataVisibleFieldsIds);

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            data: {
              data: action.payload.Data,
              total: action.payload.TotalCount
            },
            totalCount: action.payload.TotalCount,
            loading: false,
            selectAllState: loadDataSelectAllState,
            hasMoreDataOnServer: action.payload.Data.length < action.payload.TotalCount,
            visibleKeys: loadDataVisibleKeys
          }
        }
      };
    case fromPfGridActions.LOAD_MORE_DATA:
      const gridPagingOptions = cloneDeep(state.grids[action.pageViewId].pagingOptions);
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loading: true,
            loadingMoreData: true,
            pagingOptions: { From: gridPagingOptions.From + gridPagingOptions.Count, Count: gridPagingOptions.Count }
          }
        }
      };
    case fromPfGridActions.LOAD_MORE_DATA_SUCCESS:
      const gridDataClone: GridDataResult = cloneDeep(state.grids[action.pageViewId].data);
      gridDataClone.data = gridDataClone.data.concat(action.payload.Data);

      const currentSelectAllState = state.grids[action.pageViewId].selectAllState;
      const loadMoreDataSelectAllState = currentSelectAllState === SelectAllStatus.checked
        ? SelectAllStatus.indeterminate
        : currentSelectAllState === SelectAllStatus.indeterminate ? SelectAllStatus.indeterminate : SelectAllStatus.unchecked;

      const loadMoreDataVisibleKeys = uniq(getVisibleFieldsIds(state, action.pageViewId, gridDataClone.data));

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            data: gridDataClone,
            loading: false,
            loadingMoreData: false,
            hasMoreDataOnServer: gridDataClone.data.length < state.grids[action.pageViewId].totalCount,
            selectAllState: loadMoreDataSelectAllState,
            visibleKeys: loadMoreDataVisibleKeys
          }
        }
      };
    case fromPfGridActions.UPDATE_FIELDS:
      // Remove the sort descriptors for columns which are no longer in the visible columns list
      let sortDescriptor = state.grids[action.pageViewId].sortDescriptor;
      if (sortDescriptor) {
        sortDescriptor = sortDescriptor.filter(s => action.fields.find(f => f.IsSelected && `${f.EntitySourceName}_${f.SourceName}` === s.field));
        sortDescriptor = sortDescriptor.length ? sortDescriptor : state.grids[action.pageViewId].defaultSortDescriptor;
      }

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: action.fields,
            groupedFields: buildGroupedFields(action.fields),
            selectedRecordId: null,
            selectedRow: null,
            expandedRows: [],
            sortDescriptor: sortDescriptor,
            viewIsSaving: true
          }
        }
      };
    case fromPfGridActions.UPDATE_FIELDS_SUCCESS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            lastUpdateFieldsDate: new Date(),
            viewIsSaving: false
          }
        }
      };
    case fromPfGridActions.UPDATE_SELECTION_FIELD:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectionField: action.selectionField,
            selectionFieldExistsOnBase: action.existsOnBase
          }
        }
      };
    case fromPfGridActions.UPDATE_LINK_GROUPS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            linkGroups: action.linkGroups
          }
        }
      };
    case fromPfGridActions.UPDATE_PAGING_OPTIONS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            pagingOptions: action.pagingOptions,
            expandedRows: [],
            loading: true
          },
        }
      };
    case fromPfGridActions.UPDATE_DEFAULT_SORT_DESCRIPTOR:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            defaultSortDescriptor: action.sortDescriptor,
            sortDescriptor: action.sortDescriptor,
            loading: true
          },
        }
      };
    case fromPfGridActions.UPDATE_SORT_DESCRIPTOR_NO_DATA_RETRIEVAL:
    case fromPfGridActions.UPDATE_SORT_DESCRIPTOR:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            sortDescriptor: action.sortDescriptor,
            loading: action.type === fromPfGridActions.UPDATE_SORT_DESCRIPTOR
          },
        }
      };
    case fromPfGridActions.UPDATE_SAVE_SORT:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            saveSort: action.saveSort,
          },
        }
      };
    case fromPfGridActions.UPDATE_FIELDS_EXCLUDED_FROM_EXPORT:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fieldsExcludedFromExport: action.fieldsExcludedFromExport,
          },
        }
      };
    case fromPfGridActions.UPDATE_PRESERVE_SELECTIONS_ON_GET_CONFIG:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            preserveSelectionsOnGetConfig: action.preserveSelectionsOnGetConfig,
          },
        }
      };
    case fromPfGridActions.UPDATE_APPLY_DEFAULT_FILTERS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            applyDefaultFilters: action.value,
          },
        }
      };
    case fromPfGridActions.UPDATE_APPLY_USER_DEFAULT_COMPENSATION_FIELDS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            applyUserDefaultCompensationFields: action.value,
          },
        }
      };
    case fromPfGridActions.UPDATE_USE_REPORTING_DB:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            useReportingDB: action.value,
          },
        }
      };
    /*
    This action resets all filters prior to applying inbound filters to clear global text box search elements on tab switch/grid change
     */
    case fromPfGridActions.UPDATE_INBOUND_FILTERS:
      let filterFields = null;

      if (action.resetFilters) {
        filterFields = applyInboundFilters(resetAllFilters(state, action.pageViewId), action.payload);
      } else {
        filterFields = applyInboundFilters(cloneDeep(getFields(state, action.pageViewId)), action.payload);
      }

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            inboundFilters: action.payload,
            fields: filterFields,
            expandedRows: []
          }
        }
      };
    case fromPfGridActions.UPDATE_FILTER:
      const updatedFields: ViewField[] = cloneDeep(state.grids[action.pageViewId].fields);
      const updatedField = updatedFields.find(f => f.DataElementId === action.payload.DataElementId);

      updatedField.FilterValues = action.payload.FilterValues;
      updatedField.FilterOperator = action.payload.FilterOperator;
      updatedField.IsFilterable = action.payload.IsFilterable;
      updatedField.ExcludeFieldInFilterSave = action.payload.ExcludeFieldInFilterSave;

      const splitViewFilters = updatedFields.filter(f => isFilter(f))
        .map(f => buildExternalFilter(f.FilterOperator, f.SourceName, f.FilterValues));

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: updatedFields,
            splitViewFilters: splitViewFilters
          }
        }
      };
    case fromPfGridActions.CLEAR_FILTER:
      const clearedFilterFields: ViewField[] = cloneDeep(state.grids[action.pageViewId].fields);
      const clearedFilterField = clearedFilterFields.find(f => f.DataElementId === action.field.DataElementId);

      clearedFilterField.FilterOperator = clearedFilterField && action.resetOperator
        ? getDefaultFilterOperator(clearedFilterField)
        : action.field.FilterOperator;

      clearedFilterField.FilterValues = !!action.filterValue && clearedFilterField?.FilterValues?.length > 1
        ? clearedFilterField.FilterValues.filter(option => option !== action.filterValue)
        : null;

      // For Between operator we need to remove two values => assign NULL
      if (clearedFilterField.FilterOperator === Between.Value) {
        clearedFilterField.FilterValues = null;
      }

      let clearFilterSplitViewFilters: PfDataGridFilter[] = cloneDeep(state.grids[action.pageViewId].splitViewFilters);
      if (clearedFilterField.FilterValues === null) {
        clearFilterSplitViewFilters = state.grids[action.pageViewId].splitViewFilters.filter(f => f.SourceName !== action.field.SourceName);
      } else {
        const clearFilterUpdatedFilter = clearFilterSplitViewFilters.find(f => f.SourceName === action.field.SourceName);
        clearFilterUpdatedFilter.Values = clearedFilterField.FilterValues;
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: clearedFilterFields,
            splitViewFilters: clearFilterSplitViewFilters
          }
        }
      };
    case fromPfGridActions.CLEAR_ALL_NON_GLOBAL_FILTERS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: resetFiltersForFilterableFields(state, action.pageViewId),
            splitViewFilters: []
          }
        }
      };
    case fromPfGridActions.CLEAR_ALL_FILTERS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: resetAllFilters(state, action.pageViewId),
            splitViewFilters: []
          }
        }
      };
    case fromPfGridActions.TOGGLE_FILTER_PANEL:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            filterPanelOpen: !state.grids[action.pageViewId].filterPanelOpen,
            selectedRecordId: null,
            selectedRow: null,
            fields: resetOperatorsForEmptyFilters(state, action.pageViewId)
          }
        }
      };
    case fromPfGridActions.SET_FILTER_PANEL_DISPLAY:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            filterPanelOpen: action.displayValue
          }
        }
      };
    case fromPfGridActions.UPDATE_SELECTED_RECORD_ID: {
      const curSelectionField = getSelectionField(state, action.pageViewId);
      const newSplitViewFilters = [...state.grids[action.pageViewId].splitViewFilters].filter(f => f.SourceName !== curSelectionField);
      let newSelectedRow = null;

      if (action.recordId) {
        newSplitViewFilters.push(buildExternalFilter(action.operator, curSelectionField, [action.recordId.toString()]));
        newSelectedRow = state.grids[action.pageViewId].data.data.find(r => r[getPrimaryKey(state, action.pageViewId)] === action.recordId);
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedRecordId: action.recordId,
            selectedRow: newSelectedRow,
            filterPanelOpen: false,
            splitViewFilters: newSplitViewFilters
          }
        }
      };
    }
    case fromPfGridActions.EXPAND_ROW:
      const newExpandedRows = [...(state.grids[action.pageViewId].expandedRows)];
      newExpandedRows.push(action.rowIndex);
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            expandedRows: newExpandedRows
          }
        }
      };
    case fromPfGridActions.COLLAPSE_ROW:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            expandedRows: [...state.grids[action.pageViewId].expandedRows].filter(r => r !== action.rowIndex)
          }
        }
      };
    case fromPfGridActions.COLLAPSE_ALL_ROWS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            expandedRows: []
          }
        }
      };
    case fromPfGridActions.CLEAR_LOADING:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loading: false
          }
        }
      };
    case fromPfGridActions.HANDLE_API_ERROR:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loading: false,
            unexpectedError: true
          }
        }
      };
    case fromPfGridActions.LOAD_SAVED_VIEWS_SUCCESS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            savedViews: buildFiltersView(action.payload, state, action.pageViewId)
          }
        }
      };
    case fromPfGridActions.OPEN_SAVE_VIEW_MODAL:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            saveViewModalOpen: true
          }
        }
      };

    case fromPfGridActions.CLOSE_SAVE_VIEW_MODAL:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            saveViewModalOpen: false
          }
        }
      };
    case fromPfGridActions.SAVE_VIEW:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            viewIsSaving: true
          }
        }
      };
    case fromPfGridActions.SAVE_VIEW_SUCCESS:
      const views = cloneDeep(state.grids[action.pageViewId].savedViews) || [];
      // TODO: Refactor buildFiltersView so it can work with arrays and single objects
      if (action.viewType === DataViewType.savedFilter) {
        views.push(buildFiltersView([action.payload], state, action.pageViewId)[0]);
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            saveViewModalOpen: false,
            viewIsSaving: false,
            savedViews: views.sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
          }
        }
      };
    case fromPfGridActions.UPDATE_SELECTED_KEY:
      let newSelectAllState = SelectAllStatus.unchecked;
      const grid = state.grids[action.pageViewId];

      const newSelectedKeys = cloneDeep(grid.selectedKeys) || [];
      const keyIndex = newSelectedKeys.indexOf(action.payload);
      keyIndex > -1 ? newSelectedKeys.splice(keyIndex, 1) : newSelectedKeys.push(action.payload);

      const dataPrimaryKey = getPrimaryKey(state, action.pageViewId);
      const newSelectedData = cloneDeep(grid.selectedData) || [];
      const selectedDataItem = grid.data.data.find(d => d[dataPrimaryKey] === action.payload);
      const dataItemInActiveCollection = newSelectedData.find(d => d[dataPrimaryKey] === action.payload);
      const selectedDataIndex = newSelectedData.indexOf(dataItemInActiveCollection);

      selectedDataIndex > -1 ? newSelectedData.splice(selectedDataIndex, 1) : newSelectedData.push(selectedDataItem);


      if (newSelectedKeys && (newSelectedKeys.length === grid.data.total || newSelectedKeys.length === grid.pagingOptions.Count)) {
        newSelectAllState = SelectAllStatus.checked;
      } else if (newSelectedKeys.length !== 0) {
        newSelectAllState = SelectAllStatus.indeterminate;
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedKeys: newSelectedKeys,
            selectAllState: newSelectAllState,
            selectedData: newSelectedData
          }
        }
      };
    case fromPfGridActions.SELECT_ALL:
      const selectAllStateToSet = state.grids[action.pageViewId].selectAllState === SelectAllStatus.checked
        ? SelectAllStatus.unchecked : SelectAllStatus.checked;

      const selectionPrimaryKey = getPrimaryKey(state, action.pageViewId);
      const selectAllVisibleData = state.grids[action.pageViewId].data.data;
      const selectAllVisibleFieldsIds = getVisibleFieldsIds(state, action.pageViewId, selectAllVisibleData);

      let selectAllKeys = [];
      let selectAllData = [];
      if (selectAllStateToSet === SelectAllStatus.checked) {
        selectAllKeys = uniq([...state.grids[action.pageViewId].selectedKeys || [], ...selectAllVisibleFieldsIds]);
        selectAllData = uniqBy([...state.grids[action.pageViewId].selectedData || [], ...selectAllVisibleData], selectionPrimaryKey);
      } else {
        selectAllKeys = state.grids[action.pageViewId].selectedKeys.filter(sk => !(selectAllVisibleFieldsIds.indexOf(sk) > -1));
        selectAllData = state.grids[action.pageViewId].selectedData.filter(sd => {
          return !selectAllVisibleData.find(vis => vis[selectionPrimaryKey] === sd[selectionPrimaryKey]);
        });
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedKeys: cloneDeep(selectAllKeys),
            selectedData: cloneDeep(selectAllData),
            selectAllState: selectAllStateToSet
          }
        }
      };
    case fromPfGridActions.CLEAR_SELECTIONS:
      let clearSelectionsSelectedKeys = [];
      let clearSelectionsSelectedData = [];
      let clearSelectionsSelectAllState = SelectAllStatus.unchecked;

      if (action.pageViewId
        && action.selectionsToClear
        && action.selectionsToClear.length > 0
        && state.grids[action.pageViewId].selectedKeys
        && state.grids[action.pageViewId].selectedKeys.length > 0) {

        clearSelectionsSelectedKeys = cloneDeep(state.grids[action.pageViewId].selectedKeys);
        clearSelectionsSelectedData = cloneDeep(state.grids[action.pageViewId].selectedData);
        const clearSelectionsAllVisibleFieldsIds = getVisibleFieldsIds(state, action.pageViewId, state.grids[action.pageViewId].data.data);
        const keyIdentifier = getPrimaryKey(state, action.pageViewId);

        clearSelectionsSelectedKeys = clearSelectionsSelectedKeys.filter(k => !action.selectionsToClear.includes(k));
        clearSelectionsSelectedData = clearSelectionsSelectedData.filter(d => {
          return !action.selectionsToClear.includes(d[keyIdentifier]);
        });
        clearSelectionsSelectAllState = clearSelectionsAllVisibleFieldsIds.filter(k => clearSelectionsSelectedKeys.includes(k)).length > 0
          ? SelectAllStatus.indeterminate : SelectAllStatus.unchecked;
      }

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedKeys: clearSelectionsSelectedKeys,
            selectAllState: clearSelectionsSelectAllState,
            selectedData: clearSelectionsSelectedData
          }
        }
      };
    case fromPfGridActions.CLOSE_SPLIT_VIEW:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedRecordId: null,
            selectedRow: null
          }
        }
      };
    case fromPfGridActions.DELETE_SAVED_VIEW:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            viewIsDeleting: true
          }
        }
      };
    case fromPfGridActions.DELETE_SAVED_VIEW_SUCCESS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            viewIsDeleting: false,
          }
        }
      };
    case fromPfGridActions.CLEAR_SELECTIONS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedKeys: null,
            selectAllState: SelectAllStatus.unchecked
          }
        }
      };
    case fromPfGridActions.EXPORT_GRID: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            exportingGrid: true
          }
        }
      };
    }
    case fromPfGridActions.EXPORT_GRID_SUCCESS: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            exportEventId: action.exportEventId
          }
        }
      };
    }
    case fromPfGridActions.EXPORTING_COMPLETE: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            exportEventId: null,
            exportingGrid: false
          }
        }
      };
    }
    case fromPfGridActions.GET_EXPORTING_STATUS: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loadingExportingStatus: true
          }
        }
      };
    }
    case fromPfGridActions.GET_EXPORTING_STATUS_SUCCESS: {
      const eventId = !!action.payload ? action.payload.EventId : null;
      const isExporting = !!action.payload;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            exportEventId: eventId,
            exportingGrid: isExporting,
            loadingExportingStatus: false
          }
        }
      };
    }
    case fromPfGridActions.GET_EXPORTING_STATUS_ERROR: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loadingExportingStatus: false
          }
        }
      };
    }
    case fromPfGridActions.RESET: {
      return {
        ...INITIAL_STATE
      };
    }
    case fromPfGridActions.REORDER_COLUMNS: {
      let oldIndex = action.payload.OldIndex, newIndex = action.payload.NewIndex;

      if (reorderColumnOffsetRequired(action.payload)) {
        if (action.payload.IsSelectionEnabled && action.payload.ActionsDefined) {
          oldIndex = oldIndex - 2;
          newIndex = newIndex - 2;
        } else {
          oldIndex--;
          newIndex--;
        }
      }

      // We have two different scenarios:
      // 1. Grid has ColumnGroups - we use 'groupedFields'
      // 2. Grid doesn't have ColumnGroups - we use 'fields'
      let fields;
      if (action.payload.IsUseColumnGroupsEnabled) {
        const groupedFields = cloneDeep(state.grids[action.pageViewId].groupedFields);
        fields = reorderFieldsColumnGroup(groupedFields, oldIndex, newIndex, action.payload.Level);
      } else {
        const clonedFields = cloneDeep(state.grids[action.pageViewId].fields);
        fields = reorderFieldsNoColumnGroup(clonedFields, oldIndex, newIndex);
      }

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: applyNewOrdering(cloneDeep(state.grids[action.pageViewId].fields), fields),
            groupedFields: applyNewOrdering(cloneDeep(state.grids[action.pageViewId].groupedFields), buildGroupedFields(fields))
          }
        }
      };
    }
    case fromPfGridActions.UPDATE_COLUMN_WIDTH: {
      const fieldsClone: ViewField[] = cloneDeep(state.grids[action.pageViewId].fields);
      const columnWidthUpdatedField = fieldsClone
        .filter(f => f.IsSelectable && f.IsSelected)
        .find(f => `${f.EntitySourceName}_${f.SourceName}` === action.payload.FieldSourceName);
      if (columnWidthUpdatedField) {
        columnWidthUpdatedField.Width = action.payload.NewWidth;
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: fieldsClone,
            groupedFields: buildGroupedFields(fieldsClone)
          }
        }
      };
    }
    case fromPfGridActions.UPDATE_GRID_CONFIG:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            gridConfig: action.payload,
          },
        }
      };
    case fromPfGridActions.UPDATE_ROW:
      const gridData = cloneDeep(state.grids[action.pageViewId].data);
      if (gridData && gridData.data && gridData.data.length) {
        // fetch correct row
        const rowToUpdate = cloneDeep(gridData.data[action.rowIndex]);

        if (!rowToUpdate) {
          // no data found, return
          return {
            ...state
          };
        }

        if (action.fieldNames && action.fieldNames.length > 0) {
          // loop through fields to update the cloned row
          action.fieldNames.forEach(fieldName => {
            rowToUpdate[fieldName.gridName] = action.data[fieldName.dataName];
          });
        } else {
          Object.keys(rowToUpdate).forEach(key => {
            rowToUpdate[key] = action.data[key];
          });
        }

        // replace the original row with the updated row
        gridData.data[action.rowIndex] = rowToUpdate;

        // update it in the state
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              data: {
                data: gridData.data,
                total: gridData.total
              },
              loading: false
            }
          }
        };
      } else {
        // no data found, just return
        return {
          ...state
        };
      }
    case fromPfGridActions.UPDATE_MODIFIED_KEYS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            modifiedKeys: action.payload
          }
        }
      };
    case fromPfGridActions.UPDATE_MODIFIED_KEY:
      if (state.grids[action.pageViewId].modifiedKeys == null || state.grids[action.pageViewId].modifiedKeys.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            modifiedKeys: [...state.grids[action.pageViewId].modifiedKeys, action.payload]
          }
        }
      };
    case fromPfGridActions.DELETE_MODIFIED_KEY:
      if (!state.grids[action.pageViewId].modifiedKeys.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            modifiedKeys: state.grids[action.pageViewId].modifiedKeys.filter((modifiedKey => modifiedKey !== action.payload))
          }
        }
      };
    case fromPfGridActions.CAPTURE_GRID_SCROLLED:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            gridScrolledContent: action.payload
          }
        }
      };
    case fromPfGridActions.ADD_FADE_IN_KEYS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fadeInKeys: uniq(concat(state.grids[action.pageViewId].fadeInKeys, action.payload))
          }
        }
      };

    case fromPfGridActions.DELETE_FADE_IN_KEYS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fadeInKeys: state.grids[action.pageViewId].fadeInKeys.filter((key => !action.payload.includes(key)))
          }
        }
      };
    case fromPfGridActions.SET_FADE_IN_KEYS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fadeInKeys: action.payload
          }
        }
      };
    case fromPfGridActions.UPDATE_SELECTED_ROW:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedRow: action.payload
          }
        }
      };
    case fromPfGridActions.UPDATE_FIELDS_WITH_CUSTOM_FILTER_TEMPLATES:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fieldsWithCustomFilterTemplates: action.payload
          }
        }
      };
    case fromPfGridActions.UPDATE_CUSTOM_FILTER_OPTIONS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            customFilterOptions: action.payload,
            savedViews: updateSavedViewsDescription(state.grids[action.pageViewId].savedViews, action.payload)
          }
        }
      };
    default:
      return state;
  }
}

export function reorderColumnOffsetRequired(orderEvent: ColumnReorder): boolean {
  return (orderEvent.IsSelectionEnabled || orderEvent.ActionsDefined) && orderEvent.Level === 0;
}

export function buildGroupedFields(fields: ViewField[]): any[] {
  const groups = groupBy(fields, [{ field: 'Group' }]);
  const orderedGroups = (groups as Array<GroupResult>)
    .filter(g => g.value)
    .map(g => ({
      'Order': Math.min(...g.items.map(c => (c as ViewField).Order)),
      'Group': g.value,
      'Fields': g.items,
      'HasSelection': g.items.some((i: any) => i.IsSelected && i.IsSelectable)
    }));

  const result: any[] = (groups as Array<GroupResult>).filter(g => g.value == null)[0].items;
  orderedGroups.forEach(function (group) {
    result.push(group);
  });
  result.sort((a, b) => {
    if (a.Order > b.Order) {
      return 1;
    } else if (b.Order > a.Order) {
      return -1;
    } else {
      return 0;
    }
  });
  return result;
}

export function resetFilters(fields: ViewField[]): ViewField[] {
  return cloneDeep(fields).map((field: ViewField) => {
      return {
        ...field,
        FilterValues: null,
        FilterOperator: getDefaultFilterOperator(field)
      };
    }
  );
}

export function resetFiltersForFilterableFields(state: DataGridStoreState, pageViewId: string): ViewField[] {
  const fields: ViewField[] = cloneDeep(getFields(state, pageViewId));
  const filterableFields: ViewField[] = getFilterableFields(state, pageViewId);

  const fieldsToReset: ViewField[] = fields.filter(field => filterableFields.findIndex(f => f.DataElementId === field.DataElementId) >= 0);

  fieldsToReset.forEach(field => {
    field.FilterValues = null;
    field.FilterOperator = getDefaultFilterOperator(field);
  });
  return fields;
}

function resetAllFilters(state: DataGridStoreState, pageViewId: string): ViewField[] {
  const fields: ViewField[] = cloneDeep(getFields(state, pageViewId));
  if (!fields) {
    return;
  }

  fields.forEach(field => {
    field.FilterValues = null;
    field.FilterOperator = getDefaultFilterOperator(field);
  });
  return fields;
}

function resetOperatorsForEmptyFilters(state: DataGridStoreState, pageViewId: string): ViewField[] {

  const fields: ViewField[] = cloneDeep(getFields(state, pageViewId));
  const filterableFields: ViewField[] = getFilterableFields(state, pageViewId);
  const userFilteredFields: ViewField[] = getUserFilteredFields(filterableFields, state.grids[pageViewId].fieldsWithCustomFilterTemplates);

  const fieldsToReset: ViewField[] = fields.filter(field =>
    filterableFields.findIndex(f => f.DataElementId === field.DataElementId) >= 0 &&
    userFilteredFields.findIndex(f => f.DataElementId === field.DataElementId) < 0);

  fieldsToReset.forEach(field => {
    field.FilterOperator = getDefaultFilterOperator(field);
  });
  return fields;
}

export function updateFieldsWithFilters(fields: ViewField[], inboundFilters: PfDataGridFilter[]): ViewField[] {

  let updatedFields = resetFilters(fields);
  fields.filter(f => f.FilterValues !== null && f.FilterOperator).forEach(filter => {
    const fieldToUpdate = updatedFields.find(field => field.SourceName === filter.SourceName && field.EntitySourceName === filter.EntitySourceName);
    fieldToUpdate.FilterOperator = filter.FilterOperator;
    fieldToUpdate.FilterValues = filter.FilterValues;
  });

  updatedFields = applyInboundFilters(updatedFields, inboundFilters);

  return updatedFields;
}

export function applyInboundFilters(fields: ViewField[], inboundFilters: PfDataGridFilter[]): ViewField[] {
  if (fields && fields.length > 0 && inboundFilters && inboundFilters.length > 0) {
    const updatedFields = cloneDeep(fields);

    inboundFilters.forEach(filter => {
      const fieldToUpdate = updatedFields.find(field => field.SourceName === filter.SourceName);
      if (fieldToUpdate) {
        fieldToUpdate.FilterOperator = filter.Operator;
        fieldToUpdate.FilterValues = filter.Values;
        fieldToUpdate.ExcludeFieldInFilterSave = filter.ExcludeFromFilterSave;
      }
    });

    return updatedFields;
  }

  return fields;
}

export function isFilter(field: ViewField): boolean {
  return field.IsFilterable && !!field.FilterValues && !!field.FilterOperator;
}

export function buildExternalFilter(operator: string, fieldName: string, values?: string[]): PfDataGridFilter {
  return {
    SourceName: fieldName,
    Operator: operator,
    Values: values
  };
}

export function buildFiltersView(views: DataViewConfig[], state: DataGridStoreState, pageViewId: string): SimpleDataView[] {
  return views.map(view => ({
    Name: view.Name,
    Fields: view.Fields
      .filter(field => field.FilterOperator && field.FilterValues !== null && !field.IsGlobalFilter),
    Description: view.Fields
      .filter(field => field.FilterOperator && field.FilterValues !== null && !field.IsGlobalFilter)
      .map(field => {
        return ({
          ...field,
          FilterValues: field.FilterValues,
          FilterOperator: field.FilterOperator
        });
      })
      .map(field => getSimpleDataViewDescription(field, state.grids[pageViewId].customFilterOptions))
      .join(' • ')
  }));
}

export function updateSavedViewsDescription(views: SimpleDataView[], customFilterOptions: PfDataGridCustomFilterOptions[]): SimpleDataView[] {
  if (!views?.length) {
    return [];
  }
  return views.map(view => ({
    ...view,
    Description: view.Fields
      .map(field => getSimpleDataViewDescription(field, customFilterOptions))
      .join(' • ')
  }));
}

export function findSortDescriptor(fields: ViewField[]): SortDescriptor[] {
  const sortFields: ViewField[] = fields.filter(f => f.IsSelected && f.IsSelectable && f.SortOrder !== null && f.SortDirection !== null);
  if (sortFields.length) {
    return sortFields.map(f => {
      return {
        field: `${f.EntitySourceName}_${f.SourceName}`,
        dir: f.SortDirection
      };
    });
  }
  return [];
}

export function reorderFieldsColumnGroup(groupedFields: any[], oldIndex: number, newIndex: number, level: number): ViewField[] {
  const groupedFilteredFields =
    orderBy(groupedFields.filter(f => f.DataElementId !== undefined && f.IsSelectable && f.IsSelected ||
      f.Fields !== undefined && f.HasSelection), 'Order');

  // Each level has it's own indices
  if (level === 0) {
    arrayMoveMutate(groupedFilteredFields, oldIndex, newIndex);
  } else if (level === 1) {
    // If column reorders under the column group then the level = 1 and the first column in this level has index = 0
    let groupStartIdx = 0, groupEndIdx = 0;
    for (const groupedFilteredField of groupedFilteredFields) {
      if (groupedFilteredField.Fields !== undefined) {
        // We still can have not selected fields, as group specifies only general HasSelection property
        const groupedSelectedFields = groupedFilteredField.Fields.filter(f => f.IsSelectable && f.IsSelected);
        groupEndIdx = groupStartIdx + groupedSelectedFields.length - 1;

        if (oldIndex >= groupStartIdx && oldIndex <= groupEndIdx && newIndex >= groupStartIdx && newIndex <= groupEndIdx) {
          arrayMoveMutate(groupedSelectedFields, oldIndex - groupStartIdx, newIndex - groupStartIdx);
          const groupedNotSelectedFields = groupedFilteredField.Fields.filter(f => !f.IsSelectable || !f.IsSelected);
          groupedFilteredField.Fields = groupedNotSelectedFields.concat(groupedSelectedFields);
          break;
        }

        groupStartIdx += groupedSelectedFields.length;
      }
    }
  }

  const notSelectedFields = getViewFieldsFromGroupedFields(groupedFields, false);
  const selectedFields = getViewFieldsFromGroupedFields(groupedFilteredFields, true);

  // Update the Order for each selected field
  selectedFields.forEach((f, index) => f.Order = index);

  return notSelectedFields.concat(selectedFields);
}

export function applyNewOrdering(existingFields: any[], orderedFields: any[]): ViewField[] {
  let fields: ViewField[] = [];

  existingFields.forEach((existingField) => {
    if (existingField.DataElementId !== undefined) {
      applyNewOrderingHelper(existingField, orderedFields);
    } else if (!!existingField.Fields) {
      applyNewOrderingGroupHelper(existingField, orderedFields);
    }

    fields.push(existingField);
  });

  fields = orderBy(fields, ['Order'], 'asc');
  return fields;
}

function applyNewOrderingHelper(existingField: ViewField, orderedFields: ViewField[]) {
  const orderedField = orderedFields.find(oField => oField.DataElementId === existingField.DataElementId);
  if (orderedField && isNumber(orderedField.Order)) {
    existingField.Order = orderedField.Order;
  }
}

function applyNewOrderingGroupHelper(existingField: any, orderedFields: any[]) {
  const orderedGroup = orderedFields.find(oField => oField.Group === existingField.Group);
  if (orderedGroup) {
    existingField.Order = orderedGroup.Order;
    existingField.Fields.forEach((existingSubField) => {
      applyNewOrderingHelper(existingSubField, orderedGroup.Fields);
    });

    existingField.Fields = orderBy(existingField.Fields, ['Order'], 'asc');
  }
}

export function reorderFieldsNoColumnGroup(fields: ViewField[], oldIndex: number, newIndex: number): ViewField[] {
  const notSelectedFields = fields.filter(f => !f.IsSelectable || !f.IsSelected);
  const filteredFields = orderBy(fields.filter(f => f.IsSelectable && f.IsSelected), 'Order');

  arrayMoveMutate(filteredFields, oldIndex, newIndex);
  filteredFields.forEach((f, index) => f.Order = index);

  return notSelectedFields.concat(filteredFields);
}

export function getVisibleFieldsIds(state: DataGridStoreState, pageViewId: string, data: any[]): number[] {
  return data.map((item) => item[getPrimaryKey(state, pageViewId)]);
}

export function getViewFieldsFromGroupedFields(groupedFields: any[], isSelectedOnly: boolean): ViewField[] {
  const result: ViewField[] = [];

  groupedFields.forEach(function (groupedField) {
    // Fields at level 0
    if (groupedField.DataElementId !== undefined) {
      if (isSelectedOnly && groupedField.IsSelectable && groupedField.IsSelected ||
        !isSelectedOnly && (!groupedField.IsSelectable || !groupedField.IsSelected)) {
        result.push(groupedField);
      }
    }

    // Fields at level 1
    if (groupedField.Fields !== undefined) {
      groupedField.Fields.forEach(function (field) {
        if (field.DataElementId !== undefined) {
          if (isSelectedOnly && field.IsSelectable && field.IsSelected ||
            !isSelectedOnly && (!field.IsSelectable || !field.IsSelected)) {
            result.push(field);
          }
        }
      });
    }
  });

  return result;
}
