import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { DataViewExportListItem } from '../models';

import * as fromDataViewsExportActions from '../actions/data-views-export.action';

export interface State {
  dataViewExportListAsync: AsyncStateObj<DataViewExportListItem[]>;
}

export const initialState: State = {
  dataViewExportListAsync: generateDefaultAsyncStateObj<DataViewExportListItem[]>([]),
};

export function reducer(state = initialState, action: fromDataViewsExportActions.Actions): State {
  switch (action.type) {
    case fromDataViewsExportActions.GET_DATA_VIEWS_EXPORT_LIST_ITEMS: {
      const dataViewsExportAsyncClone = cloneDeep(state.dataViewExportListAsync);
      dataViewsExportAsyncClone.obj = [];
      dataViewsExportAsyncClone.loading = true;

      return {
        ...state,
        dataViewExportListAsync: dataViewsExportAsyncClone
      };
  }
    case fromDataViewsExportActions.GET_DATA_VIEWS_EXPORT_LIST_ITEMS_ERROR: {
      const dataViewsExportAsyncClone = cloneDeep(state.dataViewExportListAsync);
      dataViewsExportAsyncClone.loading = false;
      dataViewsExportAsyncClone.loadingError = true;
      return {
        ...state,
        dataViewExportListAsync: dataViewsExportAsyncClone
      };
    }
    case fromDataViewsExportActions.GET_DATA_VIEWS_EXPORT_LIST_ITEMS_SUCCESS:{
      const dataViewsExportAsyncClone = cloneDeep(state.dataViewExportListAsync);
      dataViewsExportAsyncClone.obj = action.payload;
      dataViewsExportAsyncClone.loading = false;
      dataViewsExportAsyncClone.loadingError = false;
      return {
        ...state,
        dataViewExportListAsync: dataViewsExportAsyncClone
      };
    }
    default: {
      return state;
    }

  }
}

export const getDataViewsExportList = (state: State) => state.dataViewExportListAsync;
