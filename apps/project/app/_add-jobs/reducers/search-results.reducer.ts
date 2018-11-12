import * as cloneDeep from 'lodash.clonedeep';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import { JobResult } from '../models';
import { toggleJobSelection, updateSelectedJobIds } from '../helpers';

export interface State {
  jobs: JobResult[];
  selectedJobIds: number[];
  totalResultsOnServer: number;
  loadingMoreResults: boolean;
}

const initialState: State = {
  jobs: [],
  selectedJobIds: [],
  totalResultsOnServer: 0,
  loadingMoreResults: false
};

export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.GET_MORE_RESULTS:
      return {
        ...state,
        loadingMoreResults: true
      };
    case fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS:
      return {
        ...state,
        jobs: state.jobs.concat(action.payload),
        loadingMoreResults: false
      };
    case fromSearchResultsActions.TOGGLE_JOB_SELECTION:
      const jobsCopy = cloneDeep(state.jobs);
      const selectedJobIdsCopy = cloneDeep(state.selectedJobIds);
      toggleJobSelection(jobsCopy, action.payload);
      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: updateSelectedJobIds(selectedJobIdsCopy, action.payload)
      };
    default:
      return state;
  }
}

export const getJobs = (state: State) => state.jobs;
export const getSelectedJobIds = (state: State) => state.selectedJobIds;
export const getLoadingMoreResults = (state: State) => state.loadingMoreResults;
export const hasMoreResultsOnServer = (state: State) => state.totalResultsOnServer > state.jobs.length;
