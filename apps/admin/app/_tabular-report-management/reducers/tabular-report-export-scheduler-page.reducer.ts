import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { Workbook, TabularReportExportSchedule } from 'libs/features/reports/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromTabularReportExportSchedulerPageActions from '../actions/tabular-report-export-scheduler-page.actions';

export interface State {
  tabularReportsAsync: AsyncStateObj<Workbook[]>;
  savedSchedules: AsyncStateObj<TabularReportExportSchedule[]>;
  savingSchedule: boolean;
  savingScheduleError: string;
}

const initialState: State = {
  tabularReportsAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  savedSchedules: generateDefaultAsyncStateObj<TabularReportExportSchedule[]>([]),
  savingSchedule: false,
  savingScheduleError: null
};

export function reducer(state = initialState, action: fromTabularReportExportSchedulerPageActions.Actions): State {
  switch (action.type) {
    case fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS: {
      const tabularReportsAsyncClone = cloneDeep(state.tabularReportsAsync);
      tabularReportsAsyncClone.loading = true;
      tabularReportsAsyncClone.obj = null;
      tabularReportsAsyncClone.loadingError = false;

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    case fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS_SUCCESS: {
      const tabularReportsAsyncClone: AsyncStateObj<Workbook[]> = cloneDeep(state.tabularReportsAsync);
      tabularReportsAsyncClone.loading = false;
      tabularReportsAsyncClone.obj = action.payload;

      if (state.savedSchedules?.obj?.length > 0) {
        const scheduledReports = state.savedSchedules.obj.map(x => x.DataViewId.toString());
        tabularReportsAsyncClone.obj = action.payload.filter(x => !scheduledReports.includes(x.WorkbookId));
      }

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    case fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS_ERROR: {
      const tabularReportsAsyncClone = cloneDeep(state.tabularReportsAsync);
      tabularReportsAsyncClone.loading = false;
      tabularReportsAsyncClone.loadingError = true;

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    case fromTabularReportExportSchedulerPageActions.GET_SAVED_SCHEDULES: {
      return AsyncStateObjHelper.loading(state, 'savedSchedules');
    }
    case fromTabularReportExportSchedulerPageActions.GET_SAVED_SCHEDULES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'savedSchedules', action.payload);
    }
    case fromTabularReportExportSchedulerPageActions.GET_SAVED_SCHEDULES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'savedSchedules');
    }
    case fromTabularReportExportSchedulerPageActions.SAVE_SCHEDULE: {
      return {
        ...state,
        savingSchedule: true,
        savingScheduleError: null
      };
    }
    case fromTabularReportExportSchedulerPageActions.SAVE_SCHEDULE_SUCCESS: {
      return {
        ...state,
        savingSchedule: false
      };
    }
    case fromTabularReportExportSchedulerPageActions.SAVE_SCHEDULE_ERROR: {
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

export const getTabularReportsAsync = (state: State) => state.tabularReportsAsync;
export const getSavedSchedulesAsync = (state: State) => state.savedSchedules;
export const getSavingSchedule = (state: State) => state.savingSchedule;
export const getSavingScheduleError = (state: State) => state.savingScheduleError;
