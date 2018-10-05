import * as fromJobDetailActions from '../actions/job-detail.actions';
import { Job } from '../../shared/models/job';

export interface State {
  isLoading: boolean;
  loadSuccess: boolean;
  loadFailure: boolean;
  job: Job;
}

const initialState: State = {
  isLoading: false,
  loadSuccess: false,
  loadFailure: false,
  job: {} as Job
};

export function reducer(state: State = initialState, action: fromJobDetailActions.JobDetailAction): State {
  switch (action.type) {
    case fromJobDetailActions.LOAD_JOB: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case fromJobDetailActions.LOAD_JOB_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        loadSuccess: true,
        job: action.payload.job
      };
    }
    case fromJobDetailActions.LOAD_JOB_FAILURE: {
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

export const getIsLoading = (state: State) => state.isLoading;
export const getLoadSuccess = (state: State) => state.loadSuccess;
export const getLoadFailure = (state: State) => state.loadFailure;
export const getJob = (state: State) => state.job;
