import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { BulkExportSchedule } from 'libs/models/jdm';

// Import all exports from our feature's actions
import * as fromBulkExportScheduleActions from '../actions/bulk-export-schedule.actions';

// Define our feature state
export interface State extends EntityState<BulkExportSchedule> {
  loading: boolean;
  loadingError: boolean;
  adding: boolean;
  addingError: boolean;
  removing: boolean;
  removingError: boolean;
}

export const adapter: EntityAdapter<BulkExportSchedule> = createEntityAdapter<BulkExportSchedule>({
  selectId: (schedule: BulkExportSchedule) => schedule.FileName
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  adding: false,
  addingError: false,
  removing: false,
  removingError: false
});


// Reducer function
export function reducer(
  state = initialState,
  action: fromBulkExportScheduleActions.BulkExportJobsSchedulerActions): State {
  switch (action.type) {
    case fromBulkExportScheduleActions.ADDING_SCHEDULE: {
      return {
        ...state,
        adding: true,
      };
    }
    case fromBulkExportScheduleActions.ADDING_SCHEDULE_ERROR: {
      return {
        ...state,
        adding: false,
        addingError: true
      };
    }
    case  fromBulkExportScheduleActions.ADDING_SCHEDULE_SUCCESS: {
      return {
        ...state,
        adding: false
      };
    }
    case fromBulkExportScheduleActions.LOADING_SCHEDULE: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromBulkExportScheduleActions.LOADING_SCHEDULE_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false
      };
    }
    case fromBulkExportScheduleActions.LOADING_SCHEDULE_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromBulkExportScheduleActions.REMOVING_SCHEDULE: {
      return {
        ...state,
        removing: true,
        removingError: false
      };
    }
    case fromBulkExportScheduleActions.REMOVING_SCHEDULE_SUCCESS: {
      return {
        ...state,
        removing: false
      };
    }
    case fromBulkExportScheduleActions.REMOVING_SCHEDULE_ERROR: {
      return {
        ...state,
        removing: false,
        removingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
export const getRemoving = (state: State) => state.loading;
export const getRemovingError = (state: State) => state.loadingError;
