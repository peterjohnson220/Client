import { cloneDeep } from 'lodash';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { groupBy, GroupResult, SortDescriptor } from '@progress/kendo-data-query';

import { arraySortByString, SortDirection } from 'libs/core/functions';
import { ViewField, PagingOptions, DataViewEntity, DataViewConfig, SimpleDataView, DataViewFilter } from 'libs/models/payfactors-api';

import * as fromPfGridActions from '../actions';
import { PfDataGridFilter } from '../models';
import { FilterOperatorOptions, getHumanizedFilter, isValueRequired } from '../components';

export interface DataGridState {
  pageViewId: string;
  loading: boolean;
  baseEntity: DataViewEntity;
  fields: ViewField[];
  groupedFields: any[];
  inboundFilters: PfDataGridFilter[];
  splitViewFilters: PfDataGridFilter[];
  filterPanelOpen: boolean;
  pagingOptions: PagingOptions;
  defaultSortDescriptor: SortDescriptor[];
  sortDescriptor: SortDescriptor[];
  data: GridDataResult;
  selectedRowId: number;
  saveViewModalOpen: boolean;
  savedViews: SimpleDataView[];
  viewIsSaving: boolean;
  selectedKeys: number[];
  selectAllState: string;
}

export interface DataGridStoreState {
  grids: { [key: string]: DataGridState };
}

const INITIAL_STATE: DataGridStoreState = {
  grids: {}
};

export const DEFAULT_PAGING_OPTIONS: PagingOptions = {
  From: 0,
  Count: 20
};

export function reducer(state = INITIAL_STATE, action: fromPfGridActions.DataGridActions): DataGridStoreState {
  switch (action.type) {
    case fromPfGridActions.LOAD_VIEW_CONFIG:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            pageViewId: action.pageViewId,
            loading: true,
            pagingOptions: DEFAULT_PAGING_OPTIONS,
            inboundFilters: [],
            selectAllState: 'unchecked',
            data: null
          }
        }
      };
    case fromPfGridActions.LOAD_VIEW_CONFIG_SUCCESS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: updateFieldsWithFilters(action.payload.Fields, action.payload.Filters, state.grids[action.pageViewId].inboundFilters),
            groupedFields: buildGroupedFields(resetFieldOperator(action.payload.Fields)),
            baseEntity: action.payload.Entity,
            loading: false
          }
        }
      };
    case fromPfGridActions.LOAD_DATA:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            loading: true
          }
        }
      };
    case fromPfGridActions.LOAD_DATA_SUCCESS:
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
            loading: false,
          }
        }
      };
    case fromPfGridActions.UPDATE_FIELDS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: action.fields,
            groupedFields: buildGroupedFields(action.fields),
            selectedRowId: null,
            splitViewFilters: []
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
    case fromPfGridActions.UPDATE_SORT_DESCRIPTOR:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            sortDescriptor: action.sortDescriptor[0].dir ? action.sortDescriptor : state.grids[action.pageViewId].defaultSortDescriptor,
            loading: true
          },
        }
      };
    case fromPfGridActions.UPDATE_INBOUND_FILTERS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            inboundFilters: action.payload,
            fields: applyInboundFilters(state.grids[action.pageViewId].fields, action.payload)
          }
        }
      };
    case fromPfGridActions.UPDATE_FILTER:
      const updatedFields = cloneDeep(state.grids[action.pageViewId].fields);
      const updatedField = updatedFields.find(f => f.DataElementId === action.payload.DataElementId);

      updatedField.FilterValue = action.payload.FilterValue;
      updatedField.FilterOperator = action.payload.FilterOperator;

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: updatedFields
          }
        }
      };
    case fromPfGridActions.CLEAR_FILTER:
      const clearedFilterFields = cloneDeep(state.grids[action.pageViewId].fields);
      const clearedFilterField = clearedFilterFields.find(f => f.DataElementId === action.payload.DataElementId);

      clearedFilterField.FilterValue = null;

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: clearedFilterFields
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
            fields: resetFieldOperator(state.grids[action.pageViewId].fields)
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
            selectedRowId: null,
            splitViewFilters: []
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
    case fromPfGridActions.UPDATE_SELECTED_ROW_ID:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedRowId: action.rowId,
            filterPanelOpen: false,
            splitViewFilters: buildSplitViewFilters(action.rowId, action.fieldName)
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
            loading: false
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
            savedViews: buildFiltersView(action.payload)
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
      const views = cloneDeep(state.grids[action.pageViewId].savedViews);
      // TODO: Refactor buildFiltersView so it can work with arrays and single objects
      views.push(buildFiltersView([action.payload])[0]);
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
      let newSelectAllState = 'unchecked';
      const grid = state.grids[action.pageViewId];
      const newSelectedKeys = cloneDeep(grid.selectedKeys) || [];
      const index = newSelectedKeys.indexOf(action.payload);
      index > -1 ? newSelectedKeys.splice(index, 1) : newSelectedKeys.push(action.payload);
      if (newSelectedKeys && (newSelectedKeys.length === grid.data.total || newSelectedKeys.length === grid.pagingOptions.Count)) {
        newSelectAllState = 'checked';
      } else if (newSelectedKeys.length !== 0) {
        newSelectAllState = 'indeterminate';
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedKeys: newSelectedKeys,
            selectAllState: newSelectAllState
          }
        }
      };
    case fromPfGridActions.SELECT_ALL:
      const selectAllState = state.grids[action.pageViewId].selectAllState === 'checked' ? 'unchecked' : 'checked';
      let selectedKeys = [];
      if (selectAllState === 'checked') {

        selectedKeys = state.grids[action.pageViewId].data.data.map((item) => item[action.primaryKey]);
      } else {
        selectedKeys = null;
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedKeys: cloneDeep(selectedKeys),
            selectAllState: selectAllState
          }
        }
      };
    default:
      return state;
  }
}


