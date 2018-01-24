import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTileGridReducer from './tile-grid.reducer';
import * as fromDashboardReducer from './dashboard.reducer';
import * as fromUserVoiceReducer from './user-voice.reducer';

// Feature area state
export interface DashboardMainState {
  features: fromDashboardReducer.State;
  tileGrid: fromTileGridReducer.State;
  userVoice: fromUserVoiceReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dashboardMain: DashboardMainState;
}

// Feature area reducers
export const reducers = {
  features: fromDashboardReducer.reducer,
  tileGrid: fromTileGridReducer.reducer,
  userVoice: fromUserVoiceReducer.reducer
};

// Select Feature Area
export const selectDashboardMainState = createFeatureSelector<DashboardMainState>('dashboardMain');

// Feature Selectors
export const selectTileGridState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tileGrid);
export const selectFeatureState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.features);

export const selectUserVoiceState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.userVoice);

// Entity Adapter Selectors

// Feature
export const {
  selectAll: getFeatures,
} = fromDashboardReducer.adapter.getSelectors(selectFeatureState);

export const getFeaturesLoading = createSelector(selectFeatureState, fromDashboardReducer.getLoading);
export const getFeaturesLoadingError = createSelector(selectFeatureState, fromDashboardReducer.getLoadingError);

// TileGrid
export const {
  selectAll: getTileGridTiles,
} = fromTileGridReducer.adapter.getSelectors(selectTileGridState);

export const getTileGridLoading = createSelector(selectTileGridState, fromTileGridReducer.getLoading);
export const getTileGridLoadingError = createSelector(selectTileGridState, fromTileGridReducer.getLoadingError);

// User Voice Selectors
export const getUserVoiceLink = createSelector(selectUserVoiceState, fromUserVoiceReducer.getUserVoiceLink);
export const getUserVoiceLoading = createSelector(selectUserVoiceState, fromUserVoiceReducer.getLoading);
export const getUserVoiceLoadingError = createSelector(selectUserVoiceState, fromUserVoiceReducer.getLoadingError);
