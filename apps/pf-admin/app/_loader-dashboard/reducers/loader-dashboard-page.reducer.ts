import {isObject} from 'lodash';

import {AsyncStateObjHelper} from 'libs/core/helpers';
import {AsyncStateObj, generateDefaultAsyncStateObj} from 'libs/models/state';
import {CompanyFilePackagesResponse, CompositeDataLoadViewResponse} from 'libs/models/admin/loader-dashboard/response';

import * as fromLoaderDashboardPageActions from '../actions/loader-dashboard-page.actions';
import {GridSearchPayload} from '../models';

export interface State {
  GridSearchPayload: GridSearchPayload;
  CompositeLoadsObj: AsyncStateObj<CompositeDataLoadViewResponse[]>;
  FilePackagesObj: AsyncStateObj<CompanyFilePackagesResponse[]>;
}

export const initialState: State = {
  GridSearchPayload: null,
  CompositeLoadsObj: generateDefaultAsyncStateObj<CompositeDataLoadViewResponse[]>([]),
  FilePackagesObj: generateDefaultAsyncStateObj<CompanyFilePackagesResponse[]>([])
};

export function reducer(state = initialState, action: fromLoaderDashboardPageActions.Actions): State {
  switch (action.type) {
    case fromLoaderDashboardPageActions.INIT:
      if (!isObject(state.GridSearchPayload)) {
        return {
          ...state,
          GridSearchPayload: action.payload
        };
      }
      return state;
    case fromLoaderDashboardPageActions.GET_COMPOSITE_LOAD_GRID_DATA: {
      return AsyncStateObjHelper.loading(state, 'CompositeLoadsObj');
    }
    case fromLoaderDashboardPageActions.GET_COMPOSITE_LOAD_GRID_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'CompositeLoadsObj', action.payload);
    }
    case fromLoaderDashboardPageActions.GET_COMPOSITE_LOAD_GRID_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'CompositeLoadsObj');
    }
    case fromLoaderDashboardPageActions.GET_FILE_PACKAGE_GRID_DATA: {
      return AsyncStateObjHelper.loading(state, 'FilePackagesObj');
    }
    case fromLoaderDashboardPageActions.GET_FILE_PACKAGE_GRID_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'FilePackagesObj', action.payload);
    }
    case fromLoaderDashboardPageActions.GET_FILE_PACKAGE_GRID_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'FilePackagesObj');
    }
    case fromLoaderDashboardPageActions.UPDATE_GRID_SEARCH_PAYLOAD: {
      const searchPayload = { ...state.GridSearchPayload };
      action.payload.forEach(obj => {
        searchPayload[obj.key] = obj.value;
      });
      return {
        ...state,
        GridSearchPayload: searchPayload
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompositeLoadsObj = (state: State) => state.CompositeLoadsObj;
export const getCompositeLoadsResult = (state: State) => state.CompositeLoadsObj.obj;
export const getGridSearchPayload = (state: State) => state.GridSearchPayload;
export const getFilePackagesObj = (state: State) => state.FilePackagesObj;
export const getFilePackagesResult = (state: State) => state.FilePackagesObj.obj;
