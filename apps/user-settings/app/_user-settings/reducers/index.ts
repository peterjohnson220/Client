import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromDashboardPreferencesReducer from './dashboard-preferences.reducer';
import * as fromUserProfileReducer from './user-profile.reducer';
import * as fromProjectTemplateReducer from './project-templates.reducer';
import * as fromPayMarketDefaultSettingsReducer from './paymarket-default-settings.reducer';
import * as fromChangePasswordReducer from './change-password.reducer';

// Feature area state
export interface UserSettingsMainState {
  dashboardPreferences: fromDashboardPreferencesReducer.State;
  userProfile: fromUserProfileReducer.State;
  projectTemplates: fromProjectTemplateReducer.State;
  payMarketDefaultSettings: fromPayMarketDefaultSettingsReducer.State;
  changePassword: fromChangePasswordReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userSettings_main: UserSettingsMainState;
}

// Feature area reducers
export const reducers = {
  dashboardPreferences: fromDashboardPreferencesReducer.reducer,
  userProfile: fromUserProfileReducer.reducer,
  projectTemplates: fromProjectTemplateReducer.reducer,
  payMarketDefaultSettings: fromPayMarketDefaultSettingsReducer.reducer,
  changePassword: fromChangePasswordReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<UserSettingsMainState>('userSettings_main');

// Feature Selectors
export const selectDashboardPreferencesState = createSelector(selectFeatureAreaState,
  (state: UserSettingsMainState) => state.dashboardPreferences
);

export const selectUserProfileState = createSelector(selectFeatureAreaState,
  (state: UserSettingsMainState) => state.userProfile
);

export const selectProjectTemplatesState = createSelector(selectFeatureAreaState,
  (state: UserSettingsMainState) => state.projectTemplates
);

export const selectPayMarketDefaultSettingsState = createSelector(selectFeatureAreaState,
  (state: UserSettingsMainState) => state.payMarketDefaultSettings);

export const selectChangePasswordState = createSelector(selectFeatureAreaState,
  (state: UserSettingsMainState) => state.changePassword
);

// Dashboard Preferences
export const getUserTilesAsync = createSelector(selectDashboardPreferencesState, fromDashboardPreferencesReducer.getUserTilesAsync);
export const getDashboardPreferencesHasPendingChanges = createSelector(
  selectDashboardPreferencesState, fromDashboardPreferencesReducer.getDashboardPreferencesHasPendingChanges
);
export const getSavedDashboardPreferencesResponse = createSelector(
  selectDashboardPreferencesState , fromDashboardPreferencesReducer.getSavedDashboardPreferencesResponse
);

// My Profile
export const getUserProfile = createSelector(selectUserProfileState, fromUserProfileReducer.getUserProfile);
export const getCloudFilesPublicBaseUrl = createSelector(selectUserProfileState, fromUserProfileReducer.getCloudFilesPublicBaseUrl);

// Project Templates
export const getProjectTemplatesAsync = createSelector(selectProjectTemplatesState, fromProjectTemplateReducer.getProjectTemplatesAsync);

// PayMarket Default Settings
export const getAccessiblePayMarkets = createSelector(selectPayMarketDefaultSettingsState, fromPayMarketDefaultSettingsReducer.getAccessiblePayMarkets);
export const getPayMarketCuts = createSelector(selectPayMarketDefaultSettingsState, fromPayMarketDefaultSettingsReducer.getPayMarketCuts);

// Change Password
export const getChangingPassword = createSelector(selectChangePasswordState, fromChangePasswordReducer.getChangingPassword);
export const getChangePasswordSuccess = createSelector(selectChangePasswordState, fromChangePasswordReducer.getChangePasswordSuccess);
export const getChangePasswordError = createSelector(selectChangePasswordState, fromChangePasswordReducer.getChangePasswordError);
export const getPasswordMinimumLength = createSelector(selectChangePasswordState, fromChangePasswordReducer.getPasswordMinimumLength);
