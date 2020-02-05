import * as fromJobBasedRangesAddJobsModalActions from '../actions/add-jobs-modal.actions';

export interface State {
  addJobsModalOpen: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorMessage: string;
  context: { PayMarketId: number, ProjectId: number};
  addingData: boolean;
  addingDataError: boolean;
  addingDataErrorMessage: any;
}

export const initialState: State = {
  addJobsModalOpen: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  savingErrorMessage: '',
  context: null,
  addingData: false,
  addingDataError: false,
  addingDataErrorMessage: null
};

export function reducer(state = initialState, action: fromJobBasedRangesAddJobsModalActions.AddJobsModalActions): State {
  switch (action.type) {
    case fromJobBasedRangesAddJobsModalActions.OPEN_ADD_JOBS_MODAL: {
      return {
        ...state,
        addJobsModalOpen: true
      };
    }
    case fromJobBasedRangesAddJobsModalActions.CLOSE_ADD_JOBS_MODAL: {
      return {
        ...state,
        addJobsModalOpen: false
      };
    }
    case fromJobBasedRangesAddJobsModalActions.SET_CONTEXT: {
      return {
        ...state,
        context: action.payload
      };
    }
    case fromJobBasedRangesAddJobsModalActions.ADD_SELECTED_JOBS: {
      return {
        ...state,
        addingData: true,
        addingDataError: false,
        addingDataErrorMessage: null
      };
    }
    case fromJobBasedRangesAddJobsModalActions.ADD_SELECTED_JOBS_SUCCESS: {
      return {
        ...state,
        addingData: false,
        addingDataError: false,
        addingDataErrorMessage: null
      };
    }
    case fromJobBasedRangesAddJobsModalActions.ADD_SELECTED_JOBS_ERROR: {
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
export const getAddJobsModalOpen = (state: State) => state.addJobsModalOpen;
export const getContext = (state: State) => state.context;
export const getAddingData = (state: State) => state.addingData;
export const getAddingDataError = (state: State) => state.addingDataError;
export const getAddingDataErrorMessage = (state: State) => state.addingDataErrorMessage;
