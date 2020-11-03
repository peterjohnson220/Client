import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataInsightsPageReducer from './data-insights-page.reducer';
import * as fromDashboardsReducer from './dashboards.reducer';
import * as fromViewsReducer from './views.reducer';
import * as fromDataViewReducer from './data-view.reducer';

// Feature area state
export interface DataInsightsMainState {
  dataInsightsPage: fromDataInsightsPageReducer.State;
  dashboards: fromDashboardsReducer.State;
  views: fromViewsReducer.State;
  dataView: fromDataViewReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataInsights_main: DataInsightsMainState;
}

// Feature area reducers
export const reducers = {
  dataInsightsPage: fromDataInsightsPageReducer.reducer,
  dashboards: fromDashboardsReducer.reducer,
  views: fromViewsReducer.reducer,
  dataView: fromDataViewReducer.reducer
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

export const selectViewsState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.views
);

export const selectDataViewState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dataView
);

// Data Insights Page
export const getStandardWorkbooksAsync = createSelector(
  selectDataInsightsPageState,
  fromDataInsightsPageReducer.getStandardWorkbooksAsync
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

export const getTagWorkbookModalOpen = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getTagWorkbookModalOpen
);

export const getActiveWorkbook = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getActiveWorkbook
);

export const getAllViewsLoadedAsync = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getAllViewsLoadedAsync
);

// All Views
export const getCompanyWorkbooksAsyncFromViews = createSelector(
  selectViewsState,
  fromViewsReducer.getCompanyWorkbooksAsyncFromViews
);

export const getDataViewReportsFromViews = createSelector(
  selectViewsState,
  fromViewsReducer.getDataViewReportsFromViews
);

export const getTableauReportsFromViews = createSelector(
  selectViewsState,
  fromViewsReducer.getTableauReportsFromViews
);

export const getFavoriteViews = createSelector(
  selectViewsState,
  fromViewsReducer.getFavoriteViews
);

export const getFavoriteDataViewReports = createSelector(
  selectViewsState,
  fromViewsReducer.getFavoriteDataViewReports
);

export const getDashboardViewThumbnailEnabled = createSelector(
  selectViewsState,
  fromViewsReducer.getDashboardViewThumbnailEnabled
);

// Data View
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

export const getSaveUserReportSuccess = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSaveUserReportSuccess
);
