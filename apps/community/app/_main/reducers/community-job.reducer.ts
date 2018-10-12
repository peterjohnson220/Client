import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as communityJobActions from '../actions/community-job.actions';
import { CommunityJob } from 'libs/models/community/community-job.model';

export interface State extends EntityState<CommunityJob> {
  submitting: boolean;
  submittingError: boolean;
  loading: boolean;
  loadingError: boolean;
  submittedJob: CommunityJob;
}

function sortByTime(a: CommunityJob, b: CommunityJob) {
  return b.TimeTicks -  a.TimeTicks;
}

// Create entity adapter
export const adapter: EntityAdapter<CommunityJob> = createEntityAdapter<CommunityJob>({
  selectId: (communityPost: CommunityJob) => communityPost.Id,
  sortComparer: sortByTime
});

export const initialState: State = adapter.getInitialState({
  submitting: false,
  submittingError: false,
  loading: false,
  loadingError: false,
  submittedJob: null
});

export function reducer(
  state = initialState,
  action: communityJobActions.Actions
): State {
  switch (action.type) {
    case communityJobActions.SUBMITTING_COMMUNITY_JOB: {
      return {
        ...state,
        submitting: true,
        submittingError: false
      };
    }
    case communityJobActions.SUBMITTING_COMMUNITY_JOB_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
        submitting: false,
        submittedJob: action.payload
      };
    }
    case communityJobActions.SUBMITTING_COMMUNITY_JOB_ERROR: {
      return {
        ...state,
        submitting: false,
        submittingError: true
      };
    }
    case communityJobActions.GETTING_COMMUNITY_JOBS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case communityJobActions.GETTING_COMMUNITY_JOBS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case communityJobActions.GETTING_COMMUNITY_JOBS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityJobActions.SUBMIT_ANOTHER_COMMUNITY_JOB: {
      return {
        ...state,
        submittedJob: null
      };
    }
    default: {
      return state;
    }
  }
}
export const getSubmittingCommunityJobs = (state: State) => state.submitting;
export const getSubmittingCommunityJobsError = (state: State) => state.submittingError;
export const getSubmittingCommunityJobsSuccess = (state: State ) => state.submittedJob;

export const getGettingCommunityJobs = (state: State) => state.loading;
export const getGettingCommunityJobsError = (state: State) => state.loadingError;
