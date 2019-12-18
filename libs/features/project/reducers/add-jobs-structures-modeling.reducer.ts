import * as fromAddJobsStructuresModelingActions from '../actions';

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

export function reducer(state = initialState, action: fromAddJobsStructuresModelingActions.AddJobsStructuresModelingActions): State {
  switch (action.type) {
    case fromAddJobsStructuresModelingActions.OPEN_ADD_JOBS_MODAL: {
      return {
        ...state,
        addJobsModalOpen: true
      };
    }
    case fromAddJobsStructuresModelingActions.CLOSE_ADD_JOBS_MODAL: {
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
