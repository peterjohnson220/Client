import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataViewsExportReducer from './data-views-export.reducer';

// Feature area state
export interface NotificationsMainState {
  dataViewsExportNotifications: fromDataViewsExportReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  notifications_main: NotificationsMainState;
}

// Feature area reducers
export const reducers = {
  dataViewsExportNotifications: fromDataViewsExportReducer.reducer
};

// Select feature area
export const selectFeatureAreaState = createFeatureSelector<NotificationsMainState>('notifications_main');

// Feature selectors
export const selectDataViewsExportState = createSelector(
  selectFeatureAreaState,
  (state: NotificationsMainState) => state.dataViewsExportNotifications
);

// Data Insights Export
export const getDataViewsExportList = createSelector(
  selectDataViewsExportState,
  fromDataViewsExportReducer.getDataViewsExportList
);
