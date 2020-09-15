import cloneDeep from 'lodash/cloneDeep';
import { SortDescriptor } from '@progress/kendo-data-query';

import { BasicDataViewField, PagingOptions, DataViewFilter } from 'libs/models/payfactors-api';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromBasicDataGridAction from '../actions/basic-data-grid.actions';

export interface BasicGridState {
  gridId: string;
  baseEntity: string;
  fields: BasicDataViewField[];
  filters: DataViewFilter[];
  pagingOptions: PagingOptions;
  applyDefaultFilters: boolean;
  distinct: boolean;
  data: AsyncStateObj<any[]>;
  loadingMoreData: boolean;
  hasMoreDataOnServer: boolean;
  defaultSort: SortDescriptor;
  sortDescriptors: SortDescriptor[];
  totalCount: AsyncStateObj<number>;
  isInitialized: boolean;
}

export interface BasicGridStateStore {
  grids: { [key: string]: BasicGridState };
}

const initialState: BasicGridStateStore = {
  grids: {}
};

export function reducer(state = initialState, action: fromBasicDataGridAction.Actions): BasicGridStateStore {
  switch (action.type) {
    case fromBasicDataGridAction.INIT_GRID: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            gridId: action.gridId,
            baseEntity: action.configuration.BaseEntity,
            fields: action.configuration.Fields,
            filters: action.configuration.Filters,
            applyDefaultFilters: action.configuration.ApplyDefaultFilters,
            distinct: action.configuration.Distinct,
            pagingOptions: action.configuration?.PagingOptions ?? { From: 0, Count: 25 },
            data: generateDefaultAsyncStateObj<any[]>([]),
            loadingMoreData: false,
            hasMoreDataOnServer: false,
            defaultSort: action.configuration.DefaultSort,
            sortDescriptors: [action.configuration.DefaultSort],
            totalCount: generateDefaultAsyncStateObj<number>(null),
            isInitialized: true
          }
        }
      };
    }
    case fromBasicDataGridAction.UPDATE_FILTERS: {
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            filters: action.filters
          }
        }
      };
    }
    case fromBasicDataGridAction.UPDATE_SORT: {
      const fieldsClone: BasicDataViewField[] = cloneDeep(state.grids[action.gridId].fields);
      const updatedSort: SortDescriptor = action.sort
        ? action.sort
        : state.grids[action.gridId].defaultSort ? state.grids[action.gridId].defaultSort : null;
      resetSort(fieldsClone);
      if (updatedSort) {
        const fieldToUpdate: BasicDataViewField = fieldsClone.find(f => f.KendoGridField === updatedSort.field);
        fieldToUpdate.SortOrder = 0;
        fieldToUpdate.SortDirection = updatedSort.dir;
      }
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            fields: fieldsClone,
            sortDescriptors: [updatedSort]
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_DATA: {
      const dataClone = cloneDeep(state.grids[action.gridId].data);
      dataClone.loading = true;
      dataClone.loadingError = false;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            data: dataClone
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_DATA_SUCCESS: {
      const dataClone = cloneDeep(state.grids[action.gridId].data);
      dataClone.loading = false;
      dataClone.obj = action.data;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            data: dataClone,
            hasMoreDataOnServer: action.data.length === state.grids[action.gridId].pagingOptions.Count
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_DATA_ERROR: {
      const dataClone = cloneDeep(state.grids[action.gridId].data);
      dataClone.loading = false;
      dataClone.loadingError = true;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            data: dataClone
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_MORE_DATA: {
      const pagingOptionsClone: PagingOptions = cloneDeep(state.grids[action.gridId].pagingOptions);
      pagingOptionsClone.From = pagingOptionsClone.From + pagingOptionsClone.Count;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            pagingOptions: pagingOptionsClone,
            loadingMoreData: true
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_MORE_DATA_SUCCESS: {
      const dataClone: AsyncStateObj<any[]> = cloneDeep(state.grids[action.gridId].data);
      dataClone.loading = false;
      dataClone.obj = dataClone.obj.concat(action.data);
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            data: dataClone,
            loadingMoreData: false,
            hasMoreDataOnServer: action.data.length < state.grids[action.gridId].totalCount?.obj
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_COUNT: {
      const totalCountClone: AsyncStateObj<number> = cloneDeep(state.grids[action.gridId].totalCount);
      totalCountClone.loading = true;
      totalCountClone.loadingError = false;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            totalCount: totalCountClone
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_COUNT_ERROR: {
      const totalCountClone: AsyncStateObj<number> = cloneDeep(state.grids[action.gridId].totalCount);
      totalCountClone.loading = false;
      totalCountClone.loadingError = true;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            totalCount: totalCountClone
          }
        }
      };
    }
    case fromBasicDataGridAction.GET_COUNT_SUCCESS: {
      const totalCountClone: AsyncStateObj<number> = cloneDeep(state.grids[action.gridId].totalCount);
      totalCountClone.loading = false;
      totalCountClone.obj = action.payload;
      return {
        ...state,
        grids: {
          ...state.grids,
          [action.gridId]: {
            ...state.grids[action.gridId],
            totalCount: totalCountClone
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}

export const getData = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.data;
export const getFields = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.fields;
export const getVisibleFields = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.fields.filter(f => !f.IsHidden);
export const getBaseEntity = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.baseEntity;
export const getFilters = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.filters;
export const getPagingOptions = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.pagingOptions;
export const getDistinct = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.distinct;
export const getApplyDefaultFilters = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.applyDefaultFilters;
export const getLoadingMoreData = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.loadingMoreData;
export const getHasMoreDataOnServer = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.hasMoreDataOnServer;
export const getSortDescriptors = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.sortDescriptors;
export const getTotalCount = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.totalCount;
export const getIsInitialized = (state: BasicGridStateStore, gridId: string) => state.grids[gridId]?.isInitialized;

export function resetSort(fields: BasicDataViewField[]): void {
  fields.forEach(f => {
    f.SortOrder = null;
    f.SortDirection = null;
  });
}
