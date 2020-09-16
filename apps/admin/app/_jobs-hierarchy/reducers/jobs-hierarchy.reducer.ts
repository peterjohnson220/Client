import * as fromJobsHierarchyActions from '../actions/jobs-hierarchy.actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import cloneDeep from 'lodash/cloneDeep';
import { SelectedJobFamily } from 'libs/models/jobs-hierarchy';


export interface State {
  jobFamilyDetailsAsync: AsyncStateObj<string[]>;
  selectedJobFamiliesList: SelectedJobFamily[];
  jobLevelsForJobFamiliesDetailsAsync: AsyncStateObj<string[]>;
}

const  initialState: State = {
  jobFamilyDetailsAsync: generateDefaultAsyncStateObj<string[]>([]),
  selectedJobFamiliesList: [],
  jobLevelsForJobFamiliesDetailsAsync: generateDefaultAsyncStateObj<string[]>([])
};


export function reducer(state = initialState, action: fromJobsHierarchyActions.Actions): State {
  switch (action.type) {
    case fromJobsHierarchyActions.GET_JOB_FAMILIES: {
      const jobFamilyDetailsAsyncClone = cloneDeep(state.jobFamilyDetailsAsync);

      jobFamilyDetailsAsyncClone.loading = true;
      jobFamilyDetailsAsyncClone.obj = null;
      jobFamilyDetailsAsyncClone.loadingError = false;

      return {
        ...state,
        jobFamilyDetailsAsync: jobFamilyDetailsAsyncClone
      };
    }
    case fromJobsHierarchyActions.GET_JOB_FAMILIES_SUCCESS: {
      const jobFamilyDetailsAsyncClone = cloneDeep(state.jobFamilyDetailsAsync);
      const jobFamilySelectedList = cloneDeep(state.selectedJobFamiliesList);

      jobFamilyDetailsAsyncClone.loading = false;
      jobFamilyDetailsAsyncClone.obj = action.payload;

      if (jobFamilyDetailsAsyncClone.obj) {
          const jobFamilies = jobFamilyDetailsAsyncClone.obj;
          jobFamilies.forEach(family => {
            jobFamilySelectedList.push({JobFamily: family, Selected: false});
          });
      }
      return {
        ...state,
        jobFamilyDetailsAsync: jobFamilyDetailsAsyncClone,
        selectedJobFamiliesList: jobFamilySelectedList
      };
    }
    case fromJobsHierarchyActions.GET_JOB_FAMILIES_ERROR: {
      const jobFamilyDetailsAsyncClone = cloneDeep(state.jobFamilyDetailsAsync);

      jobFamilyDetailsAsyncClone.loading = false;
      jobFamilyDetailsAsyncClone.loadingError = true;

      return {
        ...state,
        jobFamilyDetailsAsync: jobFamilyDetailsAsyncClone
      };
    }
    case fromJobsHierarchyActions.SET_NEW_FAMILY_SELECTION: {
      const updatedSelections = cloneDeep(action.payload);
      const jobLevelsForJobFamiliesDetailsAsyncClone = cloneDeep(state.jobLevelsForJobFamiliesDetailsAsync);

      jobLevelsForJobFamiliesDetailsAsyncClone.loading = true;
      jobLevelsForJobFamiliesDetailsAsyncClone.loadingError = false;

      return{
        ...state,
        selectedJobFamiliesList: updatedSelections,
        jobLevelsForJobFamiliesDetailsAsync: jobLevelsForJobFamiliesDetailsAsyncClone
      };
    }
    case fromJobsHierarchyActions.GET_JOB_LEVELS_FOR_JOB_FAMILY_SUCCESS: {
      const jobLevelsForJobFamiliesDetailsAsyncClone = cloneDeep(state.jobLevelsForJobFamiliesDetailsAsync);

      jobLevelsForJobFamiliesDetailsAsyncClone.loading = false;
      jobLevelsForJobFamiliesDetailsAsyncClone.obj = action.payload;
      return {
        ...state,
        jobLevelsForJobFamiliesDetailsAsync: jobLevelsForJobFamiliesDetailsAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobFamilyDetails = (state: State) => state.jobFamilyDetailsAsync;
export const getJobLevelsForJobFamiliesDetails = (state: State) => state.jobLevelsForJobFamiliesDetailsAsync;
export const getSelectedJobFamiliesList = (state: State) => state.selectedJobFamiliesList;

