import { cloneDeep } from 'lodash';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { groupBy, GroupResult, SortDescriptor } from '@progress/kendo-data-query';

import { arraySortByString, SortDirection } from 'libs/core/functions';
import { ViewField, PagingOptions, DataViewEntity, DataViewConfig, SimpleDataView, DataViewFilter } from 'libs/models/payfactors-api';

import * as fromPfGridActions from '../actions';
import { PfDataGridFilter } from '../models';
import { getHumanizedFilter, getDefaultFilterOperator, getUserFilteredFields } from '../components';

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
  applyDefaultFilters: boolean;
  defaultSortDescriptor: SortDescriptor[];
  sortDescriptor: SortDescriptor[];
  data: GridDataResult;
  selectedRecordId: number;
  // The Kendo grid does not provide api access to know which rows are expanded
  // We need to keep track of the expandedRows separately from the Kendo Grid to in order to trigger collapse of a row by clicking on it
  expandedRows: number[];
  saveViewModalOpen: boolean;
  savedViews: SimpleDataView[];
  viewIsSaving: boolean;
  viewIsDeleting: boolean;
  viewNameToBeDeleted: string;
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
            expandedRows: [],
            selectAllState: 'unchecked',
            data: null,
            applyDefaultFilters: true,
            splitViewFilters: []
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
            fields: updateFieldsWithFilters(action.payload.Fields, state.grids[action.pageViewId].inboundFilters),
            groupedFields: buildGroupedFields(resetFilters(action.payload.Fields)),
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
              total: getTotalCount(state.grids[action.pageViewId], action.payload.TotalCount)
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
            selectedRecordId: null,
            expandedRows: [],
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
    case fromPfGridActions.UPDATE_INBOUND_FILTERS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            inboundFilters: action.payload,
            fields: applyInboundFilters(resetAllFilters(state, action.pageViewId), action.payload),
            expandedRows: []
          }
        }
      };
    case fromPfGridActions.UPDATE_FILTER:
      const updatedFields = cloneDeep(state.grids[action.pageViewId].fields);
      const updatedField = updatedFields.find(f => f.DataElementId === action.payload.DataElementId);

      updatedField.FilterValue = action.payload.FilterValue;
      updatedField.FilterOperator = action.payload.FilterOperator;

      const splitViewFilters = updatedFields.filter(f => f.IsFilterable && f.FilterValue !== null && f.FilterOperator)
        .map(f => buildExternalFilter(f.FilterValue, f.FilterOperator, f.SourceName))

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
      const clearedFilterFields = cloneDeep(state.grids[action.pageViewId].fields);
      const clearedFilterField = clearedFilterFields.find(f => f.DataElementId === action.field.DataElementId);

      if (clearedFilterField && action.resetOperator) {
        clearedFilterField.FilterOperator = getDefaultFilterOperator(clearedFilterField);
      }

      clearedFilterField.FilterValue = null;

      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            fields: clearedFilterFields,
            splitViewFilters: []
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
            fields: resetFiltersForFilterableFields(state, action.pageViewId)
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
        const  newSplitViewFilters = [...state.grids[action.pageViewId].splitViewFilters]
          .filter(f => f.SourceName !== action.fieldName);

        if (action.recordId) {
          newSplitViewFilters.push(buildExternalFilter(action.recordId.toString(), action.operator, action.fieldName));
        }
        return  {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedRecordId: action.recordId,
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
    case fromPfGridActions.CLOSE_SPLIT_VIEW:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            selectedRecordId: null
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
            viewNameToBeDeleted: null
          }
        }
      };
    case fromPfGridActions.PREPARE_VIEW_FOR_DELETE:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            viewNameToBeDeleted: action.viewName
          }
        }
      };
    case fromPfGridActions.CANCEL_VIEW_DELETE:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            viewNameToBeDeleted: null,
            viewIsDeleting: false
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
export const getFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId]
  ? state.grids[pageViewId].fields : null;
export const getSelectableFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].fields
  ? state.grids[pageViewId].fields.filter(f => f.IsSelectable) : null;
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
export const getApplyDefaultFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].applyDefaultFilters : null;
};
export const getInboundFilters = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].inboundFilters : [];
export const getFilterPanelDisplay = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].filterPanelOpen;
export const getSelectedRecordId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedRecordId : null;
export const getExpandedRows = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].expandedRows : null;
export const getSplitViewFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].splitViewFilters : null;
};
export const getSavedViews = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].savedViews;
export const getSaveViewModalOpen = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].saveViewModalOpen;
export const getViewIsSaving = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewIsSaving;
export const getSelectedKeys = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedKeys : null;
export const getSelectAllState = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].selectAllState;
export const getViewIsDeleting = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewIsDeleting;
export const getViewNameToBeDeleted = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewNameToBeDeleted;

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

export function resetFilters(fields: ViewField[]): ViewField[] {
  return cloneDeep(fields).map(
    field => {
      return {
        ...field,
        FilterValue: null,
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
    field.FilterValue = null;
    field.FilterOperator = getDefaultFilterOperator(field);
  });
  return fields;
}

function resetAllFilters(state: DataGridStoreState, pageViewId: string): ViewField[] {
  const fields: ViewField[] = cloneDeep(getFields(state, pageViewId));
  if(!fields) {
    return;
  }

  fields.forEach(field => {
    field.FilterValue = null;
    field.FilterOperator = getDefaultFilterOperator(field);
  });
  return fields;
}

function resetOperatorsForEmptyFilters(state: DataGridStoreState, pageViewId: string): ViewField[] {

  const fields: ViewField[] = cloneDeep(getFields(state, pageViewId));
  const filterableFields: ViewField[] = getFilterableFields(state, pageViewId);
  const userFilteredFields: ViewField[] = getUserFilteredFields(filterableFields);

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
  fields.filter(f => f.FilterValue !== null && f.FilterOperator).forEach(filter => {
    const fieldToUpdate = updatedFields.find(field => field.SourceName === filter.SourceName && field.EntitySourceName === filter.EntitySourceName);
    fieldToUpdate.FilterOperator = filter.FilterOperator;
    fieldToUpdate.FilterValue = filter.FilterValue;
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
        fieldToUpdate.FilterValue = filter.Value;
      }
    });

    return updatedFields;
  }

  return fields;
}

export function buildExternalFilter(value: string, operator: string,  fieldName: string): PfDataGridFilter {
  return {
    SourceName: fieldName,
    Operator: operator,
    Value: value
  };
}

export function buildFiltersView(views: DataViewConfig[]): SimpleDataView[] {
  return views.map(view => ({
    Name: view.Name,
    Description: view.Fields
      .filter(field => field.FilterOperator && field.FilterValue !== null && !field.IsGlobalFilter)
      .map(field => {
        return ({
          ...field,
          FilterValue: field.FilterValue,
          FilterOperator: field.FilterOperator
        });
      })
      .map(field => getHumanizedFilter(field))
      .join(' • ')
  }));
}

export function getTotalCount(state: DataGridState, totalCount: number) {
  if (state.pagingOptions && state.pagingOptions.From === 0) {
    return totalCount;
  } else if (state.data) {
    return state.data.total;
  } else {
    return null;
  }
}
