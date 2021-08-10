import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';

import * as fromTrendsJobsCardActions from '../actions/trends-jobs.actions';

export interface State {
  selectedExchangeJobs: ExchangeJobSearchOption[];
}

const initialState: State = {
  selectedExchangeJobs: []
};

export function reducer(state: State = initialState, action: fromTrendsJobsCardActions.Actions): State {
  switch (action.type) {

    case fromTrendsJobsCardActions.SET_SELECTED_JOBS: {
      return {
        ... state,
        selectedExchangeJobs: action.payload
      };
    }

    case fromTrendsJobsCardActions.CLEAR_SELECTED_JOBS: {
      return {
        ...state,
        selectedExchangeJobs: []
      };
    }

    default: return state;
  }
}

export const getSelectedExchangeJobs = (state: State) => state.selectedExchangeJobs;
