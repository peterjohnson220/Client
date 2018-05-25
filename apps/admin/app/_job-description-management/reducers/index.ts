import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJdmViewReducer from './view.reducer';
import * as fromJdmFilterReducer from './filter.reducer';
import * as fromJdmBulkExportScheduleReducer from './bulk-export-scheduler.reducer';

// Feature area state
export interface JdmAdminState {
  view: fromJdmViewReducer.State;
  filter: fromJdmFilterReducer.State;
  bulkExportSchedule: fromJdmBulkExportScheduleReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jdmAdmin: JdmAdminState;
}

// Feature area reducers
export const reducers = {
  view: fromJdmViewReducer.reducer,
  filter: fromJdmFilterReducer.reducer,
  bulkExportSchedule: fromJdmBulkExportScheduleReducer.reducer
};


// Select Feature Area
export const selectJdmAdminState = createFeatureSelector<JdmAdminState>('jdmAdmin');

// Feature Selectors
export const selectViewState = createSelector(selectJdmAdminState, (state: JdmAdminState) => state.view);
export const selectFilterState = createSelector(selectJdmAdminState, (state: JdmAdminState) => state.filter);
export const selectBulkExportScheduleState = createSelector(selectJdmAdminState, (state: JdmAdminState) => state.bulkExportSchedule);

export const {
  selectAll: getViews
} = fromJdmViewReducer.adapter.getSelectors(selectViewState);

export const {
  selectAll: getFilters
} = fromJdmFilterReducer.adapter.getSelectors(selectFilterState);

export const {
  selectAll: getBulkExportSchedules
} = fromJdmBulkExportScheduleReducer.adapter.getSelectors(selectBulkExportScheduleState);

export const getViewsLoading = createSelector(selectViewState, fromJdmViewReducer.getLoading);
export const getViewsLoadingError = createSelector(selectViewState, fromJdmViewReducer.getLoadingError);
export const getFiltersLoading = createSelector(selectFilterState, fromJdmFilterReducer.getLoading);
export const getFiltersLoadingError = createSelector(selectFilterState, fromJdmFilterReducer.getLoadingError);
export const getBulkExportScheduleAdding = createSelector(selectBulkExportScheduleState, fromJdmBulkExportScheduleReducer.getAdding);
export const getBulkExportScheduleAddingError = createSelector(selectBulkExportScheduleState, fromJdmBulkExportScheduleReducer.getAddingError);
export const getBulkExportScheduleLoading = createSelector(selectBulkExportScheduleState, fromJdmBulkExportScheduleReducer.getLoading);
export const getBulkExportScheduleLoadingError = createSelector(selectBulkExportScheduleState, fromJdmBulkExportScheduleReducer.getLoadingError);
export const getBulkExportScheduleRemoving = createSelector(selectBulkExportScheduleState, fromJdmBulkExportScheduleReducer.getRemoving);
export const getBulkExportScheduleRemovingError = createSelector(selectBulkExportScheduleState, fromJdmBulkExportScheduleReducer.getRemovingError);

