import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from 'libs/state/state';

import * as fromUserNotificationListReducer from './user-notification-list.reducer';

export interface UserNotificationListState {
  userNotificationList: fromUserNotificationListReducer.State;
}

export interface State extends fromRoot.State {
  feature_user_notifications: UserNotificationListState;
}

export const reducers = {
  userNotificationList : fromUserNotificationListReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<UserNotificationListState>('feature_user_notifications');

export const selectUserNotificationListState = createSelector(
  selectFeatureAreaState,
  (state: UserNotificationListState) => state.userNotificationList
);

// User Notification List
export const getUserNotifications = createSelector(
  selectUserNotificationListState,
  fromUserNotificationListReducer.getUserNotifications
);

