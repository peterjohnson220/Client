import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { PagingOptions } from 'libs/models/payfactors-api';

import * as fromDataViewGridActions from '../actions/data-view-grid.actions';

export interface State {
  dataAsync: AsyncStateObj<any[]>;
  loadingMoreData: boolean;
  pagingOptions: PagingOptions;
  hasMoreDataOnServer: boolean;
}

const initialState: State = {
  dataAsync: generateDefaultAsyncStateObj<any[]>([]),
  loadingMoreData: false,
  pagingOptions: {
    From: 0,
    Count: 25
  },
  hasMoreDataOnServer: true
};

export function reducer(state = initialState, action: fromDataViewGridActions.Actions): State {
  switch (action.type) {
    case fromDataViewGridActions.GET_DATA: {
      const asyncStateObjClone = cloneDeep(state.dataAsync);
      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      asyncStateObjClone.obj = [];
      return {
        ...state,
        dataAsync: asyncStateObjClone,
        pagingOptions: initialState.pagingOptions,
        hasMoreDataOnServer: true
      };
    }
    case fromDataViewGridActions.GET_DATA_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.dataAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        dataAsync: asyncStateObjClone
      };
    }
    case fromDataViewGridActions.GET_DATA_ERROR: {
      const asyncStateObjClone = cloneDeep(state.dataAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        dataAsync: asyncStateObjClone
      };
    }
    case fromDataViewGridActions.GET_MORE_DATA: {
      return {
        ...state,
        loadingMoreData: true,
        pagingOptions: {
          ...state.pagingOptions,
          From: state.pagingOptions.From + state.pagingOptions.Count
        }
      };
    }
    case fromDataViewGridActions.GET_MORE_DATA_SUCCESS: {
      const asyncStateObjClone: AsyncStateObj<any[]> = cloneDeep(state.dataAsync);
      asyncStateObjClone.obj = asyncStateObjClone.obj.concat(action.payload);
      return {
        ...state,
        loadingMoreData: false,
        dataAsync: asyncStateObjClone,
        hasMoreDataOnServer: (action.payload.length === state.pagingOptions.Count)
      };
    }
    default: {
      return state;
    }
  }
}

export const getReportDataAsync = (state: State) => state.dataAsync;
export const getPagingOptions = (state: State) => state.pagingOptions;
export const getLoadingMoreData = (state: State) => state.loadingMoreData;
export const getHasMoreDataOnServer = (state: State) => state.hasMoreDataOnServer;
