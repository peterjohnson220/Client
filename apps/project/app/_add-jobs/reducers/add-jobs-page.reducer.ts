import * as fromAddJobsPageActions from '../actions/add-jobs.page.actions';

export interface State {
  context: { PayMarketId: number, ProjectId: number};
  addingData: boolean;
  addingDataError: boolean;
}

const initialState: State = {
  context: null,
  addingData: false,
  addingDataError: false
};

// Reducer function
export function reducer(state = initialState, action: fromAddJobsPageActions.Actions): State {
  switch (action.type) {

    case fromAddJobsPageActions.SET_CONTEXT: {
      return {
        ...state,
        context: action.payload
      };
    }
    case fromAddJobsPageActions.ADD_SELECTED_JOBS: {
      return {
        ...state,
        addingData: true,
        addingDataError: false
      };
    }
    case fromAddJobsPageActions.ADD_SELECTED_JOBS_SUCCESS: {
      return {
        ...state,
        addingData: false,
        addingDataError: false
      };
    }
    case fromAddJobsPageActions.ADD_SELECTED_JOBS_ERROR: {
      return {
        ...state,
        addingData: false,
        addingDataError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getContext = (state: State) => state.context;
export const getAddingData = (state: State) => state.addingData;
export const getAddingDataError = (state: State) => state.addingDataError;
