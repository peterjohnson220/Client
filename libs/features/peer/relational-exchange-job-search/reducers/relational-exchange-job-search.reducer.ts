import { RelationalExchangeJobResult } from 'libs/models';

import * as fromRelationalExchangeJobSearchActions from '../actions/relational-exchange-job-search.actions';
import { RelationalExchangeJobSearchSelectorHelper } from '../helpers';

export interface State {
  exchangeId: number;
  exchangeJobResults: RelationalExchangeJobResult[];
  selectedExchangeJobs: RelationalExchangeJobResult[];
  noResultsMessage: string;
}

export const initialState: State = {
  exchangeId: 0,
  exchangeJobResults: [],
  selectedExchangeJobs: [],
  noResultsMessage: null
};

export function reducer(state = initialState, action: fromRelationalExchangeJobSearchActions.RelationalExchangeJobSearchActions): State {
  switch (action.type) {
    case fromRelationalExchangeJobSearchActions.SET_CONTEXT: {
      return {
        ...state,
        exchangeId: action.payload.exchangeId
      };
    }
    case fromRelationalExchangeJobSearchActions.RESET_STATE: {
      return {
        ...initialState
      };
    }
    case fromRelationalExchangeJobSearchActions.REPLACE_EXCHANGE_JOB_RESULTS: {
      return {
        ...state,
        exchangeJobResults: RelationalExchangeJobSearchSelectorHelper.applyExchangeJobSelections(
          action.payload.exchangeJobResults,
          state.selectedExchangeJobs
        ),
        noResultsMessage: action.payload.noResultsMessage
      };
    }
    case fromRelationalExchangeJobSearchActions.ADD_EXCHANGE_JOB_RESULTS: {
      const newExchangeJobResults = RelationalExchangeJobSearchSelectorHelper.applyExchangeJobSelections(
        action.payload.exchangeJobResults,
        state.selectedExchangeJobs
      );
      return {
        ...state,
        exchangeJobResults: state.exchangeJobResults.concat(newExchangeJobResults),
        noResultsMessage: action.payload.noResultsMessage
      };
    }
    case fromRelationalExchangeJobSearchActions.CLEAR_EXCHANGE_JOB_RESULTS: {
      return {
        ...state,
        exchangeJobResults: [],
        noResultsMessage: null
      };
    }
    case fromRelationalExchangeJobSearchActions.TOGGLE_EXCHANGE_JOB_SELECTION: {
      const selectionToggledResults = RelationalExchangeJobSearchSelectorHelper.toggleExchangeJobSelection(
        action.payload.exchangeJob,
        state.exchangeJobResults,
        state.selectedExchangeJobs
      );

      return {
        ...state,
        exchangeJobResults: selectionToggledResults.ExchangeJobResults,
        selectedExchangeJobs: selectionToggledResults.ExchangeJobSelections
      };
    }
    case fromRelationalExchangeJobSearchActions.CLEAR_SELECTED_EXCHANGE_JOBS: {
      return {
        ...state,
        exchangeJobResults: RelationalExchangeJobSearchSelectorHelper.clearSelectedExchangeJobResults(state.exchangeJobResults),
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
