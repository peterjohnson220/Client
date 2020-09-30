import { AsyncStateObj,
  JobLevelHierarchy,
  JobLevelOrder,
  generateDefaultAsyncStateObj,
  generateMockJobLevelOrder,
  JobLevelHierarchyDetail,
  generateMockJobLevelHierarchyDetail} from 'libs/models';
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
}

const  initialState: State = {
  hierarchiesAsync: generateDefaultAsyncStateObj<JobLevelHierarchy[]>([]),
  availableJobFamiliesAsync: generateDefaultAsyncStateObj<string[]>([]),
  availableJobLevelsAsync: generateDefaultAsyncStateObj<string[]>([]),
  selectedHierarchy: generateDefaultAsyncStateObj<JobLevelHierarchyDetail>(generateMockJobLevelHierarchyDetail()),
  selectedJobLevels: [generateMockJobLevelOrder()],
  jobLevelsForJobFamiliesAsync: generateDefaultAsyncStateObj<string[]>([]),
  resetHierarchyForm: false
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
    case fromJobsHierarchyActions.RESET_JOB_LEVEL_HIERARCY_FORM: {
      return {
        ...state,
        resetHierarchyForm: true
      };
    }
    case fromJobsHierarchyActions.RESET_JOB_LEVEL_HIERARCY_FORM_SUCCESS: {
      return {
        ...state,
        resetHierarchyForm: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobFamilies = (state: State) => state.availableJobFamiliesAsync;
export const getJobLevels = (state: State) => state.availableJobLevelsAsync;
export const getJobLevelHierachies = (state: State) => state.hierarchiesAsync.obj;
export const getSelectedHierachy = (state: State) => state.selectedHierarchy.obj;
export const getJobLevelsForJobFamiliesDetails = (state: State) => state.jobLevelsForJobFamiliesAsync;
export const getResetHierarchyForm = (state: State) => state.resetHierarchyForm;
