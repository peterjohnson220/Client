import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { Workbook, TabularReportExportSchedule } from 'libs/features/surveys/reports/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { DataViewAccessLevel } from 'libs/models/payfactors-api';

import * as fromTabularReportExportSchedulerPageActions from '../actions/tabular-report-export-scheduler-page.actions';

export interface State {
  tabularReportsAsync: AsyncStateObj<Workbook[]>;
  originalTabularReportsAsync: AsyncStateObj<Workbook[]>;
  savedSchedules: AsyncStateObj<TabularReportExportSchedule[]>;
  savingSchedule: boolean;
  savingScheduleError: string;
  showDeleteModal: boolean;
}

const initialState: State = {
  tabularReportsAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  originalTabularReportsAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  savedSchedules: generateDefaultAsyncStateObj<TabularReportExportSchedule[]>([]),
  savingSchedule: false,
  savingScheduleError: null,
  showDeleteModal: false
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
      const originalTabularReportsAsyncClone: AsyncStateObj<Workbook[]> = cloneDeep(state.originalTabularReportsAsync);
      tabularReportsAsyncClone.loading = false;
      tabularReportsAsyncClone.obj = action.payload.filter(x => x.AccessLevel === DataViewAccessLevel.Owner);
      originalTabularReportsAsyncClone.obj = tabularReportsAsyncClone.obj;

      if (state.savedSchedules?.obj?.length > 0) {
        const scheduledReports = state.savedSchedules.obj.map(x => x.DataViewId.toString());
        tabularReportsAsyncClone.obj = tabularReportsAsyncClone.obj.filter(x => !scheduledReports.includes(x.WorkbookId));
      }

      tabularReportsAsyncClone.obj = orderBy(tabularReportsAsyncClone.obj, ['WorkbookName'], ['asc']);

      return {
        ...state,
        tabularReportsAsync: tabularReportsAsyncClone,
        originalTabularReportsAsync: originalTabularReportsAsyncClone
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
    case fromTabularReportExportSchedulerPageActions.SHOW_DELETE_MODAL: {
      return {
        ...state,
        showDeleteModal: action.payload,
      };
    }
    case fromTabularReportExportSchedulerPageActions.DELETE_EXPORT_SCHEDULE_SUCCESS: {
      const savedSchedulesClone = cloneDeep(state.savedSchedules);
      const tabularReportsAsyncClone = cloneDeep(state.tabularReportsAsync);
      const deletedTabularReport = state.originalTabularReportsAsync.obj.find(x => x.WorkbookId === action.payload.toString());
      savedSchedulesClone.obj = savedSchedulesClone.obj.filter(x => x.DataViewId !== action.payload);

      tabularReportsAsyncClone.obj.push(deletedTabularReport);
      tabularReportsAsyncClone.obj = orderBy(tabularReportsAsyncClone.obj, ['WorkbookName'], ['asc']);
      return {
        ...state,
        savedSchedules: savedSchedulesClone,
        tabularReportsAsync: tabularReportsAsyncClone
      };
    }
    case fromTabularReportExportSchedulerPageActions.UPDATE_EXPORT_SCHEDULE_SUCCESS: {
      const savedSchedulesClone = cloneDeep(state.savedSchedules);
      const matchingScheduleIndex = savedSchedulesClone.obj.findIndex(x => x.DataViewId === action.payload.DataViewId);
      if (matchingScheduleIndex !== -1) {
        savedSchedulesClone.obj[matchingScheduleIndex] = action.payload;
      }
      return {
        ...state,
        savedSchedules: savedSchedulesClone
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
export const getShowDeleteModal = (state: State) => state.showDeleteModal;
