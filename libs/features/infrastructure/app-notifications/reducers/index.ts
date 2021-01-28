import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAppNotificationsReducer from './app-notifications.reducer';

// Feature area state
export interface AppNotificationsFeatureState {
  appNotifications: fromAppNotificationsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_appnotifications: AppNotificationsFeatureState;
}

// Feature area reducers
export const reducers = {
  appNotifications: fromAppNotificationsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AppNotificationsFeatureState>('feature_appnotifications');

// Feature Selectors
export const selectAppNotificationsState = createSelector(
  selectFeatureAreaState,
  (state: AppNotificationsFeatureState) => state.appNotifications
);

// App Notifications Selectors
export const getNotifications = createSelector(
  selectAppNotificationsState,
  fromAppNotificationsReducer.getNotifications
);

export const getUnreadCountAsyncObj = createSelector(
  selectAppNotificationsState,
  fromAppNotificationsReducer.getUnreadCountAsyncObj
);

export const getUnseenCountAsyncObj = createSelector(
  selectAppNotificationsState,
  fromAppNotificationsReducer.getUnseenCountAsyncObj
);
