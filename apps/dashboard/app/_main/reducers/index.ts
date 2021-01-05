import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTileGridReducer from './tile-grid.reducer';
import * as fromDashboardReducer from './dashboard.reducer';
import * as fromUserVoiceReducer from './user-voice.reducer';
import * as fromActivityTimelineReducer from './timeline-activity.reducer';
import * as fromDashboardTCModalReducer from './dashboard-tc-modal.reducer';
import * as fromMarketingReducer from 'libs/features/infrastructure/marketing-settings/marketing-settings/reducers/marketing-settings.reducer';


// Feature area state
export interface DashboardMainState {
  features: fromDashboardReducer.State;
  tileGrid: fromTileGridReducer.State;
  userVoice: fromUserVoiceReducer.State;
  activityTimeline: fromActivityTimelineReducer.State;
  tcModal: fromDashboardTCModalReducer.State;
  marketingSettings: fromMarketingReducer.State;
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
  activityTimeline: fromActivityTimelineReducer.reducer,
  tcModal: fromDashboardTCModalReducer.reducer,
  marketingSettings: fromMarketingReducer.reducer
};

// Select Feature Area
export const selectDashboardMainState = createFeatureSelector<DashboardMainState>('dashboardMain');

// Feature Selectors
export const selectTileGridState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tileGrid);
export const selectFeatureState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.features);
export const selectUserVoiceState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.userVoice);
export const selectActivityTimelineState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.activityTimeline);
export const selectTCModalState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tcModal);
export const selectMarketingSettingsState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.marketingSettings);

// Feature
export const {
  selectAll: getFeatures,
} = fromDashboardReducer.adapter.getSelectors(selectFeatureState);

export const getFeaturesLoading = createSelector(selectFeatureState, fromDashboardReducer.getLoading);
export const getFeaturesLoadingError = createSelector(selectFeatureState, fromDashboardReducer.getLoadingError);
export const getAccountExecutiveDriftUserId = createSelector(selectFeatureState, fromDashboardReducer.getAccountExecutiveDriftUserId);
export const getGettingDriftUserId = createSelector(selectFeatureState, fromDashboardReducer.getGettingDriftUserId);
export const getGettingDriftUserIdError = createSelector(selectFeatureState, fromDashboardReducer.getGettingDriftUserIdError);

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
export const getTimelineActivityLoadingError = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getLoadingError);
export const getTimelineActivityFilters = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getFilters);
export const getTimelineActivityCurrentPage = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getGetCurrentPage);
export const getTimelineActivityHasMoreData = createSelector(selectActivityTimelineState, fromActivityTimelineReducer.getHasMoreData);

// dashboard-tc-modal selector
export const getTCSubmitting = createSelector(selectTCModalState, fromDashboardTCModalReducer.getTCSubmitting);
export const getTCSubmittingError = createSelector(selectTCModalState, fromDashboardTCModalReducer.getTCSubmittingError);
export const getTCSubmittingSuccess = createSelector(selectTCModalState, fromDashboardTCModalReducer.getTCSubmittingSuccess);
export const getTCData = createSelector(selectTCModalState, fromDashboardTCModalReducer.getTCData);
export const hasTCData = createSelector(selectTCModalState, fromDashboardTCModalReducer.hasTCData);

// marketing settings
export const getGettingMarketingVideoUrl = createSelector(selectMarketingSettingsState, fromMarketingReducer.getGettingMarketingVideoUrl);
export const getMarketingVideoUrlSuccess = createSelector(selectMarketingSettingsState, fromMarketingReducer.getGettingMarketingVideoUrlSuccess);
export const getMarketingVideoUrlError = createSelector(selectMarketingSettingsState, fromMarketingReducer.getGettingMarketingVideoUrlError);
export const getMarketingVideoUrl = createSelector(selectMarketingSettingsState, fromMarketingReducer.getMarketingVideoUrl);
