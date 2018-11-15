import * as cloneDeep from 'lodash.clonedeep';

import { DataCut, JobMatchCut } from 'libs/models/survey-search';
import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import { JobToPrice } from '../models';
import { DataCutDetails } from '../../shared/models';

export interface State {
  loadingJobs: boolean;
  loadingJobsError: boolean;
  jobsToPrice: JobToPrice[];
}

const initialState: State = {
  loadingJobs: false,
  jobsToPrice: [],
  loadingJobsError: false
};

// Reducer function
export function reducer(state = initialState, action: fromJobsToPriceActions.Actions): State {
  switch (action.type) {

    case fromJobsToPriceActions.GET_JOBS_TO_PRICE: {
      return {
        ...state,
        loadingJobs: true
      };
    }
    case fromJobsToPriceActions.GET_JOBS_TO_PRICE_SUCCESS: {
      return {
        ...state,
        loadingJobs: false,
        jobsToPrice: action.payload
      };
    }
    case fromJobsToPriceActions.GET_JOBS_TO_PRICE_ERROR: {
      return {
        ...state,
        loadingJobs: false,
        loadingJobsError: true
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS: {
      const jobToPriceId = action.payload.Id;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = true;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS_SUCCESS: {
      const jobToPriceId = action.payload.JobId;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = false;
      jobToPrice.LoadingDataCutsError = false;
      jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts || [];
      jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.concat(action.payload.JobMatchCuts);
      jobToPrice.JobMatchCuts.sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS_ERROR: {
      const jobToPriceId = action.payload.Id;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = false;
      jobToPrice.LoadingDataCutsError = true;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.CLEAR_ALL_JOBS: {
      return {
        ...state,
        jobsToPrice: []
      };
    }
    case fromJobsToPriceActions.ADD_DATA_CUTS_TO_JOB_TO_PRICE: {
      const dataCuts = action.payload.DataCuts;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === action.payload.JobId);
      if (jobToPrice) {
        addJobCuts(jobToPrice, dataCuts);
      }
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.REMOVE_JOB_CUT: {
      const cutToRemove = action.payload.DataCut;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === action.payload.JobId);
      if (jobToPrice) {
        removeJobMatchCut(jobToPrice, cutToRemove);
      }
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }

    default: {
      return state;
    }
  }
}

function mapDataCutToMatchCut(jobCuts: DataCutDetails[]): JobMatchCut[] {
  return jobCuts.map(jobCut => {
    return {
      JobTitle: jobCut.Job.Title,
      JobCode: jobCut.Job.Code,
      Source: jobCut.IsPayfactorsJob ? jobCut.Job.Source :
        jobCut.Job.Source + ': ' + jobCut.Job.SurveyName + ' ' + formatDate(jobCut.Job.EffectiveDate.toString()),
      Base50: Number(jobCut.Base50th),
      TCC50: Number(jobCut.TCC50th),
      DataCutId: jobCut.DataCutId,
      SurveyJobCode: jobCut.SurveyJobCode
    };
  });
}

function addJobCuts(jobToPrice: JobToPrice, newDataCuts: DataCut[]) {
  jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts || [];
  jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.concat(mapDataCutToMatchCut(newDataCuts));
  jobToPrice.TotalDataCuts += newDataCuts.length;
  // sort after adding
  jobToPrice.JobMatchCuts.sort((a, b) => arraySortByString(a.JobTitle, b.JobTitle, SortDirection.Ascending));
  // track cuts added
  jobToPrice.DataCutsToAdd = jobToPrice.DataCutsToAdd || [];
  jobToPrice.DataCutsToAdd = jobToPrice.DataCutsToAdd.concat(newDataCuts);
}

function removeJobMatchCut(jobToPrice: JobToPrice, cutToRemove: JobMatchCut) {
  if (cutToRemove.UserJobMatchId) {
    // remove job match cut and track deleted id
    jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.filter(x => x.UserJobMatchId !== cutToRemove.UserJobMatchId);
    jobToPrice.DeletedJobMatchCutIds = jobToPrice.DeletedJobMatchCutIds || [];
    jobToPrice.DeletedJobMatchCutIds.push(cutToRemove.UserJobMatchId);
  } else {
    // new data cut filter
    let cutFilter = x => x.DataCutId === cutToRemove.DataCutId;
    if (cutToRemove.SurveyJobCode) {
      cutFilter = x => x.SurveyJobCode === cutToRemove.SurveyJobCode;
    }
    const matchingJobCut = jobToPrice.JobMatchCuts.find(cutFilter);
    const matchingDataCut = jobToPrice.DataCutsToAdd.find(cutFilter);
    jobToPrice.JobMatchCuts = jobToPrice.JobMatchCuts.filter(x => x !== matchingJobCut);
    jobToPrice.DataCutsToAdd = jobToPrice.DataCutsToAdd.filter(x => x !== matchingDataCut);
  }
  jobToPrice.TotalDataCuts--;
}

function formatDate(dateString: string): string {
  if (dateString) {
    return new Date(dateString).toLocaleDateString('en-US');
  }
  return '';
}
// Selector functions
export const getLoadingJobs = (state: State) => state.loadingJobs;
export const getLoadingJobsError = (state: State) => state.loadingJobsError;
export const getJobsToPrice = (state: State) => state.jobsToPrice;
