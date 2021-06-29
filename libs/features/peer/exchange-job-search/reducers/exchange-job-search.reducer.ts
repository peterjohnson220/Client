import cloneDeep from 'lodash/cloneDeep';

import * as fromExchangeJobSearchActions from '../actions/exchange-job-search.actions';

export interface State {
  exchangeId: number;
  exchangeJobResults: any[]; // TODO: [JP] Type
  selectedExchangeJobs: any[]; // TODO: [JP] Type
  noResultsMessage: string;
}

export const initialState: State = {
  exchangeId: 0,
  exchangeJobResults: [],
  selectedExchangeJobs: [],
  noResultsMessage: null
};

export function reducer(state = initialState, action: fromExchangeJobSearchActions.ExchangeJobSearchActions): State {
  switch (action.type) {
    case fromExchangeJobSearchActions.SET_CONTEXT: {
      return {
        ...state,
        exchangeId: action.payload.exchangeId
      };
    }
    case fromExchangeJobSearchActions.RESET_STATE: {
      return {
        ...initialState
      };
    }
    case fromExchangeJobSearchActions.REPLACE_EXCHANGE_JOB_RESULTS: {
      return {
        ...state,
        // TODO: [JP] Implement ExchangeJobSelectionService
        // exchangeJobResults: TotalRewardsAssignmentService.setEmployeeSelectedToggle(action.payload.exchangeJobResults, state.selectedExchangeJobs),
        exchangeJobResults: action.payload.exchangeJobResults,
        noResultsMessage: action.payload.noResultsMessage
      };
    }
    case fromExchangeJobSearchActions.ADD_EXCHANGE_JOB_RESULTS: {
      return {
        ...state,

        // TODO: [JP] Implement ExchangeJobSelectionService
        exchangeJobResults: state.exchangeJobResults.concat(action.payload.exchangeJobResults),
        // .concat(TotalRewardsAssignmentService.setEmployeeSelectedToggle(action.payload.exchangeJobResults, state.selectedExchangeJobs)),
        noResultsMessage: action.payload.noResultsMessage
      };
    }
    case fromExchangeJobSearchActions.CLEAR_EXCHANGE_JOB_RESULTS: {
      return {
        ...state,
        exchangeJobResults: [],
        noResultsMessage: null
      };
    }
    case fromExchangeJobSearchActions.TOGGLE_EXCHANGE_JOB_SELECTION: {
      const exchangeJob = action.payload.exchangeJob;
      const exchangeJobResultsCopy = cloneDeep(state.exchangeJobResults);
      let selectedExchangeJobsCopy = cloneDeep(state.selectedExchangeJobs);

      // From toggleJobSelection in search-results.helper (jobs specific)
      const exchangeJobMatch = exchangeJobResultsCopy.find(e => e.ExchangeJobId === exchangeJob.ExchangeJobId);
      exchangeJobMatch.IsSelected = !exchangeJobMatch.IsSelected;

      // From toggleValueInList in search-results.helper (jobs specific)
      const matchingValue = selectedExchangeJobsCopy.find(selectedEJ => selectedEJ.ExchangeJobId === exchangeJob.ExchangeJobId);
      if (!!matchingValue) {
        selectedExchangeJobsCopy = selectedExchangeJobsCopy.filter(selectedEJ => selectedEJ.ExchangeJobId !== matchingValue);
      } else {
        selectedExchangeJobsCopy.push(action.payload.exchangeJob);
      }
      return {
        ...state,
        exchangeJobResults: exchangeJobResultsCopy,
        selectedExchangeJobs: selectedExchangeJobsCopy
      };
    }
    case fromExchangeJobSearchActions.CLEAR_SELECTED_EXCHANGE_JOBS: {
      const exchangeJobResultsCopy = cloneDeep(state.exchangeJobResults).map(e => {
        e.IsSelected = false;
        return e;
      });
      return {
        ...state,
        exchangeJobResults: exchangeJobResultsCopy,
        selectedExchangeJobs: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getExchangeId = (state: State) => state.exchangeId;
export const getSelectedExchangeJobs = (state: State) => state.selectedExchangeJobs;
export const getSelectedExchangeJobsCount = (state: State) => state.selectedExchangeJobs.length;
export const getExchangeJobs = (state: State) => state.exchangeJobResults;
export const getNoResultsMessage = (state: State) => state.noResultsMessage;