export const getState = (state: DataGridStoreState) => state;
export const getGrid = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId];
export const getLoading = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].loading : null;
export const getBaseEntity = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].baseEntity : null;
export const getFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].fields
  ? state.grids[pageViewId].fields // .filter(f => !f.IsGlobalFilter)
  : null;
export const getGroupedFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].groupedFields : null;
export const getGlobalFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] && state.grids[pageViewId].fields ? state.grids[pageViewId].fields.filter(f => f.IsGlobalFilter) : null;
};
export const getFilterableFields = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] && state.grids[pageViewId].fields ?
    state.grids[pageViewId].fields
      .filter(f => f.CustomFilterStrategy && !f.IsGlobalFilter)
      .concat(state.grids[pageViewId].fields.filter(f => f.IsFilterable && f.IsSelected))
    : null;
};
export const getPagingOptions = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].pagingOptions : null;
export const getDefaultSortDescriptor = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].defaultSortDescriptor : null;
};
export const getSortDescriptor = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].sortDescriptor : null;
export const getData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].data : null;
export const getInboundFilters = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].inboundFilters : [];
export const getFilterPanelDisplay = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].filterPanelOpen;
export const getSelectedRowId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedRowId : null;
export const getSplitViewFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].splitViewFilters : null;
};
export const getSavedViews = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].savedViews;
export const getSaveViewModalOpen = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].saveViewModalOpen;
export const getViewIsSaving = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewIsSaving;
export const getSelectedKeys = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedKeys : null;
export const getSelectAllState = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].selectAllState;

export function buildGroupedFields(fields: ViewField[]): any[] {
  const groups = groupBy(fields, [{ field: 'Group' }]);
  const orderedGroups = (groups as Array<GroupResult>)
    .filter(g => g.value)
    .map(g => ({
      'Order': Math.min(...g.items.map(c => (c as ViewField).Order)),
      'Group': g.value,
      'Fields': g.items
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


export function resetFieldOperator(fields: ViewField[]): ViewField[] {
  return cloneDeep(fields).map(
    field => {
      return {
        ...field,
        FilterValue: null,
        FilterOperator: FilterOperatorOptions[field.DataType] ?
          FilterOperatorOptions[field.DataType].find(f => f.defaultOperatorForType).value :
          null
      };
    }
  );
}

export function updateFieldsWithFilters(fields: ViewField[], filters: DataViewFilter[], inboundFilters: PfDataGridFilter[]): ViewField[] {

  let updatedFields = resetFieldOperator(fields);

  filters.forEach(filter => {
    const fieldToUpdate = updatedFields.find(field => field.SourceName === filter.SourceName && field.EntitySourceName === filter.EntitySourceName)
    fieldToUpdate.FilterOperator = filter.Operator;
    fieldToUpdate.FilterValue = filter.Values[0];
  });

  updatedFields = applyInboundFilters(updatedFields, inboundFilters);

  return updatedFields;
}

export function applyInboundFilters(fields: ViewField[], inboundFilters: PfDataGridFilter[]): ViewField[] {

  if (fields && fields.length > 0 && inboundFilters && inboundFilters.length > 0) {
    const updatedFields = cloneDeep(fields);

    inboundFilters.forEach(filter => {
      const fieldToUpdate = updatedFields.find(field => field.SourceName === filter.SourceName);
      fieldToUpdate.FilterOperator = filter.Operator;
      fieldToUpdate.FilterValue = filter.Value;
    });

    return updatedFields;
  }

  return fields;
}

export function buildSplitViewFilters(rowId: number, fieldName: string): PfDataGridFilter[] {
  if (rowId) {
    return [{
      SourceName: fieldName,
      Operator: '=',
      Value: rowId.toString(),
    }];
  }
  return [];
}


export function buildFiltersView(views: DataViewConfig[]): SimpleDataView[] {
  return views.map(view => ({
    Name: view.Name,
    Description: view.Fields
      .filter(field => view.Filters.find(filter => filter.SourceName === field.SourceName))
      .map(field => {
        const curfilter = view.Filters.find(filter => filter.SourceName === field.SourceName);
        return ({
          ...field,
          FilterValue: curfilter ? curfilter.Values[0] : null,
          FilterOperator: curfilter ? curfilter.Operator : null
        });
      })
      .map(field => getHumanizedFilter(field))
      .join(' • ')
  }));
}
