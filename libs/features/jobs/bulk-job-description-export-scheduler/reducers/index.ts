import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromViewReducer from './view.reducer';
import * as fromFilterReducer from './filter.reducer';
import * as fromBulkExportSchedulerReducer from './bulk-export-scheduler.reducer';

// Feature area state
export interface BulkJobExportSchedulerFeatureState {
  view: fromViewReducer.State;
  filter: fromFilterReducer.State;
  bulkExportSchedule: fromBulkExportSchedulerReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_bulk_jobs_export_scheduler: BulkJobExportSchedulerFeatureState;
}

// Feature area reducers
export const reducers = {
  view: fromViewReducer.reducer,
  filter: fromFilterReducer.reducer,
  bulkExportSchedule: fromBulkExportSchedulerReducer.reducer
};


// Select Feature Area
export const selectFeatureBulkJobsExportSchedulerState = createFeatureSelector<BulkJobExportSchedulerFeatureState>('feature_bulk_jobs_export_scheduler');

// Feature Selectors
export const selectViewState = createSelector(selectFeatureBulkJobsExportSchedulerState,
  (state: BulkJobExportSchedulerFeatureState) => state.view);
export const selectFilterState = createSelector(selectFeatureBulkJobsExportSchedulerState,
  (state: BulkJobExportSchedulerFeatureState) => state.filter);
export const selectBulkExportScheduleState = createSelector(selectFeatureBulkJobsExportSchedulerState,
  (state: BulkJobExportSchedulerFeatureState) => state.bulkExportSchedule);

export const {
  selectAll: getViews
} = fromViewReducer.adapter.getSelectors(selectViewState);

export const {
  selectAll: getFilters
} = fromFilterReducer.adapter.getSelectors(selectFilterState);

export const {
  selectAll: getBulkExportSchedules
} = fromBulkExportSchedulerReducer.adapter.getSelectors(selectBulkExportScheduleState);

export const getViewsLoading = createSelector(selectViewState, fromViewReducer.getLoading);
export const getViewsLoadingError = createSelector(selectViewState, fromViewReducer.getLoadingError);
export const getFiltersLoading = createSelector(selectFilterState, fromFilterReducer.getLoading);
export const getFiltersLoadingError = createSelector(selectFilterState, fromFilterReducer.getLoadingError);
export const getBulkExportScheduleAdding = createSelector(selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getAdding);
export const getBulkExportScheduleAddingError = createSelector(
  selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getAddingError
);
export const getBulkExportScheduleLoading = createSelector(selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getLoading);
export const getBulkExportScheduleLoadingError = createSelector(
  selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getLoadingError
);
export const getBulkExportScheduleRemoving = createSelector(selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getRemoving);
export const getBulkExportScheduleRemovingError = createSelector(
  selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getRemovingError
);

export const getBulkScheduleDeleteModalOpen = createSelector(
  selectBulkExportScheduleState, fromBulkExportSchedulerReducer.getBulkScheduleDeleteModalOpen
);
