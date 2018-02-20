import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTileGridReducer from './tile-grid.reducer';
import * as fromDashboardReducer from './dashboard.reducer';
import * as fromUserVoiceReducer from './user-voice.reducer';
import * as fromActivityTimelineReducer from './timeline-activity.reducer';

// Feature area state
export interface DashboardMainState {
  features: fromDashboardReducer.State;
  tileGrid: fromTileGridReducer.State;
  userVoice: fromUserVoiceReducer.State;
  activityTimeline: fromActivityTimelineReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dashboardMain: DashboardMainState;
}

// Feature area reducers
export const reducers = {
  features: fromDashboardReducer.reducer,
  tileGrid: fromTileGridReducer.reducer,
  userVoice: fromUserVoiceReducer.reducer,
  activityTimeline: fromActivityTimelineReducer.reducer
};

// Select Feature Area
export const selectDashboardMainState = createFeatureSelector<DashboardMainState>('dashboardMain');

// Feature Selectors
export const selectTileGridState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tileGrid);
export const selectFeatureState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.features);
export const selectUserVoiceState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.userVoice);
export const selectActivityTimelineState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.activityTimeline);

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

// ActivityTimeline

export const {
  selectAll: getTimelineActivities
} = fromActivityTimelineReducer.adapter.getSelectors(selectActivityTimelineState);

export const getTimelineActivityLoading = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getLoading);
export const getTimelineActivtyLoadingError = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getLoadingError);
export const getActivityFiltering = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getFiltering);
export const getActivityFilteringError = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getFilteringError);
