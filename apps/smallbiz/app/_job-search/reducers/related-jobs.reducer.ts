import * as fromRelatedJobsActions from '../actions/related-jobs.actions';
import { Job } from '../models/job';

export interface State {
  jobId: number;
  isLoading: boolean;
  loadSuccess: boolean;
  loadFailure: boolean;
  relatedJobs: Job[];
}

const initialState: State = {
  jobId: 0,
  isLoading: false,
  loadSuccess: false,
  loadFailure: false,
  relatedJobs: null
};

export function reducer(state: State = initialState, action: fromRelatedJobsActions.RelatedJobsAction): State {
  switch (action.type) {
    case fromRelatedJobsActions.LOAD_RELATED_JOBS: {
      return {
        ...state,
        jobId: action.payload.jobId,
        isLoading: true,
      };
    }
    case fromRelatedJobsActions.LOAD_RELATED_JOBS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        loadSuccess: true,
        relatedJobs: action.payload.relatedJobs
      };
    }
    case fromRelatedJobsActions.LOAD_RELATED_JOBS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        loadFailure: true,
      };
    }
    default: {
      return state;
    }
  }
}

export const getJobId = (state: State) => state.jobId;
export const getIsLoading = (state: State) => state.isLoading;
export const getLoadSuccess = (state: State) => state.loadSuccess;
export const getLoadFailure = (state: State) => state.loadFailure;
export const getSearchResult = (state: State) => state.relatedJobs;
