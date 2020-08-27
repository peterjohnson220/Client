import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import { DataViewExport } from '../models';
import * as fromDataViewsExportActions from '../actions/data-views-export.action';

export interface State {
  dataViewExportsAsync: AsyncStateObj<DataViewExport[]>;
}

export const initialState: State = {
  dataViewExportsAsync: generateDefaultAsyncStateObj<DataViewExport[]>([]),
};

export function reducer(state = initialState, action: fromDataViewsExportActions.Actions): State {
  switch (action.type) {
    case fromDataViewsExportActions.GET_DATA_VIEW_EXPORTS: {
      const dataViewsExportAsyncClone = cloneDeep(state.dataViewExportsAsync);
      dataViewsExportAsyncClone.obj = [];
      dataViewsExportAsyncClone.loading = true;

      return {
        ...state,
        dataViewExportsAsync: dataViewsExportAsyncClone
      };
  }
    case fromDataViewsExportActions.GET_DATA_VIEW_EXPORTS_ERROR: {
      const dataViewsExportAsyncClone = cloneDeep(state.dataViewExportsAsync);
      dataViewsExportAsyncClone.loading = false;
      dataViewsExportAsyncClone.loadingError = true;
      return {
        ...state,
        dataViewExportsAsync: dataViewsExportAsyncClone
      };
    }
    case fromDataViewsExportActions.GET_DATA_VIEW_EXPORTS_SUCCESS: {
      const dataViewsExportAsyncClone = cloneDeep(state.dataViewExportsAsync);
      dataViewsExportAsyncClone.obj = action.payload;
      dataViewsExportAsyncClone.loading = false;
      dataViewsExportAsyncClone.loadingError = false;
      return {
        ...state,
        dataViewExportsAsync: dataViewsExportAsyncClone
      };
    }
    default: {
      return state;
    }

  }
}

export const getDataViewExports = (state: State) => state.dataViewExportsAsync;
