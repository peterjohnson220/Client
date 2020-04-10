import * as fromAddJobsPageActions from '../actions/add-jobs-page.actions';

export interface State {
  context: { PayMarketId: number, ProjectId: number };
  contextStructureRangeGroupId: number;
  addingData: boolean;
  addingDataError: boolean;
  addingDataErrorMessage: any;
}

const initialState: State = {
  context: null,
  contextStructureRangeGroupId: null,
  addingData: false,
  addingDataError: false,
  addingDataErrorMessage: null
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
    case fromAddJobsPageActions.SET_CONTEXT_STRUCTURES_RANGE_GROUP_ID: {
      return {
        ...state,
        contextStructureRangeGroupId: action.payload
      };
    }
    case fromAddJobsPageActions.ADD_ALL_JOBS:
    case fromAddJobsPageActions.ADD_SELECTED_JOBS: {
      return {
        ...state,
        addingData: true,
        addingDataError: false,
        addingDataErrorMessage: null
      };
    }
    case fromAddJobsPageActions.ADD_JOBS_SUCCESS: {
      return {
        ...state,
        addingData: false,
        addingDataError: false,
        addingDataErrorMessage: null
      };
    }
    case fromAddJobsPageActions.ADD_JOBS_ERROR: {
      return {
        ...state,
        addingData: false,
        addingDataError: true,
        addingDataErrorMessage: action.error
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getContext = (state: State) => state.context;
export const getContextStructureRangeGroupId = (state: State) => state.contextStructureRangeGroupId;
export const getAddingData = (state: State) => state.addingData;
export const getAddingDataError = (state: State) => state.addingDataError;
export const getAddingDataErrorMessage = (state: State) => state.addingDataErrorMessage;
