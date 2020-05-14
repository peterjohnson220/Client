import * as fromAssociateJobsActions from 'libs/features/peer/job-association-match/actions/associate-jobs.actions';

export interface State {
  associating: boolean;
  associatingError: boolean;
  associationCount: number;
}

// Initial State
export const initialState: State = {
  associating: false,
  associatingError: false,
  associationCount: 0
};

// Reducer
export function reducer(
  state = initialState,
  action: fromAssociateJobsActions.Actions
): State {
  switch (action.type) {
    case fromAssociateJobsActions.ASSOCIATE_JOBS: {
      return {
        ...state,
        associating: true,
        associatingError: false
      };
    }
    case fromAssociateJobsActions.ASSOCIATE_JOBS_SUCCESS: {
      return {
        ...state,
        associationCount: action.payload,
        associating: false
      };
    }
    case fromAssociateJobsActions.ASSOCIATE_JOBS_ERROR: {
      return {
        ...state,
        associating: false,
        associatingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getAssociating = (state: State) => state.associating;
export const getAssociatingCount = (state: State) => state.associationCount;
export const getAssociatingError = (state: State) => state.associatingError;
