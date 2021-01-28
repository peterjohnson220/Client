import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { TabularReportExportSchedule } from 'libs/features/reports/models/tabular-report-export-schedule.model';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromScheduleExportModalActions from '../actions/schedule-export-modal.actions';

export interface State {
  savedSchedules: AsyncStateObj<TabularReportExportSchedule[]>;
  savingSchedule: boolean;
  savingScheduleSuccess: boolean;
  savingScheduleError: string;
  loadingErrorResponse: string;
}

const initialState: State = {
  savedSchedules: generateDefaultAsyncStateObj<TabularReportExportSchedule[]>([]),
  savingSchedule: false,
  savingScheduleSuccess: false,
  savingScheduleError: null,
  loadingErrorResponse: null
};

export function reducer(state = initialState, action: fromScheduleExportModalActions.Actions): State {
  switch (action.type) {
    case fromScheduleExportModalActions.GET_SAVED_SCHEDULES: {
      return AsyncStateObjHelper.loading(state, 'savedSchedules');
    }
    case fromScheduleExportModalActions.GET_SAVED_SCHEDULES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'savedSchedules', action.payload);
    }
    case fromScheduleExportModalActions.GET_SAVED_SCHEDULES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'savedSchedules');
    }
    case fromScheduleExportModalActions.SAVE_SCHEDULE: {
      return {
        ...state,
        savingSchedule: true,
        savingScheduleError: null
      };
    }
    case fromScheduleExportModalActions.SAVE_SCHEDULE_SUCCESS: {
      return {
        ...state,
        savingSchedule: false,
        savingScheduleSuccess: true
      };
    }
    case fromScheduleExportModalActions.SAVE_SCHEDULE_ERROR: {
      return {
        ...state,
        savingSchedule: false,
        savingScheduleError: 'Error saving schedule.'
      };
    }
    default:
      return state;
  }
}

export const getSavedSchedulesAsync = (state: State) => state.savedSchedules;
export const getSavingSchedule = (state: State) => state.savingSchedule;
export const getSavingScheduleSuccess = (state: State) => state.savingScheduleSuccess;
export const getSavingScheduleError = (state: State) => state.savingScheduleError;
