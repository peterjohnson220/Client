import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTabularReportExportSchedulerPageReducer from './tabular-report-export-scheduler-page.reducer';

// Feature area state
export interface TabularReportManagementMainState {
  tabularReportExportSchedulerPage: fromTabularReportExportSchedulerPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  tabularReportManagement_main: TabularReportManagementMainState;
}

// Feature area reducers
export const reducers = {
  tabularReportExportSchedulerPage: fromTabularReportExportSchedulerPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<TabularReportManagementMainState>('tabularReportManagement_main');

// Feature Selectors
export const selectTabularReportExportSchedulerPageState = createSelector(
  selectFeatureAreaState,
  (state: TabularReportManagementMainState) => state.tabularReportExportSchedulerPage
);

// Tabular Report Export Scheduler Management Page
export const getTabularReportsAsync = createSelector(
  selectTabularReportExportSchedulerPageState,
  fromTabularReportExportSchedulerPageReducer.getTabularReportsAsync
);

export const getSavedSchedulesAsync = createSelector(
  selectTabularReportExportSchedulerPageState,
  fromTabularReportExportSchedulerPageReducer.getSavedSchedulesAsync
);

export const getSavingSchedule = createSelector(
  selectTabularReportExportSchedulerPageState,
  fromTabularReportExportSchedulerPageReducer.getSavingSchedule
);

export const getSavingScheduleError = createSelector(
  selectTabularReportExportSchedulerPageState,
  fromTabularReportExportSchedulerPageReducer.getSavingScheduleError
);

export const getShowDeleteModal = createSelector(
  selectTabularReportExportSchedulerPageState,
  fromTabularReportExportSchedulerPageReducer.getShowDeleteModal
);
