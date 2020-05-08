import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromUserSettingsPageReducer from './user-settings-page.reducer';

// Feature area state
export interface UserSettingsMainState {
  userSettingsPage: fromUserSettingsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userSettings_main: UserSettingsMainState;
}

// Feature area reducers
export const reducers = {
  userSettingsPage: fromUserSettingsPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<UserSettingsMainState>('userSettings_main');

// Feature Selectors
export const selectUserSettingsPageState = createSelector(selectFeatureAreaState,
  (state: UserSettingsMainState) => state.userSettingsPage
);

// User Settings Page
