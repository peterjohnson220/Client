import cloneDeep from 'lodash/cloneDeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromJobsToGradeActions from '../actions/jobs-to-grade.actions';
import { Grade } from '../models';

export interface State {
  loadingGrades: boolean;
  loadingGradesError: boolean;
  grades: Grade[];
}

const initialState: State = {
  loadingGrades: false,
  loadingGradesError: false,
  grades: []
};

// Reducer function
export function reducer(state = initialState, action: fromJobsToGradeActions.JobsToGradeActions): State {
  switch (action.type) {

    case fromJobsToGradeActions.GET_GRADES: {
      return {
        ...state,
        loadingGrades: true
      };
    }
    case fromJobsToGradeActions.GET_GRADES_SUCCESS: {
      return {
        ...state,
        loadingGrades: false,
        grades: action.payload
      };
    }
    case fromJobsToGradeActions.GET_GRADES_ERROR: {
      return {
        ...state,
        loadingGrades: false,
        loadingGradesError: true
      };
    }

    case fromJobsToGradeActions.GET_GRADE_JOBS: {
      const gradeId = action.payload.CompanyStructuresGradesId;
      const gradesCopy = cloneDeep(state.grades);
      const grade = gradesCopy.find(x => x.CompanyStructuresGradesId === gradeId);
      grade.LoadingJobs = true;
      return {
        ...state,
        grades: gradesCopy
      };
    }
    case fromJobsToGradeActions.GET_GRADE_JOBS_SUCCESS: {
      const gradeId = action.payload.CompanyStructuresGradesId;
      const gradesCopy = cloneDeep(state.grades);
      const grade = gradesCopy.find(x => x.CompanyStructuresGradesId === gradeId);
      grade.LoadingJobs = false;
      grade.LoadingJobsError = false;
      grade.Jobs = [];
      grade.Jobs = grade.Jobs.concat(action.payload.GradeJobs);
      grade.Jobs.sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
      return {
        ...state,
        grades: gradesCopy
      };
    }
    case fromJobsToGradeActions.GET_GRADE_JOBS_ERROR: {
      const gradeId = action.payload.CompanyStructuresGradesId;
      const gradesCopy = cloneDeep(state.grades);
      const grade = gradesCopy.find(x => x.CompanyStructuresGradesId === gradeId);
      grade.LoadingJobs = false;
      grade.LoadingJobsError = true;
      return {
        ...state,
        grades: gradesCopy
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoadingGrades = (state: State) => state.loadingGrades;
export const getLoadingGradesError = (state: State) => state.loadingGradesError;
export const getGrades = (state: State) => state.grades;
