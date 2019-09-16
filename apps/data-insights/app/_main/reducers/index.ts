import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataInsightsPageReducer from './data-insights-page.reducer';
import * as fromDashboardsReducer from './dashboards.reducer';
import * as fromReportViewReducer from './reports-view-page.reducer';
import * as fromDataViewReducer from './data-view.reducer';
import * as fromDataViewGridReducer from './data-view-grid.reducer';
import * as fromViewsReducer from './views.reducer';
import * as fromConfigurationReducer from './configuration.reducer';

// Feature area state
export interface DataInsightsMainState {
  dataInsightsPage: fromDataInsightsPageReducer.State;
  dashboards: fromDashboardsReducer.State;
  reportViewPage: fromReportViewReducer.State;
  dataView: fromDataViewReducer.State;
  dataViewGrid: fromDataViewGridReducer.State;
  views: fromViewsReducer.State;
  configuration: fromConfigurationReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataInsights_main: DataInsightsMainState;
}

// Feature area reducers
export const reducers = {
  dataInsightsPage: fromDataInsightsPageReducer.reducer,
  dashboards: fromDashboardsReducer.reducer,
  reportViewPage: fromReportViewReducer.reducer,
  dataView: fromDataViewReducer.reducer,
  dataViewGrid: fromDataViewGridReducer.reducer,
  views: fromViewsReducer.reducer,
  configuration: fromConfigurationReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataInsightsMainState>('dataInsights_main');

// Feature Selectors
export const selectDataInsightsPageState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dataInsightsPage
);

export const selectDashboardsState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dashboards
);

export const selectReportViewPageState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.reportViewPage
);

export const selectDataViewState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dataView
);

export const selectDataViewGridState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dataViewGrid
);

export const selectViewsState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.views
);

export const selectConfigurationState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.configuration
);

// Data Insights Page
export const getStandardWorkbooksAsync = createSelector(
  selectDataInsightsPageState,
  fromDataInsightsPageReducer.getStandardWorkbooksAsync
);

export const getShowStandardReportsSection = createSelector(
  selectDataInsightsPageState,
  fromDataInsightsPageReducer.getShowStandardReportsSection
);

// Report View Page
export const getWorkbookViewUrl = createSelector(
  selectReportViewPageState,
  fromReportViewReducer.getWorkbookViewUrlAsync
);

// Dashboards
export const getCompanyWorkbooksAsync = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getCompanyWorkbooksAsync
);

export const getDashboardView = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getDashboardView
);

export const getFilteredCompanyWorkbooks = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getFilteredCompanyWorkbooks
);

export const getDistinctTags = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getDistinctTags
);

export const getDistinctTagsByView = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getDistinctTagsByView
);

export const getSavingTag = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getSavingTag
);

export const getSavingTagError = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getSavingTagError
);

export const getTagFilter = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getTagFilter
);

// Data View
export const getBaseEntitiesAsync = createSelector(
  selectDataViewState,
  fromDataViewReducer.getBaseEntitiesAsync
);

export const getSavingUserReport = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSavingUserReport
);

export const getSaveUserReportError = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSaveUserReportError
);

export const getSaveUserReportConflict = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSaveUserReportConflict
);

export const getEditingUserReport = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditingUserReport
);

export const getEditUserReportSuccess = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditUserReportSuccess
);

export const getEditUserReportError = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditUserReportError
);

export const getEditUserReportConflict = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditUserReportConflict
);

export const getDuplicatingUserReport = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicatingUserReport
);

export const getDuplicateUserReportError = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicateUserReportError
);

export const getDuplicateUserReportConflict = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicateUserReportConflict
);

export const getDuplicateUserReportSuccess = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicateUserReportSuccess
);

export const getUserDataViewAsync = createSelector(
  selectDataViewState,
  fromDataViewReducer.getUserDataViewAsync
);

export const getReportFieldsAsync = createSelector(
  selectDataViewState,
  fromDataViewReducer.getReportFieldsAsync
);

export const getSelectedFields = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSelectedFields
);

export const getUnselectedFields = createSelector(
  selectDataViewState,
  fromDataViewReducer.getUnselectedFields
);

// Data View Grid
export const getReportDataAsync = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getReportDataAsync
);

export const getPagingOptions = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getPagingOptions
);

export const getLoadingMoreData = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getLoadingMoreData
);

export const getHasMoreDataOnServer = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getHasMoreDataOnServer
);

export const getSortDescriptor = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getSortDescriptor
);

// All Views
export const getCompanyWorkbooksAsyncFromViews = createSelector(
  selectViewsState,
  fromViewsReducer.getCompanyWorkbooksAsyncFromViews
);

export const getFavoriteViews = createSelector(
  selectViewsState,
  fromViewsReducer.getFavoriteViews
);

export const getDashboardViewThumbnailEnabled = createSelector(
  selectViewsState,
  fromViewsReducer.getDashboardViewThumbnailEnabled
);

// Configuration
export const getFilters = createSelector(
  selectConfigurationState,
  fromConfigurationReducer.getFilters
);
