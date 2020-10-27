import isObject from 'lodash/isObject';

import {AsyncStateObjHelper} from 'libs/core/helpers';
import {AsyncStateObj, generateDefaultAsyncStateObj} from 'libs/models/state';
import {CompanyFilePackagesResponse, CompositeDataLoadViewResponse} from 'libs/models/admin/loader-dashboard/response';

import * as fromLoaderDashboardPageActions from '../actions/loader-dashboard-page.actions';
import {GridSearchPayload} from '../models';

export interface State {
  GridSearchPayload: GridSearchPayload;
  CompositeLoadsObj: AsyncStateObj<CompositeDataLoadViewResponse[]>;
  FilePackagesObj: AsyncStateObj<CompanyFilePackagesResponse[]>;
  RedropExportedSourceFile: AsyncStateObj<boolean>;
}

export const initialState: State = {
  GridSearchPayload: null,
  CompositeLoadsObj: generateDefaultAsyncStateObj<CompositeDataLoadViewResponse[]>([]),
  FilePackagesObj: generateDefaultAsyncStateObj<CompanyFilePackagesResponse[]>([]),
  RedropExportedSourceFile: generateDefaultAsyncStateObj<boolean>(false)
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
    case fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE: {
      return AsyncStateObjHelper.loading(state, 'RedropExportedSourceFile');
    }
    case fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'RedropExportedSourceFile');
    }
    case fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'RedropExportedSourceFile');
    }
    case fromLoaderDashboardPageActions.TOGGLE_SHOW_HIDE_TEST_COMPANIES: {
      const searchPayload = { ...state.GridSearchPayload };
      searchPayload.ExcludeTestCompanies = !searchPayload.ExcludeTestCompanies;
      return {
        ...state,
        GridSearchPayload: searchPayload
      };
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
export const getRedropExportedSourceFile = (state: State) => state.RedropExportedSourceFile;
