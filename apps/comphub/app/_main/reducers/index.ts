import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsCardReducer from './jobs-card.reducer';
import * as fromComphubPageReducer from './comphub-page.reducer';
import * as fromAddPayMarketFormReducer from './add-paymarket-form.reducer';
import * as fromMarketsCardReducer from './markets-card.reducer';
import * as fromDataCardReducer from './data-card.reducer';
import * as fromSummaryCardReducer from './summary-card.reducer';

// Feature area state
export interface ComphubMainState {
  jobsCard: fromJobsCardReducer.State;
  comphubPage: fromComphubPageReducer.State;
  addPayMarketForm: fromAddPayMarketFormReducer.State;
  marketsCard: fromMarketsCardReducer.State;
  dataCard: fromDataCardReducer.State;
  summaryCard: fromSummaryCardReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  comphub_main: ComphubMainState;
}

// Feature area reducers
export const reducers = {
  jobsCard: fromJobsCardReducer.reducer,
  comphubPage: fromComphubPageReducer.reducer,
  marketsCard: fromMarketsCardReducer.reducer,
  dataCard: fromDataCardReducer.reducer,
  addPayMarketForm: fromAddPayMarketFormReducer.reducer,
  summaryCard: fromSummaryCardReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ComphubMainState>('comphub_main');

// Feature Selectors
export const selectJobsCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.jobsCard
);

export const selectComphubPageState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.comphubPage
);

export const selectAddPayMarketFormState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.addPayMarketForm
);

export const selectMarketsCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.marketsCard
);

export const selectDataCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.dataCard
);

export const selectSummaryCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.summaryCard
);

// Jobs Card
export const getTrendingJobGroups = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getTrendingJobGroups
);

export const getLoadingTrendingJobs = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getLoadingTrendingJobs
);

export const getLoadingTrendingJobsError = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getLoadingTrendingJobsError
);

export const getJobSearchOptions = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getJobSearchOptions
);

export const getLoadingJobSearchOptions = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getLoadingJobSearchOptions
);

export const getLoadingJobSearchOptionsError = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getLoadingJobSearchOptionsError
);

export const getSelectedJob = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getSelectedJob
);

// Comphub Page
export const getCards = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getCards
);

export const getSelectedPageId = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getSelectedPageId
);

export const getEnabledPages = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getEnabledPages
);

export const getPagesAccessed = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getPagesAccessed
);

export const getJobPricingLimitInfo = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getJobPricingLimitInfo
);

export const getJobPricingBlocked = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getJobPricingBlocked
);

export const getCountryDataSetsLoaded = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getCountryDataSetsLoaded
);

export const getCountryDataSets = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getCountryDataSets
);

export const getActiveCountryDataSet = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getActiveCountryDataSet
);

// Markets Card
export const getSelectedPaymarket = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getSelectedPaymarket
);

export const getLoadingPaymarkets = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getLoadingPaymarkets
);

export const getLoadingPaymarketsError = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getLoadingPaymarketsError
);

export const getPaymarkets = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getPaymarkets
);

export const getPaymarketsFilter = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getPaymarketsFilter
);

export const getVisiblePaymarkets = createSelector(
  getPaymarkets, getPaymarketsFilter, (paymarkets, filter) => {
    return paymarkets.filter(x => !filter || x.PayMarketName.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
);

export const getMarketDataScope = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getMarketDataScope
);

export const getHideNewPaymarketsButton = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getHideNewPaymarketsButton
);

// Data Card
export const getJobGridResults = createSelector(
  selectDataCardState,
  fromDataCardReducer.getJobGridResults
);

export const getLoadingJobGridResults = createSelector(
  selectDataCardState,
  fromDataCardReducer.getLoadingJobGridResults
);

export const getLoadingJobGridResultsError = createSelector(
  selectDataCardState,
  fromDataCardReducer.getLoadingJobGridResultsError
);

export const getSelectedJobData = createSelector(
  selectDataCardState,
  fromDataCardReducer.getSelectedJobData
);

export const getMarketDataChange = createSelector(
  selectDataCardState,
  fromDataCardReducer.getMarketDataChange
);

export const getPeerBannerOpen = createSelector(
  selectDataCardState,
  fromDataCardReducer.getPeerBannerOpen
);

export const getSelectedRate = createSelector(
  selectDataCardState,
  fromDataCardReducer.getSelectedRate
);

// Add Pay Market Form
export const getAddPayMarketFormOpen = createSelector(
  selectAddPayMarketFormState,
  fromAddPayMarketFormReducer.getFormOpen
);

export const getSavingPayMarket = createSelector(
  selectAddPayMarketFormState,
  fromAddPayMarketFormReducer.getSaving
);

export const getSavingPayMarketConflict = createSelector(
  selectAddPayMarketFormState,
  fromAddPayMarketFormReducer.getSavingConflict
);

export const getSavingPayMarketError = createSelector(
  selectAddPayMarketFormState,
  fromAddPayMarketFormReducer.getSavingError
);

export const getInfoBannerOpen = createSelector(
  selectAddPayMarketFormState,
  fromAddPayMarketFormReducer.getInfoBannerOpen
);

export const getShowSkipButton = createSelector(
  selectAddPayMarketFormState,
  fromAddPayMarketFormReducer.getShowSkipButton
);

// Summary Card
export const getSalaryTrendData = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getSalaryTrendData
);

export const getLoadingSalaryTrendData = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getLoadingSalaryTrendData
);

export const getLoadingSalaryTrendDataError = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getLoadingSalaryTrendError
);

export const getSharePricingSummaryModalOpen = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getSharePricingSummaryModalOpen
);

export const getSharePricingSummaryError = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getSharePricingSummaryError
);

export const getSharePricingSummaryConflict = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getSharePricingSummaryConflict
);

export const getCreatingProject = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getCreatingProject
);

export const getCreatingProjectError = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getCreatingProjectError
);

export const getCanAccessProjectsTile = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getCanAccessProjectTile
);
