import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableJob } from 'libs/models/peer';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

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
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.AvailableJobs,
    (featureState = initialState, featureAction: fromAvailableJobsActions.Actions): State => {
      switch (featureAction.type) {
        case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS_SUCCESS: {
          const jobs: AvailableJob[] = featureAction.payload.data;
          return {
            ...adapter.setAll(jobs, featureState),
            total: featureAction.payload.total,
            loading: false
          };
        }
        case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    }, {take: 8})(state, action);
}

// Selector Functions
export const getTotal = (state: State) => state.total;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
