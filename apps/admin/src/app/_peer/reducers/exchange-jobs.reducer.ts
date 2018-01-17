import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJob } from 'libs/models';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/common/core/reducers/grid.reducer';

import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';

// Extended entity state
export interface State extends EntityState<ExchangeJob> {
  loading: boolean;
  loadingError: boolean;
  addModalOpen: boolean;
  adding: boolean;
  addingError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeJob> = createEntityAdapter<ExchangeJob>({
  selectId: (exchangeJob: ExchangeJob) => exchangeJob.ExchangeJob_ID
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  addModalOpen: false,
  adding: false,
  addingError: false,
  total: 0
});

// Reducer
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeJobs,
    (featureState = initialState, featureAction: fromExchangeJobsActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeJobsActions.LOADING_EXCHANGE_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobsActions.LOADING_EXCHANGE_JOBS_SUCCESS: {
          const jobs: ExchangeJob[] = featureAction.payload.data;
          return {
            ...adapter.addAll(jobs, featureState),
            loading: false,
            total: featureAction.payload.total,
          };
        }
        case fromExchangeJobsActions.LOADING_EXCHANGE_JOBS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromExchangeJobsActions.OPEN_ADD_EXCHANGE_JOBS_MODAL: {
          return {
            ...featureState,
            addModalOpen: true
          };
        }
        case fromExchangeJobsActions.CLOSE_ADD_EXCHANGE_JOBS_MODAL: {
          return {
            ...featureState,
            addModalOpen: false
          };
        }
        case fromExchangeJobsActions.ADDING_EXCHANGE_JOBS: {
          return {
            ...featureState,
            adding: true
          };
        }
        case fromExchangeJobsActions.ADDING_EXCHANGE_JOBS_SUCCESS: {
          return {
            ...featureState,
            adding: false,
            addModalOpen: false
          };
        }
        case fromExchangeJobsActions.ADDING_EXCHANGE_JOBS_ERROR: {
          return {
            ...featureState,
            adding: false,
            addingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    })(state, action);
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAddModalOpen = (state: State) => state.addModalOpen;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
export const getTotal = (state: State) => state.total;
