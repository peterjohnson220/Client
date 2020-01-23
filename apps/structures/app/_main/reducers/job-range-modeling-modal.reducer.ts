import * as fromJobRangeModelingModalActions from '../actions/job-range-modeling-modal.actions';
import { JobRangeModelingModalPage } from '../constants/structures.constants';

export interface State {
  modalOpen: boolean;
  title: string;
  currentPage: JobRangeModelingModalPage;
}

export const initialState: State = {
  modalOpen: false,
  title: 'Job Range Modeling Modal',
  currentPage: null
};

export function reducer(state = initialState, action: fromJobRangeModelingModalActions.JobRangeModelingModalActions): State {
  switch (action.type) {
    case fromJobRangeModelingModalActions.OPEN_MODAL: {
      return {
        ...state,
        modalOpen: true
      };
    }
    case fromJobRangeModelingModalActions.CLOSE_MODAL: {
      return {
        ...state,
        modalOpen: false
      };
    }
    case fromJobRangeModelingModalActions.UPDATE_TITLE: {
      return {
        ...state,
        title: action.payload
      };
    }
    case fromJobRangeModelingModalActions.CHANGE_PAGE: {
      return {
        ...state,
        currentPage: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getModalOpen = (state: State) => state.modalOpen;
export const getModalTitle = (state: State) => state.title;
export const getCurrentModalPage = (state: State) => state.currentPage;
