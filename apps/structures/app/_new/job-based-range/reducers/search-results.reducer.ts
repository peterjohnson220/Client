import * as cloneDeep from 'lodash.clonedeep';

import { JobResult } from 'libs/features/add-jobs/models';
import { toggleJobSelection, updateSelectedJobIds, updateSelectedJobCodes } from 'libs/features/add-jobs/helpers';

import * as fromSearchResultsActions from '../actions/search-results.actions';

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
    case fromSearchResultsActions.TOGGLE_JOB_SELECTION: {
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
    }
    case fromSearchResultsActions.REPLACE_JOB_RESULTS: {
      return {
        ...state,
        jobs: setIsSelected(cloneDeep(action.payload), state.selectedJobIds, state.selectedPayfactorsJobCodes)
      };
    }
    case fromSearchResultsActions.ADD_JOB_RESULTS: {
      return {
        ...state,
        jobs: state.jobs.concat(setIsSelected(cloneDeep(action.payload), state.selectedJobIds, state.selectedPayfactorsJobCodes))
      };
    }
    case fromSearchResultsActions.CLEAR_SELECTED_JOBS: {
      const jobsCopy = cloneDeep(state.jobs).map(j => {
        j.IsSelected = false;
        return j;
      });

      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: [],
        selectedPayfactorsJobCodes: []
      };
    }
    case fromSearchResultsActions.LOAD_JOB_PRICING_DATA: {
      const jobsCopy = cloneDeep(state.jobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload.Id);
      if (jobToUpdate) {
        jobToUpdate.PricingDataLoading = true;
      }

      return {
        ...state,
        jobs: jobsCopy
      };
    }
    case fromSearchResultsActions.LOAD_JOB_PRICING_DATA_SUCCESS: {
      const jobsCopy = cloneDeep(state.jobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload.jobId);
      if (jobToUpdate) {
        jobToUpdate.PricingDataLoading = false;
        jobToUpdate.PricingDataLoaded = true;
        jobToUpdate.TCCMRP = action.payload.data.TccMrp;
        jobToUpdate.BaseMRP = action.payload.data.Base50Mrp;
      }
      return {
        ...state,
        jobs: jobsCopy
      };
    }
    case fromSearchResultsActions.LOAD_JOB_PRICING_DATA_ERROR: {
      const jobsCopy = cloneDeep(state.jobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload);
      if (jobToUpdate) {
        jobToUpdate.PricingDataLoading = false;
        jobToUpdate.PricingDataLoaded = false;
      }
      return {
        ...state,
        jobs: jobsCopy
      };
    }
    case fromSearchResultsActions.TOGGLE_JOB_DETAIL: {
      const jobsCopy = cloneDeep(state.jobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload.Id);
      if (jobToUpdate) {
        jobToUpdate.ShowJobDetail = !jobToUpdate.ShowJobDetail;
      }
      return {
        ...state,
        jobs: jobsCopy
      };
    }
    case fromSearchResultsActions.RESET: {
      return initialState;
    }
    default:
      return state;
  }
}

function setIsSelected(jobResults: JobResult[], selectedJobIds: string[], selectedPayfactorsJobCodes: string[]): JobResult[] {
  jobResults.filter(jr => jr.IsPayfactorsJob).map(jr => {
    jr.IsSelected = selectedPayfactorsJobCodes.some(pfjc => pfjc === jr.Code);
    return jr;
  });

  jobResults.filter(jr => !jr.IsPayfactorsJob).map(jr => {
    jr.IsSelected = selectedJobIds.some(sji => sji === jr.Id);
    return jr;
  });

  return jobResults;
}

export const getJobs = (state: State) => state.jobs;
export const getSelectedJobIds = (state: State) => state.selectedJobIds;
export const getSelectedPayfactorsJobCodes = (state: State) => state.selectedPayfactorsJobCodes;
