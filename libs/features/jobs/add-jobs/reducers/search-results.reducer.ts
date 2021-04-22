import cloneDeep from 'lodash/cloneDeep';

import { toggleJobSelection, updateSelectedJobCodes, updateSelectedJobIds } from 'libs/features/jobs/add-jobs/helpers';
import { JobResult } from 'libs/features/jobs/add-jobs/models';

import * as fromSearchResultsActions from '../actions/search-results.actions';

export interface State {
  jobs: JobResult[];
  selectedJobIds: string[];
  selectedPayfactorsJobCodes: string[];
  allLoadedJobs: JobResult[];
}

const initialState: State = {
  jobs: [],
  selectedJobIds: [],
  selectedPayfactorsJobCodes: [],
  allLoadedJobs: []
};

export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.TOGGLE_JOB_SELECTION: {
      const jobsCopy = cloneDeep(state.jobs);
      const allLoadedJobsCopy = cloneDeep(state.allLoadedJobs);
      let selectedJobIdsCopy = cloneDeep(state.selectedJobIds);
      let selectedJobCodesCopy = cloneDeep(state.selectedPayfactorsJobCodes);
      toggleJobSelection(jobsCopy, action.payload);
      toggleJobSelection(allLoadedJobsCopy, action.payload);
      if (action.payload.IsPayfactorsJob) {
        selectedJobCodesCopy = updateSelectedJobCodes(selectedJobCodesCopy, action.payload);
      } else {
        selectedJobIdsCopy = updateSelectedJobIds(selectedJobIdsCopy, action.payload);
      }
      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: selectedJobIdsCopy,
        selectedPayfactorsJobCodes: selectedJobCodesCopy,
        allLoadedJobs: allLoadedJobsCopy
      };
    }
    case fromSearchResultsActions.REPLACE_JOB_RESULTS: {
      const jobsToAdd = setIsSelected(cloneDeep(action.payload), state.selectedJobIds, state.selectedPayfactorsJobCodes);

      return {
        ...state,
        jobs: setIsSelected(cloneDeep(action.payload), state.selectedJobIds, state.selectedPayfactorsJobCodes),
        allLoadedJobs: state.allLoadedJobs.concat(jobsToAdd.filter(j => state.allLoadedJobs.every(x => x.Id !== j.Id)))
      };
    }
    case fromSearchResultsActions.ADD_JOB_RESULTS: {
      return {
        ...state,
        jobs: state.jobs.concat(setIsSelected(cloneDeep(action.payload), state.selectedJobIds, state.selectedPayfactorsJobCodes)),
        allLoadedJobs: state.allLoadedJobs.concat(setIsSelected(cloneDeep(action.payload), state.selectedJobIds, state.selectedPayfactorsJobCodes))
      };
    }
    case fromSearchResultsActions.CLEAR_SELECTED_JOBS: {
      const jobsCopy = cloneDeep(state.jobs).map(j => {
        j.IsSelected = false;
        return j;
      });
      const allLoadedJobsCopy = cloneDeep(state.jobs).map(j => {
        j.IsSelected = false;
        return j;
      });

      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: [],
        selectedPayfactorsJobCodes: [],
        allLoadedJobs: allLoadedJobsCopy
      };
    }
    case fromSearchResultsActions.SELECT_ALL_JOBS: {
      const jobsCopy = cloneDeep(state.jobs).map(j => {
        j.IsSelected = true;
        return j;
      });

      const allLoadedJobsCopy = cloneDeep(state.allLoadedJobs).map(j => {
        state.jobs.forEach((job) => {
          if (job.Id === j.Id) {
            j.IsSelected = true;
          }
        });
        return j;
      });

      return {
        ...state,
        jobs: jobsCopy,
        selectedJobIds: jobsCopy.filter(j => !j.IsPayfactorsJob).map(j => j.Id),
        selectedPayfactorsJobCodes: jobsCopy.filter(j => j.IsPayfactorsJob).map(j => j.Code),
        allLoadedJobs: allLoadedJobsCopy
      };
    }
    case fromSearchResultsActions.LOAD_JOB_PRICING_DATA: {
      const jobsCopy = cloneDeep(state.jobs);
      const allLoadedJobsCopy = cloneDeep(state.allLoadedJobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload.Id);
      if (jobToUpdate) {
        jobToUpdate.PricingDataLoading = true;
      }

      return {
        ...state,
        jobs: jobsCopy,
        allLoadedJobs: allLoadedJobsCopy
      };
    }
    case fromSearchResultsActions.LOAD_JOB_PRICING_DATA_SUCCESS: {
      const jobsCopy = cloneDeep(state.jobs);
      const allLoadedJobsCopy = cloneDeep(state.allLoadedJobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload.jobId);
      if (jobToUpdate) {
        jobToUpdate.PricingDataLoading = false;
        jobToUpdate.PricingDataLoaded = true;
        jobToUpdate.TCCMRP = action.payload.data.TccMrp;
        jobToUpdate.BaseMRP = action.payload.data.Base50Mrp;
      }
      return {
        ...state,
        jobs: jobsCopy,
        allLoadedJobs: allLoadedJobsCopy
      };
    }
    case fromSearchResultsActions.LOAD_JOB_PRICING_DATA_ERROR: {
      const jobsCopy = cloneDeep(state.jobs);
      const allLoadedJobsCopy = cloneDeep(state.allLoadedJobs);
      const jobToUpdate = jobsCopy.find(x => x.Id === action.payload);
      if (jobToUpdate) {
        jobToUpdate.PricingDataLoading = false;
        jobToUpdate.PricingDataLoaded = false;
      }
      return {
        ...state,
        jobs: jobsCopy,
        allLoadedJobs: allLoadedJobsCopy
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

function filterSelectedJobs(state: State) {
  return state.jobs.filter(j => j.IsSelected);
}

function filterSelectedAllLoadedJobs(state: State) {
  return state.allLoadedJobs.filter(j => j.IsSelected);
}

export const getJobs = (state: State) => state.jobs;
export const getJobCount = (state: State) => state.jobs.length;
export const getSelectedJobIds = (state: State) => state.selectedJobIds;
export const getSelectedJobs = (state: State) => filterSelectedJobs(state);
export const getSelectedPayfactorsJobCodes = (state: State) => state.selectedPayfactorsJobCodes;
export const getAllLoadedJobs = (state: State) => state.allLoadedJobs;
export const getSelectedAllLoadedJobs = (state: State) => filterSelectedAllLoadedJobs(state);
