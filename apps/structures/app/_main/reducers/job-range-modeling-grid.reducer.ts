import * as cloneDeep from 'lodash.clonedeep';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ListAreaColumn } from 'libs/models/common';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromJobRangeModelingGridActions from '../actions/job-range-modeling-grid.actions';

export interface State {
  gridDataResultAsync: AsyncStateObj<GridDataResult>;
  listAreaColumnsAsync: AsyncStateObj<ListAreaColumn[]>;
  reorderingListAreaColumns: boolean;
  savingListAreaColumnsAsync: AsyncStateObj<boolean>;
}

export const initialState: State = {
  gridDataResultAsync: generateDefaultAsyncStateObj<GridDataResult>(null),
  listAreaColumnsAsync: generateDefaultAsyncStateObj<ListAreaColumn[]>([]),
  reorderingListAreaColumns: false,
  savingListAreaColumnsAsync: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state = initialState, action: fromJobRangeModelingGridActions.Actions): State {
  switch (action.type) {
    case fromJobRangeModelingGridActions.LOAD_JOB_RANGE_MODELING_GRID: {
      const gridDataResultAsyncClone = cloneDeep(state.gridDataResultAsync);

      gridDataResultAsyncClone.loading = true;
      gridDataResultAsyncClone.loadingError = false;

      return {
        ...state,
        gridDataResultAsync: gridDataResultAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.LOAD_JOB_RANGE_MODELING_GRID_ERROR: {
      const gridDataResultAsyncClone = cloneDeep(state.gridDataResultAsync);

      gridDataResultAsyncClone.loading = false;
      gridDataResultAsyncClone.loadingError = true;

      return {
        ...state,
        gridDataResultAsync: gridDataResultAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.LOAD_JOB_RANGE_MODELING_GRID_SUCCESS: {
      const gridDataResultAsyncClone = cloneDeep(state.gridDataResultAsync);

      gridDataResultAsyncClone.obj = action.payload;
      gridDataResultAsyncClone.loading = false;

      return {
        ...state,
        gridDataResultAsync: gridDataResultAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.LOAD_LIST_AREA_COLUMNS: {
      const listAreaColumnsAsyncClone = cloneDeep(state.listAreaColumnsAsync);

      listAreaColumnsAsyncClone.loading = true;
      listAreaColumnsAsyncClone.loadingError = false;

      return {
        ...state,
        listAreaColumnsAsync: listAreaColumnsAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.LOAD_LIST_AREA_COLUMNS_ERROR: {
      const listAreaColumnsAsyncClone = cloneDeep(state.listAreaColumnsAsync);

      listAreaColumnsAsyncClone.loading = false;
      listAreaColumnsAsyncClone.loadingError = true;

      return {
        ...state,
        listAreaColumnsAsync: listAreaColumnsAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.LOAD_LIST_AREA_COLUMNS_SUCCESS: {
      const listAreaColumnsAsyncClone = cloneDeep(state.listAreaColumnsAsync);

      listAreaColumnsAsyncClone.obj = action.payload;
      listAreaColumnsAsyncClone.loading = false;

      return {
        ...state,
        listAreaColumnsAsync: listAreaColumnsAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.REORDER_LIST_AREA_COLUMNS: {
      return {
        ...state,
        reorderingListAreaColumns: true
      };
    }
    case fromJobRangeModelingGridActions.REORDER_LIST_AREA_COLUMNS_SUCCESS: {
      return {
        ...state,
        reorderingListAreaColumns: false
      };
    }
    case fromJobRangeModelingGridActions.SAVE_LIST_AREA_COLUMNS: {
      const savingListAreaColumnsAsyncClone = cloneDeep(state.savingListAreaColumnsAsync);

      savingListAreaColumnsAsyncClone.loading = true;
      savingListAreaColumnsAsyncClone.loadingError = false;

      return {
        ...state,
        savingListAreaColumnsAsync: savingListAreaColumnsAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.SAVE_LIST_AREA_COLUMNS_ERROR: {
      const savingListAreaColumnsAsyncClone = cloneDeep(state.savingListAreaColumnsAsync);

      savingListAreaColumnsAsyncClone.loading = false;
      savingListAreaColumnsAsyncClone.loadingError = true;

      return {
        ...state,
        savingListAreaColumnsAsync: savingListAreaColumnsAsyncClone
      };
    }
    case fromJobRangeModelingGridActions.SAVE_LIST_AREA_COLUMNS_SUCCESS: {
      const savingListAreaColumnsAsyncClone = cloneDeep(state.savingListAreaColumnsAsync);

      savingListAreaColumnsAsyncClone.obj = true;
      savingListAreaColumnsAsyncClone.loading = false;

      return {
        ...state,
        savingListAreaColumnsAsync: savingListAreaColumnsAsyncClone
      };
    }
    default:
      return state;
  }
}

export const getGridDataResultAsync = (state: State) => state.gridDataResultAsync;
export const getListAreaColumnsAsync = (state: State) => state.listAreaColumnsAsync;
export const getListAreaColumnsLoading = (state: State) => state.listAreaColumnsAsync.loading;
export const getListAreaColumnsReordering = (state: State) => state.reorderingListAreaColumns;
export const getListAreaColumnsSavingAsync = (state: State) => state.savingListAreaColumnsAsync;
export const getListAreaColumnsVisible = (state: State) => state.listAreaColumnsAsync.obj.filter(lac => lac.Visible);
