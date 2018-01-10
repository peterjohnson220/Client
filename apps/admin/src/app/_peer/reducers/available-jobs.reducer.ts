import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableJob } from 'libs/models/peer';
import * as fromAvailableJobsActions from '../actions/available-jobs.actions';
import { createGridReducer } from 'libs/common/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

// Extended entity state
export interface State extends EntityState<AvailableJob> {
  // TODO: Should this stuff also be in the grid reducer?
  total: number;
  loading: boolean;
  loadingError: boolean;
  // TODO: MOVE TO exchange-jobs reducer when avail -
  addModalOpen: boolean;
  adding: boolean;
  addingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<AvailableJob> = createEntityAdapter<AvailableJob>({
  selectId: (availableJob: AvailableJob) => availableJob.MDJobsBaseId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  total: 0,
  loading: false,
  loadingError: false,
  // TODO: MOVE TO exchange-jobs reducer when avail -
  addModalOpen: false,
  adding: false,
  addingError: false
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
      // TODO: MOVE TO exchange-jobs reducer when avail -
      case fromAvailableJobsActions.OPEN_ADD_EXCHANGE_JOBS_MODAL: {
        return {
          ...state,
          addModalOpen: true
        };
      }
      case fromAvailableJobsActions.CLOSE_ADD_EXCHANGE_JOBS_MODAL: {
        return {
          ...state,
          addModalOpen: false
        };
      }
      case fromAvailableJobsActions.ADDING_EXCHANGE_JOBS: {
        return {
          ...state,
          adding: true
        };
      }
      case fromAvailableJobsActions.ADDING_EXCHANGE_JOBS_SUCCESS: {
        return {
          ...state,
          adding: false,
          addModalOpen: false
        };
      }
      case fromAvailableJobsActions.ADDING_EXCHANGE_JOBS_ERROR: {
        return {
          ...state,
          adding: false,
          addingError: true
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
// TODO: MOVE TO exchange-jobs reducer when avail -
export const getAddModalOpen = (state: State) => state.addModalOpen;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
