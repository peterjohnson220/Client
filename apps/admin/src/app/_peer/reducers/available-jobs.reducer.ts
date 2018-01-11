import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableJob } from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/common/core/reducers/grid.reducer';

import * as fromAvailableJobsActions from '../actions/available-jobs.actions';

// Extended entity state
export interface State extends EntityState<AvailableJob> {
  total: number;
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<AvailableJob> = createEntityAdapter<AvailableJob>({
  selectId: (availableJob: AvailableJob) => availableJob.MDJobsBaseId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  total: 0,
  loading: false,
  loadingError: false
});

// Reducer
export const reducer = createGridReducer(
  GridTypeEnum.AvailableJobs,
  (state = initialState, action: fromAvailableJobsActions.Actions): State => {
    switch (action.type) {
      case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS: {
        return {
          ...adapter.removeAll(state),
          loading: true,
          loadingError: false
        };
      }
      case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS_SUCCESS: {
        const jobs: AvailableJob[] = action.payload.data;
        const newState = {
          ...adapter.addAll(jobs, state),
          total: action.payload.total,
          loading: false
        };
        return newState;
      }
      case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS_ERROR: {
        return {
          ...state,
          loading: false,
          loadingError: true
        };
      }
      default: {
        return state;
      }
    }
});

// Selector Functions
export const getTotal = (state: State) => state.total;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
