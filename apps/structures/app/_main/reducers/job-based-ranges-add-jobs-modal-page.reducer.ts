import * as fromJobBasedRangesAddJobsModalPageActions from '../actions/job-based-ranges-add-jobs-modal-page.actions';

export interface State {
  addJobsModalPageOpen: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorMessage: string;
  context: { PayMarketId: number, ProjectId: number, IsFromAddStructureModal: boolean };
  addingData: boolean;
  addingDataError: boolean;
  addingDataErrorMessage: any;
}

export const initialState: State = {
  addJobsModalPageOpen: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  savingErrorMessage: '',
  context: null,
  addingData: false,
  addingDataError: false,
  addingDataErrorMessage: null
};

export function reducer(state = initialState, action: fromJobBasedRangesAddJobsModalPageActions.JobBasedRangesAddJobsModalPageActions): State {
  switch (action.type) {
    case fromJobBasedRangesAddJobsModalPageActions.OPEN_ADD_JOBS_MODAL_PAGE: {
      return {
        ...state,
        addJobsModalPageOpen: true
      };
    }
    case fromJobBasedRangesAddJobsModalPageActions.CLOSE_ADD_JOBS_MODAL_PAGE: {
      return {
        ...state,
        addJobsModalPageOpen: false
      };
    }
    case fromJobBasedRangesAddJobsModalPageActions.SET_CONTEXT: {
      return {
        ...state,
        context: action.payload
      };
    }
    case fromJobBasedRangesAddJobsModalPageActions.ADD_SELECTED_JOBS: {
      return {
        ...state,
        addingData: true,
        addingDataError: false,
        addingDataErrorMessage: null
      };
    }
    case fromJobBasedRangesAddJobsModalPageActions.ADD_SELECTED_JOBS_SUCCESS: {
      return {
        ...state,
        addingData: false,
        addingDataError: false,
        addingDataErrorMessage: null
      };
    }
    case fromJobBasedRangesAddJobsModalPageActions.ADD_SELECTED_JOBS_ERROR: {
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
export const getAddJobsModalPageOpen = (state: State) => state.addJobsModalPageOpen;
export const getContext = (state: State) => state.context;
export const getAddingData = (state: State) => state.addingData;
export const getAddingDataError = (state: State) => state.addingDataError;
export const getAddingDataErrorMessage = (state: State) => state.addingDataErrorMessage;
