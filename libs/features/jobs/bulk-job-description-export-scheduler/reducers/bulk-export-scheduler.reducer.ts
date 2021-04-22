import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import isObject from 'lodash/isObject';

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
  bulkScheduleDeleteModalOpen: boolean;
  editing: boolean;
  editSchedule: BulkExportSchedule;
  updating: boolean;
  updatingError: boolean;
  updatingSuccess: boolean;
  jdmExportUrl: string;
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
  removingError: false,
  bulkScheduleDeleteModalOpen: false,
  editing: false,
  editSchedule: null,
  updating: false,
  updatingError: false,
  updatingSuccess: false,
  jdmExportUrl: null,
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
    case fromBulkExportScheduleActions.CLOSE_SCHEDULE_MODAL: {
      return {
        ...state,
        bulkScheduleDeleteModalOpen: false
      };
    }
    case fromBulkExportScheduleActions.OPEN_SCHEDULE_MODAL: {
      return {
        ...state,
        bulkScheduleDeleteModalOpen: true
      };
    }
    case fromBulkExportScheduleActions.EDIT_SCHEDULE: {
      return {
        ...state,
        editing: isObject(action.payload),
        editSchedule: action.payload,
      };
    }
    case fromBulkExportScheduleActions.UPDATE_SCHEDULE: {
      return {
        ...state,
        updating: true,
        updatingError: false,
        updatingSuccess: false,
      };
    }
    case fromBulkExportScheduleActions.UPDATE_SCHEDULE_ERROR: {
      return {
        ...state,
        updating: false,
        updatingError: true,
        updatingSuccess: false,
      };
    }
    case fromBulkExportScheduleActions.UPDATE_SCHEDULE_SUCCESS: {
      return {
        ...state,
        editing: false,
        editSchedule: null,
        updating: false,
        updatingError: false,
        updatingSuccess: true,
      };
    }
    case fromBulkExportScheduleActions.GET_JDM_EXPORT_URL: {
      return {
        ...state,
        jdmExportUrl: null,
      };
    }
    case fromBulkExportScheduleActions.GET_JDM_EXPORT_URL_SUCCESS: {
      return {
        ...state,
        jdmExportUrl: action.payload,
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
export const getBulkScheduleDeleteModalOpen = (state: State) => state.bulkScheduleDeleteModalOpen;
export const getEditing = (state: State) => state.editing;
export const getEditSchedule = (state: State) => state.editSchedule;
export const getUpdating = (state: State) => state.updating;
export const getUpdatingError = (state: State) => state.updatingError;
export const getJdmExportUrl = (state: State) => state.jdmExportUrl;
