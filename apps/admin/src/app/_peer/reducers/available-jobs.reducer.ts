import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableJob } from 'libs/models/peer';
import * as fromAvailableJobsActions from '../actions/available-jobs.actions';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';
import { EntitySelectors } from '@ngrx/entity/src/models';
// import { State } as test  from '@progress/kendo-data-query';

export interface GridState<T> extends EntityState<T> {
  gridState: any;
}

export interface GridStateAdapter<T> extends EntityAdapter<T> {
  getInitialState(): GridState<T>;
  getInitialState<S extends object>(state: S): GridState<T> & S;
  getSelectors(): EntitySelectors<T, EntityState<T>>;
  getSelectors<V>(selectState: (state: V) => GridState<T>): EntitySelectors<T, V>;
}
// Extended entity state
export interface State extends EntityState<AvailableJob> {
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
export function reducer(
  state = initialState,
  action: fromAvailableJobsActions.Actions
): State {
  switch (action.type) {
    case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromAvailableJobsActions.LOADING_AVAILABLE_JOBS_SUCCESS: {
      const companies: AvailableJob[] = action.payload.data;
      return {
        ...adapter.addAll(companies, state),
        total: action.payload.total,
        loading: false
      };
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
}

// Selector Functions
export const getTotal = (state: State) => state.total;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
// TODO: MOVE TO exchange-jobs reducer when avail -
export const getAddModalOpen = (state: State) => state.addModalOpen;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
