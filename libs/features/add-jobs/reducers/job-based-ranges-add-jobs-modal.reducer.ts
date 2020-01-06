import * as fromJobBasedRangesAddJobsModalActions from '../actions/job-based-ranges-add-jobs-modal.actions';

export interface State {
  addJobsModalOpen: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorMessage: string;
}

export const initialState: State = {
  addJobsModalOpen: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  savingErrorMessage: ''
};

export function reducer(state = initialState, action: fromJobBasedRangesAddJobsModalActions.JobBasedRangesAddJobsModalActions): State {
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
    default: {
      return state;
    }
  }
}

export const getAddJobsModalOpen = (state: State) => state.addJobsModalOpen;
