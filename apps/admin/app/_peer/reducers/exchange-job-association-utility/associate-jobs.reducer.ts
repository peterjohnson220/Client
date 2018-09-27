import * as fromAssociateJobsActions from '../../actions/exchange-job-association-utility/associate-jobs.actions';

export interface State {
  associating: boolean;
  associatingError: boolean;
}

// Initial State
export const initialState: State = {
  associating: false,
  associatingError: false
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
export const getAssociatingError = (state: State) => state.associatingError;
