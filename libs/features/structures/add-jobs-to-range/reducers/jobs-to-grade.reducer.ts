import cloneDeep from 'lodash/cloneDeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromJobsToGradeActions from '../actions/jobs-to-grade.actions';
import { Grade, GradeJob } from '../models';

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
      grade.Jobs = grade.Jobs || [];
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
    case fromJobsToGradeActions.REMOVE_JOB: {
      const jobToRemove = action.payload.Job;
      const gradesCopy = cloneDeep(state.grades);
      const grade = gradesCopy.find(x => x.CompanyStructuresGradesId === action.payload.GradeId);
      if (grade) {
        removeJob(grade, jobToRemove);
      }
      return {
        ...state,
        grades: gradesCopy
      };
    }
    case fromJobsToGradeActions.ADD_JOBS_TO_GRADE: {
      const jobs = action.payload.GradeJobs;
      const gradesCopy = cloneDeep(state.grades);
      const grade = gradesCopy.find(x => x.CompanyStructuresGradesId === action.payload.CompanyStructuresGradesId);

      if (grade) {
        addJobs(grade, jobs);
      }
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

function removeJob(grade: Grade, jobToRemove: GradeJob) {
  // remove job and track deleted id
  grade.Jobs = grade.Jobs.filter(x => x.JobId !== jobToRemove.JobId);

  grade.JobIdsToRemove = grade.JobIdsToRemove || [];
  if (grade.JobIdsToRemove.indexOf(jobToRemove.JobId) < 0) {
    grade.JobIdsToRemove.push(jobToRemove.JobId);
    // if found in jobs to add, remove
    grade.JobIdsToAdd = grade.JobIdsToAdd.filter(jita => jita !== jobToRemove.JobId);
  }

  grade.TotalJobs--;
}

function addJobs(grade: Grade, newJobs: GradeJob[]) {
  grade.Jobs = grade.Jobs || [];
  // remove any from newJobs that already exist on the grade
  newJobs = newJobs.filter(nj => grade.Jobs.map(gj => gj.JobId).indexOf(nj.JobId) < 0);
  if (newJobs.length > 0) {
    grade.Jobs = grade.Jobs.concat(newJobs);
    grade.TotalJobs += newJobs.length;
    // sort after adding
    grade.Jobs.sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
    // track jobs added
    grade.JobIdsToAdd = grade.JobIdsToAdd || [];
    const newJobIds = newJobs.map(nj => nj.JobId);
    grade.JobIdsToAdd = uniqueNumberArray(grade.JobIdsToAdd.concat(newJobIds));
    // delete the jobs being added from the remove array, if found
    grade.JobIdsToRemove = grade.JobIdsToRemove.filter(jitr => newJobIds.indexOf(jitr) < 0);
  }

}

function uniqueNumberArray(a) {
  return [...Array.from(new Set<number>(a))];
}

// Selector functions
export const getLoadingGrades = (state: State) => state.loadingGrades;
export const getLoadingGradesError = (state: State) => state.loadingGradesError;
export const getGrades = (state: State) => state.grades;
