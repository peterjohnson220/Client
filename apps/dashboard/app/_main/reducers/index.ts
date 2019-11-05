import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTileGridReducer from './tile-grid.reducer';
import * as fromDashboardReducer from './dashboard.reducer';
import * as fromUserVoiceReducer from './user-voice.reducer';
import * as fromActivityTimelineReducer from './timeline-activity.reducer';
import * as fromDashboardTCModalReducer from './dashboard-tc-modal.reducer';
import * as fromCompanyResourcesReducer from './company-resources.reducer';
import * as fromCompanyResourcesFolderReducer from './company-resources-folder.reducer';
import * as fromCompanyResourcesOrphanReducer from './company-resources-orphan.reducer';

// Feature area state
export interface DashboardMainState {
  features: fromDashboardReducer.State;
  tileGrid: fromTileGridReducer.State;
  userVoice: fromUserVoiceReducer.State;
  activityTimeline: fromActivityTimelineReducer.State;
  tcModal: fromDashboardTCModalReducer.State;
  companyResources: fromCompanyResourcesReducer.State;
  folderResources: fromCompanyResourcesFolderReducer.State;
  orphanResources: fromCompanyResourcesOrphanReducer.State;
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
  companyResources: fromCompanyResourcesReducer.reducer,
  folderResources: fromCompanyResourcesFolderReducer.reducer,
  orphanResources: fromCompanyResourcesOrphanReducer.reducer
};

// Select Feature Area
export const selectDashboardMainState = createFeatureSelector<DashboardMainState>('dashboardMain');

// Feature Selectors
export const selectTileGridState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tileGrid);
export const selectFeatureState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.features);
export const selectUserVoiceState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.userVoice);
export const selectActivityTimelineState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.activityTimeline);
export const selectTCModalState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tcModal);
export const selectCompanyResourcesState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.companyResources);
export const selectCompanyResourcesFolderState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.folderResources);
export const selectCompanyResourcesOrphanState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.orphanResources);

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

// company resources
export const getCompanyResourcesLoading = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourcesLoading);
export const getCompanyResourcesLoadingError = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourcesLoadingError);
export const getCompanyResourceToAdd = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourceToAdd);
export const getCompanyResourceId = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getCompanyResourceId);
export const getAddingCompanyResource = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getAddingCompanyResource);
export const getAddingCompanyResourceSuccess = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getAddingCompanyResourceSuccess);
export const getDeletingCompanyResourceSuccess = createSelector(selectCompanyResourcesState, fromCompanyResourcesReducer.getDeletingCompanyResourceSuccess);

// company folder resources
export const { selectAll: getCompanyFolderResources } = fromCompanyResourcesFolderReducer.adapter.getSelectors(selectCompanyResourcesFolderState);
export const getFolderResources = createSelector(selectCompanyResourcesFolderState, fromCompanyResourcesFolderReducer.getFolderResources);
export const getCompanyResourceFolder = createSelector(selectCompanyResourcesFolderState, fromCompanyResourcesFolderReducer.getCompanyResourceFolder);
export const getAddingFolderToCompanyResources = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResources);
export const getAddingFolderToCompanyResourcesSuccess = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResourcesSuccess);
export const getAddingFolderToCompanyResourcesError = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getAddingFolderToCompanyResourcesError);
export const getDeletingFolderFromCompanyResources = createSelector(selectCompanyResourcesFolderState,
  fromCompanyResourcesFolderReducer.getDeletingFolderFromCompanyResources);
export const getDeletingFolderFromCompanyResourcesSuccess = createSelector(selectCompanyResourcesFolderState,
fromCompanyResourcesFolderReducer.getDeletingFolderFromCompanyResourcesSuccess);

// company orphan resources
export const { selectAll: getCompanyOrphanResources } = fromCompanyResourcesOrphanReducer.adapter.getSelectors(selectCompanyResourcesOrphanState);
export const getOrphanedResources = createSelector(selectCompanyResourcesOrphanState, fromCompanyResourcesOrphanReducer.getOrphanedResources);
