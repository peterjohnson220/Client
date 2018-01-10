import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJob } from 'libs/models';

import * as fromExchangeJobsActions from '../actions/exchange-jobs.actions';

// Extended entity state
export interface State extends EntityState<ExchangeJob> {
  loading: boolean;
  loadingError: boolean;
  addModalOpen: boolean;
  adding: boolean;
  addingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeJob> = createEntityAdapter<ExchangeJob>({
  selectId: (exchangeJob: ExchangeJob) => exchangeJob.ExchangeJobId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  addModalOpen: false,
  adding: false,
  addingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeJobsActions.Actions
): State {
  switch (action.type) {
    case fromExchangeJobsActions.LOADING_EXCHANGE_JOBS: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeJobsActions.LOADING_EXCHANGE_JOBS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeJobsActions.LOADING_EXCHANGE_JOBS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeJobsActions.OPEN_ADD_EXCHANGE_JOBS_MODAL: {
      return {
        ...state,
        addModalOpen: true
      };
    }
    case fromExchangeJobsActions.CLOSE_ADD_EXCHANGE_JOBS_MODAL: {
      return {
        ...state,
        addModalOpen: false
      };
    }
    case fromExchangeJobsActions.ADDING_EXCHANGE_JOBS: {
      return {
        ...state,
        adding: true
      };
    }
    case fromExchangeJobsActions.ADDING_EXCHANGE_JOBS_SUCCESS: {
      return {
        ...state,
        adding: false,
        addModalOpen: false
      };
    }
    case fromExchangeJobsActions.ADDING_EXCHANGE_JOBS_ERROR: {
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
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAddModalOpen = (state: State) => state.addModalOpen;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
