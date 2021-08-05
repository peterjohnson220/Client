import isObject from 'lodash/isObject';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { CompanyFilePackagesResponse, CompositeDataLoadViewResponse } from 'libs/models/admin/loader-dashboard/response';
import * as fromLoaderDashboardPageActions from '../actions/loader-dashboard-page.actions';
import { GridSearchPayload, UpdatedArchiveSummaryModel } from '../models';

export interface State {
  GridSearchPayload: GridSearchPayload;
  CompositeLoadsObj: AsyncStateObj<CompositeDataLoadViewResponse[]>;
  FilePackagesObj: AsyncStateObj<CompanyFilePackagesResponse[]>;
  RedropExportedSourceFile: AsyncStateObj<boolean>;
  RedropConfirmationModalOpen: boolean;
  UpdatedArchiveSummaryObj: AsyncStateObj<UpdatedArchiveSummaryModel>;
  RedropFileObj: File;
  IsModifiedRedropInProgress: boolean;
  RedropExportedSourceFileToNewDataLoad: AsyncStateObj<boolean>;
  RedropNewDataLoadConfirmationModalOpen: boolean;
}

export const initialState: State = {
  GridSearchPayload: null,
  CompositeLoadsObj: generateDefaultAsyncStateObj<CompositeDataLoadViewResponse[]>([]),
  FilePackagesObj: generateDefaultAsyncStateObj<CompanyFilePackagesResponse[]>([]),
  RedropExportedSourceFile: generateDefaultAsyncStateObj<boolean>(false),
  RedropConfirmationModalOpen: false,
  UpdatedArchiveSummaryObj: generateDefaultAsyncStateObj<UpdatedArchiveSummaryModel>({ }),
  RedropFileObj: null,
  IsModifiedRedropInProgress: false,
  RedropExportedSourceFileToNewDataLoad: generateDefaultAsyncStateObj<boolean>(false),
  RedropNewDataLoadConfirmationModalOpen: false
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
    case fromLoaderDashboardPageActions.OPEN_REDROP_CONFIRMATION_MODAL: {
      return {
        ...state,
        RedropConfirmationModalOpen: true
      };
    }
    case fromLoaderDashboardPageActions.DISMISS_REDROP_CONFIRMATION_MODAL: {
      return {
        ...state,
        RedropConfirmationModalOpen: false
      };
    }
    case fromLoaderDashboardPageActions.GET_ARCHIVE_DATA: {
      const newState = AsyncStateObjHelper.loading(state, 'UpdatedArchiveSummaryObj');
      return {
        ...newState,
        RedropFileObj: action.payload.file
      };
    }
    case fromLoaderDashboardPageActions.GET_ARCHIVE_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'UpdatedArchiveSummaryObj', action.payload);
    }
    case fromLoaderDashboardPageActions.GET_ARCHIVE_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'UpdatedArchiveSummaryObj', action.errorMessage);
    }
    case fromLoaderDashboardPageActions.CLEAR_ARCHIVE_DATA: {
      return {
        ...state,
        UpdatedArchiveSummaryObj: generateDefaultAsyncStateObj<UpdatedArchiveSummaryModel>({ }),
        RedropFileObj: null
      };
    }
    case fromLoaderDashboardPageActions.REDROP_ARCHIVE: {
      return {
        ...state,
        IsModifiedRedropInProgress: true
      };
    }
    case fromLoaderDashboardPageActions.REDROP_ARCHIVE_SUCCESS: {
      return {
        ...state,
        IsModifiedRedropInProgress: false
      };
    }
    case fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE_TO_NEW_DATA_LOAD: {
      return AsyncStateObjHelper.loading(state, 'RedropExportedSourceFileToNewDataLoad');
    }
    case fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE_TO_NEW_DATA_LOAD_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'RedropExportedSourceFileToNewDataLoad', action.payload);
    }
    case fromLoaderDashboardPageActions.REDROP_EXPORTED_SOURCE_FILE_TO_NEW_DATA_LOAD_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'RedropExportedSourceFileToNewDataLoad');
    }
    case fromLoaderDashboardPageActions.OPEN_REDROP_TO_NEW_DATA_LOAD_CONFIRMATION_MODAL: {
      return {
        ...state,
        RedropNewDataLoadConfirmationModalOpen: true
      };
    }
    case fromLoaderDashboardPageActions.DISMISS_REDROP_TO_NEW_DATA_LOAD_CONFIRMATION_MODAL: {
      return {
        ...state,
        RedropNewDataLoadConfirmationModalOpen: false
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
export const getRedropConfirmationModalOpen = (state: State) => state.RedropConfirmationModalOpen;
export const getUpdatedArchiveSummaryObj = (state: State) => state.UpdatedArchiveSummaryObj;
export const getRedropFileObj = (state: State) => state.RedropFileObj;
export const getIsModifiedRedropInProgress = (state: State) => state.IsModifiedRedropInProgress;
export const getRedropExportedSourceFileToNewDataLoad = (state: State) => state.RedropExportedSourceFileToNewDataLoad;
export const getRedropNewDataLoadConfirmationModalOpen = (state: State) => state.RedropNewDataLoadConfirmationModalOpen;
