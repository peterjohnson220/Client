import { cloneDeep } from 'lodash';
import * as fromPfGridActions from '../actions';
import { ViewField, PagingOptions, DataViewFilter, DataViewFieldDataType, DataViewEntity } from 'libs/models/payfactors-api';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { groupBy, GroupResult } from '@progress/kendo-data-query';

export interface DataGridState {
  pageViewId: string;
  loading: boolean;
  baseEntity: DataViewEntity;
  fields: ViewField[];
  groupedFields: any[];
  inboundFilters: DataViewFilter[];
  splitViewFilters: DataViewFilter[];
  filters: DataViewFilter[];
  filterPanelOpen: boolean;
  data: GridDataResult;
  pagingOptions: PagingOptions;
  selectedRowId: number;
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
            filters: [],
            inboundFilters: []
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
            fields: action.payload.Fields,
            groupedFields: buildGroupedFields(action.payload.Fields),
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
    case fromPfGridActions.UPDATE_INBOUND_FILTERS:
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            inboundFilters: action.payload
          }
        }
      };
    case fromPfGridActions.UPDATE_FILTER:
      const newFilters = cloneDeep(state.grids[action.pageViewId].filters);
      const filterForThisField = state.grids[action.pageViewId].filters.find(f => f.SourceName === action.payload.SourceName);

      if (filterForThisField) {
        const thisFilterIndex = state.grids[action.pageViewId].filters.findIndex(f => f.SourceName === action.payload.SourceName);
        newFilters.splice(thisFilterIndex, 1, action.payload);
      } else {
        newFilters.push(action.payload);
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            filters: newFilters
          }
        }
      };
    case fromPfGridActions.CLEAR_FILTER:
      const clonedFilters = cloneDeep(state.grids[action.pageViewId].filters);
      const filterToRemove = state.grids[action.pageViewId].filters.find(f => f.SourceName === action.payload.SourceName);
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.pageViewId]: {
            ...state.grids[action.pageViewId],
            filters: clonedFilters.filter(nf => nf.SourceName !== filterToRemove.SourceName)
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
            filters: []
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
            filterPanelOpen: !state.grids[action.pageViewId].filterPanelOpen
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
            // We have to store a copy of the splitViewFilters in the state so we can memoize it.
            // If we use a function we'll recreate the splitViewFilters each time we call getSplitViewFilters
            splitViewFilters: buildSplitViewFilters(action.rowId, state.grids[action.pageViewId].baseEntity.SourceName, action.fieldName)
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
    default:
      return state;
  }
}

export const getState = (state: DataGridStoreState) => state;
export const getGrid = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId];
export const getLoading = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].loading : null;
export const getBaseEntity = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].baseEntity : null;
export const getFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].fields : null;
export const getGroupedFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].groupedFields : null;
export const getGlobalFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] && state.grids[pageViewId].fields ? state.grids[pageViewId].fields.filter(f => f.IsGlobalFilter) : null;
};
export const getPagingOptions = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].pagingOptions : null;
export const getData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].data : null;
export const getInboundFilters = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].inboundFilters : [];
export const getFilters = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].filters : [];
export const getFilterPanelDisplay = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].filterPanelOpen;
export const getSelectedRowId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].selectedRowId : null;
export const getSplitViewFilters = (state: DataGridStoreState, pageViewId: string) => {
  return state.grids[pageViewId] ? state.grids[pageViewId].splitViewFilters : null;
};

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

export function buildSplitViewFilters(rowId: number, baseEntityName: string, fieldName: string): DataViewFilter[] {
  if (rowId) {
    return [{
      EntitySourceName: baseEntityName,
      SourceName: fieldName,
      Operator: '=',
      Value: rowId.toString(),
      Values: null,
      DataType: DataViewFieldDataType.Int
    }];
  }

  return [];
}
