import cloneDeep from 'lodash/cloneDeep';
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
  selectedJobDescriptions: Map<number, any>;
}

export const initialState: State = {
  gridDataResult: { data: [], total: null },
  gridState: { skip: 0, take: 20, sort: [{ 'field': 'JobTitle', 'dir': 'asc' }] },
  listAreaColumns: [],
  loadingJobDescriptionGrid: false,
  loadingJobDescriptionGridError: false,
  loadingListAreaColumns: false,
  loadingListAreaColumnsError: false,
  savingListAreaColumns: false,
  savingListAreaColumnsError: false,
  savingListAreaColumnsSuccess: false,
  searchTerm: '',
  selectedJobDescriptions: new Map<number, any>()
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
        const gridData = cloneDeep(action.payload);

        // update selected JDs with new grid data
        if ( state.selectedJobDescriptions?.size > 0) {
          gridData.data.forEach(jobDescription => {
            if (state.selectedJobDescriptions.has(jobDescription['JobDescriptionId'])) {
              state.selectedJobDescriptions.set(jobDescription['JobDescriptionId'], jobDescription);
            }
          });
        }

        return {
          ...state,
          loadingJobDescriptionGrid: false,
          gridDataResult: gridData
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
        savingListAreaColumns: true,
        savingListAreaColumnsSuccess: false,
        savingListAreaColumnsError: false
      };
    case fromJobDescriptionGridActions.SAVE_LIST_AREA_COLUMNS_SUCCESS:
      return {
        ...state,
        listAreaColumns: action.payload.ListAreaColumns,
        savingListAreaColumns: false,
        savingListAreaColumnsSuccess: true,
        savingListAreaColumnsError: false
      };
    case fromJobDescriptionGridActions.SAVE_LIST_AREA_COLUMNS_ERROR:
      return {
        ...state,
        savingListAreaColumns: false,
        savingListAreaColumnsSuccess: false,
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
      case fromJobDescriptionGridActions.SELECT_JOB_DESCRIPTIONS: {
        return {
          ...state,
          selectedJobDescriptions: action.payload
        };
      }

      case fromJobDescriptionGridActions.ADD_ROUTING_JOBS: {
        const gridDataResultCopy = cloneDeep(state.gridDataResult);

        gridDataResultCopy.data.forEach( jd => {
          const jobDescriptionId = jd['JobDescriptionId'];
          if (action.payload.includes(jobDescriptionId)) {
            jd['JobDescriptionStatus'] = 'Routing';
          }
        });
        // Remove this job from grid selections
        state.selectedJobDescriptions?.clear();
        return {
          ...state,
          gridDataResult: gridDataResultCopy
        };
      }

      case fromJobDescriptionGridActions.REMOVE_ROUTING_JOB: {
        const gridDataResultCopy = cloneDeep(state.gridDataResult);
        gridDataResultCopy.data.forEach( jd => {
          if (action.payload === jd['JobDescriptionId']) {
            jd['JobDescriptionStatus'] = 'In Review';
          }
        });
        return {
          ...state,
          gridDataResult: gridDataResultCopy
        };
      }

      case fromJobDescriptionGridActions.ADD_DELETING_JOBS: {
        const gridDataResultCopy = cloneDeep(state.gridDataResult);
        gridDataResultCopy.data.forEach( jd => {
          const jobDescriptionId = jd['JobDescriptionId'];
          if (action.payload.includes(jobDescriptionId)) {
            jd['JobDescriptionStatus'] = 'Deleting';
          }
          // Remove this job from grid selections
          if (state.selectedJobDescriptions.has(jobDescriptionId)) {
            state.selectedJobDescriptions.delete(jobDescriptionId);
          }
        });
        return {
          ...state,
          gridDataResult: gridDataResultCopy
        };
      }
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
export const getSelectedJobDescriptions = (state: State) => state.selectedJobDescriptions;
