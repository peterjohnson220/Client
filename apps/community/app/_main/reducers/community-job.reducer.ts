import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as communityJobActions from '../actions/community-job.actions';
import { CommunityJob } from 'libs/models/community/community-job.model';
import { PagingOptions } from '../models/paging-options.model';


export interface State extends EntityState<CommunityJob> {
  submitting: boolean;
  submittingError: boolean;
  loading: boolean;
  loadingMoreResults: boolean;
  pagingOptions: PagingOptions;
  loadingError: boolean;
  submittedJob: CommunityJob;
  totalResultsOnServer: number;
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
  loadingMoreResults: false,
  pagingOptions: {
    PageIndex: 1,
    NumberOfPosts: 20
  },
  loadingError: false,
  submittedJob: null,
  totalResultsOnServer: 0
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
        loadingError: false,
        pagingOptions: {...state.pagingOptions, PageIndex: 1}
      };
    }
    case communityJobActions.GETTING_COMMUNITY_JOBS_SUCCESS: {
      return {
        ...adapter.setAll(action.payload.CommunityJobResults, state),
        loading: false,
        totalResultsOnServer: action.payload.Paging.TotalRecordCount
      };
    }
    case communityJobActions.GETTING_COMMUNITY_JOBS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityJobActions.GETTING_MORE_COMMUNITY_JOBS: {
      return {
        ...state,
        loadingError: false,
        loadingMoreResults: true,
        pagingOptions: {...state.pagingOptions, PageIndex: state.pagingOptions.PageIndex + 1}
      };
    }
    case communityJobActions.GETTING_MORE_COMMUNITY_JOBS_SUCCESS: {
      return {
        ...adapter.addMany(action.payload.CommunityJobResults, state),
        loadingMoreResults: false
      };
    }
    case communityJobActions.GETTING_MORE_COMMUNITY_JOBS_ERROR: {
      return {
        ...state,
        loadingError: true
      };
    }
    case communityJobActions.SUBMIT_ANOTHER_COMMUNITY_JOB: {
      return {
        ...state,
        submittedJob: null
      };
    }
    case communityJobActions.GETTING_BACK_TO_TOP_COMMUNITY_JOBS: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        pagingOptions: {...state.pagingOptions, PageIndex: 1}
      };
    }
    case communityJobActions.GETTING_BACK_TO_TOP_COMMUNITY_JOBS_SUCCESS: {
      return {
        ...adapter.addMany(action.payload.CommunityJobResults, state),
        loading: false,
        totalResultsOnServer: action.payload.Paging.TotalRecordCount
      };
    }
    case communityJobActions.GETTING_BACK_TO_TOP_COMMUNITY_JOBS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityJobActions.DELETING_COMMUNITY_JOB_SUCCESS: {
      const jobId = action.payload;
      return {
        ...adapter.removeOne(jobId,
          state)
      };
    }
    case communityJobActions.DELETING_COMMUNITY_JOB_ERROR: {
      return {
        ...state,
        submittingError: true
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
export const getLoadingMoreResults = (state: State) => state.loadingMoreResults;
export const getGettingCommunityJobsError = (state: State) => state.loadingError;
export const getPagingOptions = (state: State) => state.pagingOptions;
export const getTotalResultsOnServer = (state: State) => state.totalResultsOnServer;
