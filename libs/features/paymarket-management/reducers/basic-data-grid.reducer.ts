import { cloneDeep } from 'lodash';

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
            distinct: action.configuration.ApplyDefaultFilters,
            pagingOptions: { From: 0, Count: 25 },
            data: generateDefaultAsyncStateObj<any[]>([]),
            loadingMoreData: false
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
            data: dataClone
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
            loadingMoreData: false
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
