import {
  AsyncStateObj,
  JobLevelHierarchy,
  JobLevelOrder,
  generateDefaultAsyncStateObj,
  generateMockJobLevelOrder,
  JobLevelHierarchyDetail,
  generateMockJobLevelHierarchyDetail
} from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromJobsHierarchyActions from '../actions/jobs-hierarchy.actions';

export interface State {
  hierarchiesAsync: AsyncStateObj<JobLevelHierarchy[]>;
  availableJobFamiliesAsync: AsyncStateObj<string[]>;
  availableJobLevelsAsync: AsyncStateObj<string[]>;
  selectedHierarchy: AsyncStateObj<JobLevelHierarchyDetail>;
  selectedJobLevels: JobLevelOrder[];
  jobLevelsForJobFamiliesAsync: AsyncStateObj<string[]>;
  resetHierarchyForm: boolean;
  modalOpen: boolean;
  deletingJobLevelHierarchyAsyncObj: AsyncStateObj<any>;
}

const initialState: State = {
  hierarchiesAsync: generateDefaultAsyncStateObj<JobLevelHierarchy[]>([]),
  availableJobFamiliesAsync: generateDefaultAsyncStateObj<string[]>([]),
  availableJobLevelsAsync: generateDefaultAsyncStateObj<string[]>([]),
  selectedHierarchy: generateDefaultAsyncStateObj<JobLevelHierarchyDetail>(generateMockJobLevelHierarchyDetail()),
  selectedJobLevels: [generateMockJobLevelOrder()],
  jobLevelsForJobFamiliesAsync: generateDefaultAsyncStateObj<string[]>([]),
  resetHierarchyForm: false,
  modalOpen: false,
  deletingJobLevelHierarchyAsyncObj: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromJobsHierarchyActions.Actions): State {
  switch (action.type) {
    case fromJobsHierarchyActions.GET_AVAILABLE_JOB_LEVELS: {
      return AsyncStateObjHelper.loading(state, 'availableJobLevelsAsync');
    }
    case fromJobsHierarchyActions.GET_AVAILABLE_JOB_LEVELS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'availableJobLevelsAsync', action.payload);
    }
    case fromJobsHierarchyActions.GET_AVAILABLE_JOB_LEVELS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'availableJobLevelsAsync');
    }
    case fromJobsHierarchyActions.GET_JOB_FAMILIES: {
      return AsyncStateObjHelper.loading(state, 'availableJobFamiliesAsync');
    }
    case fromJobsHierarchyActions.GET_JOB_FAMILIES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'availableJobFamiliesAsync', action.payload);
    }
    case fromJobsHierarchyActions.GET_JOB_FAMILIES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'availableJobFamiliesAsync');
    }
    case fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHIES: {
      return AsyncStateObjHelper.loading(state, 'hierarchiesAsync');
    }
    case fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHIES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'hierarchiesAsync', action.payload);
    }
    case fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHIES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'hierarchiesAsync');
    }
    case fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHY: {
      return AsyncStateObjHelper.loading(state, 'selectedHierarchy');
    }
    case fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHY_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'selectedHierarchy', action.payload);
    }
    case fromJobsHierarchyActions.GET_JOB_LEVEL_HIERARCHY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'selectedHierarchy');
    }
    case fromJobsHierarchyActions.RESET_JOB_LEVEL_HIERARCHY_FORM: {
      return {
        ...state,
        resetHierarchyForm: true
      };
    }
    case fromJobsHierarchyActions.RESET_JOB_LEVEL_HIERARCHY_FORM_SUCCESS: {
      return {
        ...state,
        resetHierarchyForm: false,
        selectedHierarchy: generateDefaultAsyncStateObj<JobLevelHierarchyDetail>(generateMockJobLevelHierarchyDetail())
      };
    }
    case fromJobsHierarchyActions.OPEN_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromJobsHierarchyActions.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false
      };
    case fromJobsHierarchyActions.DELETE_JOB_LEVEL_HIERARCHY:
      return AsyncStateObjHelper.saving(state, 'deletingJobLevelHierarchyAsyncObj');
    case fromJobsHierarchyActions.DELETE_JOB_LEVEL_HIERARCHY_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'deletingJobLevelHierarchyAsyncObj');
    case fromJobsHierarchyActions.DELETE_JOB_LEVEL_HIERARCHY_ERROR:
      return AsyncStateObjHelper.savingError(state, 'deletingJobLevelHierarchyAsyncObj');
    default: {
      return state;
    }
  }
}

export const getJobFamilies = (state: State) => state.availableJobFamiliesAsync;
export const getJobLevels = (state: State) => state.availableJobLevelsAsync;
export const getJobLevelHierachies = (state: State) => state.hierarchiesAsync.obj;
export const getSelectedHierarchy = (state: State) => state.selectedHierarchy.obj;
export const getResetHierarchyForm = (state: State) => state.resetHierarchyForm;
export const getModalOpen = (state: State) => state.modalOpen;
export const getDeletingJobLevelHierarchyAsyncObj = (state: State) => state.deletingJobLevelHierarchyAsyncObj;
