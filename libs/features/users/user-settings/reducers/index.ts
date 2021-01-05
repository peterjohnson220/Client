import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromAutoShareReducer from './auto-share.reducer';

// Feature area state
export interface UserSettingsSharedMainState {
  autoShare: fromAutoShareReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userSettingsShared_main: UserSettingsSharedMainState;
}

// Feature area reducers
export const reducers = {
  autoShare: fromAutoShareReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<UserSettingsSharedMainState>('userSettingsShared_main');

// Feature Selectors
export const selectAutoShareState = createSelector(
  selectFeatureAreaState,
  (state: UserSettingsSharedMainState) => state.autoShare
);

// Auto Share
export const getSelectedUsers = createSelector(
  selectAutoShareState,
  fromAutoShareReducer.getSelectedUsers
);

export const getSharableUsersAsync = createSelector(
  selectAutoShareState,
  fromAutoShareReducer.getShareableUsersAsync
);

export const getShowAutoShareModal = createSelector(
  selectAutoShareState,
  fromAutoShareReducer.getShowAutoShareModal
);
