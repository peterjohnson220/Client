import * as cloneDeep from 'lodash.clonedeep';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import { JobResult } from '../models';
import { toggleJobSelection, updateSelectedJobIds } from '../helpers';

export interface State {
  jobs: JobResult[];
  selectedJobIds: string[];
}

const initialState: State = {
  jobs: [],
  selectedJobIds: []
};

export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.TOGGLE_JOB_SELECTION:
      const jobsCopy = cloneDeep(state.jobs);
      const selectedJobIdsCopy = cloneDeep(state.selectedJobIds);
      toggleJobSelection(jobsCopy, action.payload);
      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: updateSelectedJobIds(selectedJobIdsCopy, action.payload)
      };
    case fromSearchResultsActions.REPLACE_JOB_RESULTS: {
      return {
        ...state,
        jobs: action.payload
      };
    }
    case fromSearchResultsActions.ADD_JOB_RESULTS: {
      return {
        ...state,
        jobs: state.jobs.concat(action.payload)
      };
    }
    case fromSearchResultsActions.CLEAR_SELECTED_JOBS: {
      return {
        ...state,
        selectedJobIds: []
      };
    }
    default:
      return state;
  }
}

export const getJobs = (state: State) => state.jobs;
export const getSelectedJobIds = (state: State) => state.selectedJobIds;
