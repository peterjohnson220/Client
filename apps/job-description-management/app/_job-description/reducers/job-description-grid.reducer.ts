import * as cloneDeep from 'lodash.clonedeep';
import { State as KendoState } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ListAreaColumn } from 'libs/models/common';

import * as fromJobDescriptionGridActions from '../actions/job-description-grid.actions';

export interface State {
  gridDataResult: GridDataResult;
  gridState: KendoState;
  listAreaColumns: ListAreaColumn[];
  loadingJobDescriptionGrid: boolean;
  loadingJobDescriptionGridError: boolean;
  loadingListAreaColumns: boolean;
  loadingListAreaColumnsError: boolean;
  savingListAreaColumns: boolean;
  savingListAreaColumnsError: boolean;
  savingListAreaColumnsSuccess: boolean;
  searchTerm: string;
}

export const initialState: State = {
  gridDataResult: null,
  gridState: { skip: 0, take: 20 },
  listAreaColumns: [],
  loadingJobDescriptionGrid: false,
  loadingJobDescriptionGridError: false,
  loadingListAreaColumns: false,
  loadingListAreaColumnsError: false,
  savingListAreaColumns: false,
  savingListAreaColumnsError: false,
  savingListAreaColumnsSuccess: false,
  searchTerm: ''
};

export function reducer(state = initialState, action: fromJobDescriptionGridActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionGridActions.LOAD_JOB_DESCRIPTION_GRID:
      return {
        ...state,
        loadingJobDescriptionGrid: true
      };
    case fromJobDescriptionGridActions.LOAD_JOB_DESCRIPTION_GRID_ERROR:
      return {
        ...state,
        loadingJobDescriptionGrid: false,
        loadingJobDescriptionGridError: true
      };
      case fromJobDescriptionGridActions.LOAD_JOB_DESCRIPTION_GRID_SUCCESS:
        return {
          ...state,
          loadingJobDescriptionGrid: false,
          gridDataResult: cloneDeep(action.payload)
        };
    case fromJobDescriptionGridActions.LOAD_LIST_AREA_COLUMNS:
    case fromJobDescriptionGridActions.LOAD_PUBLIC_JDM_COLUMNS:
      return {
        ...state,
        loadingListAreaColumns: true
      };
    case fromJobDescriptionGridActions.LOAD_LIST_AREA_COLUMNS_ERROR:
    case fromJobDescriptionGridActions.LOAD_PUBLIC_JDM_COLUMNS_ERROR:
      return {
        ...state,
        loadingListAreaColumns: false,
        loadingListAreaColumnsError: true
      };
    case fromJobDescriptionGridActions.LOAD_LIST_AREA_COLUMNS_SUCCESS:
      return {
        ...state,
        listAreaColumns: action.payload
      };
      case fromJobDescriptionGridActions.LOAD_PUBLIC_JDM_COLUMNS_SUCCESS:
        return {
          ...state,
          loadingListAreaColumns: false,
          loadingListAreaColumnsError: false,
          listAreaColumns: action.payload
        };
    case fromJobDescriptionGridActions.SAVE_LIST_AREA_COLUMNS:
      return {
        ...state,
        savingListAreaColumns: true
      };
    case fromJobDescriptionGridActions.SAVE_LIST_AREA_COLUMNS_SUCCESS:
      return {
        ...state,
        listAreaColumns: action.payload.ListAreaColumns,
        savingListAreaColumns: false,
        savingListAreaColumnsSuccess: true
      };
    case fromJobDescriptionGridActions.SAVE_LIST_AREA_COLUMNS_ERROR:
      return {
        ...state,
        savingListAreaColumns: false,
        savingListAreaColumnsError: true
      };
    case fromJobDescriptionGridActions.UPDATE_GRID_STATE:
      return {
        ...state,
        gridState: action.payload
      };
    case fromJobDescriptionGridActions.UPDATE_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
    case fromJobDescriptionGridActions.UPDATE_PUBLIC_VIEW_SUCCESS:
      const clonedGridDataResult = cloneDeep(state.gridDataResult);
      const gridResultData = clonedGridDataResult.data.map(cjd => {
        if (cjd.JobDescriptionId === action.payload.JobDescriptionId) {
          cjd = {
            ...cjd,
            PublicView: action.payload.PublicView
          };
        }
        return cjd;
      });

      clonedGridDataResult.data = gridResultData;
      return {
        ...state,
        gridDataResult: clonedGridDataResult
      };
    default:
      return state;
  }
}

export const getJobDescriptionGridLoading = (state: State) => state.loadingJobDescriptionGrid;
export const getJobDescriptionGridLoadingError = (state: State) => state.loadingJobDescriptionGridError;
export const getGridDataResult = (state: State) => state.gridDataResult;
export const getGridState = (state: State) => state.gridState;
export const getListAreaColumns = (state: State) => state.listAreaColumns;
export const getListAreaColumnsSaving = (state: State) => state.savingListAreaColumns;
export const getListAreaColumnsSavingError = (state: State) => state.savingListAreaColumnsError;
export const getListAreaColumnsSavingSuccess = (state: State) => state.savingListAreaColumnsSuccess;
export const getSearchTerm = (state: State) => state.searchTerm;
