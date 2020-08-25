import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataViewsExportReducer from './data-views-export.reducer';
import * as fromTotalRewardsStatementPdfsReducer from './total-rewards-statement-pdfs.reducer';
import * as fromUserNotificationListReducer from './user-notification-list.reducer';

// Feature area state
export interface NotificationsMainState {
  dataViewsExportNotifications: fromDataViewsExportReducer.State;
  totalRewardsStatementPdfNotifications: fromTotalRewardsStatementPdfsReducer.State;
  userNotificationList: fromUserNotificationListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  notifications_main: NotificationsMainState;
}

// Feature area reducers
export const reducers = {
  dataViewsExportNotifications: fromDataViewsExportReducer.reducer,
  totalRewardsStatementPdfNotifications: fromTotalRewardsStatementPdfsReducer.reducer,
  userNotificationList: fromUserNotificationListReducer.reducer
};

// Select feature area
export const selectFeatureAreaState = createFeatureSelector<NotificationsMainState>('notifications_main');

// Feature selectors
export const selectDataViewsExportState = createSelector(
  selectFeatureAreaState,
  (state: NotificationsMainState) => state.dataViewsExportNotifications
);

export const selectTotalRewardsStatementPdfsState = createSelector(
  selectFeatureAreaState,
  (state: NotificationsMainState) => state.totalRewardsStatementPdfNotifications
);

export const selectUserNotificationListState = createSelector(
  selectFeatureAreaState,
  (state: NotificationsMainState) => state.userNotificationList
);

// Data Insights Export
export const getDataViewExports = createSelector(
  selectDataViewsExportState,
  fromDataViewsExportReducer.getDataViewExports
);

// Total Rewards Statement Pdfs
export const getTotalRewardsStatementPdfs = createSelector(
  selectTotalRewardsStatementPdfsState,
  fromTotalRewardsStatementPdfsReducer.getTotalRewardsStatementPdfs
);

export const getTotalRewardsStatementPdfsLoading = createSelector(
  selectTotalRewardsStatementPdfsState,
  fromTotalRewardsStatementPdfsReducer.getTotalRewardsStatementPdfsLoading
);

export const getTotalRewardsStatementPdfsLoadingError = createSelector(
  selectTotalRewardsStatementPdfsState,
  fromTotalRewardsStatementPdfsReducer.getTotalRewardsStatementPdfsLoadingError
);

// User Notification List
export const getUserNotificationsAsyncObj = createSelector(
  selectUserNotificationListState,
  fromUserNotificationListReducer.getUserNotificationsAsyncObj
);
