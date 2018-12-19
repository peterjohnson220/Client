import * as cloneDeep from 'lodash.clonedeep';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import { JobResult } from '../models';
import { toggleJobSelection, updateSelectedJobIds, updateSelectedJobCodes } from '../helpers';

export interface State {
  jobs: JobResult[];
  selectedJobIds: string[];
  selectedPayfactorsJobCodes: string[];
}

const initialState: State = {
  jobs: [],
  selectedJobIds: [],
  selectedPayfactorsJobCodes: []
};

export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.TOGGLE_JOB_SELECTION:
      const jobsCopy = cloneDeep(state.jobs);
      let selectedJobIdsCopy = cloneDeep(state.selectedJobIds);
      let selectedJobCodesCopy = cloneDeep(state.selectedPayfactorsJobCodes);
      toggleJobSelection(jobsCopy, action.payload);
      if (action.payload.IsPayfactorsJob) {
        selectedJobCodesCopy = updateSelectedJobCodes(selectedJobCodesCopy, action.payload);
      } else {
        selectedJobIdsCopy = updateSelectedJobIds(selectedJobIdsCopy, action.payload);
      }
      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: selectedJobIdsCopy,
        selectedPayfactorsJobCodes: selectedJobCodesCopy
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
        selectedJobIds: [],
        selectedPayfactorsJobCodes: []
      };
    }
    default:
      return state;
  }
}

export const getJobs = (state: State) => state.jobs;
export const getSelectedJobIds = (state: State) => state.selectedJobIds;
export const getSelectedPayfactorsJobCodes = (state: State) => state.selectedPayfactorsJobCodes;
