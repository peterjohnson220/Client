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
import * as fromJobGridReducer from './job-grid.reducer';
import * as fromQuickPriceHistoryReducer from './quick-price-history.reducer';

// Feature area state
export interface ComphubMainState {
  jobsCard: fromJobsCardReducer.State;
  comphubPage: fromComphubPageReducer.State;
  addPayMarketForm: fromAddPayMarketFormReducer.State;
  marketsCard: fromMarketsCardReducer.State;
  dataCard: fromDataCardReducer.State;
  summaryCard: fromSummaryCardReducer.State;
  jobGrid: fromJobGridReducer.State;
  quickPriceHistory: fromQuickPriceHistoryReducer.State;
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
  summaryCard: fromSummaryCardReducer.reducer,
  jobGrid: fromJobGridReducer.reducer,
  quickPriceHistory: fromQuickPriceHistoryReducer.reducer
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

export const selectJobGridState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.jobGrid
);

export const selectQuickPriceHistoryState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.quickPriceHistory
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

export const getExchangeJobSearchOptions = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getExchangeJobSearchOptions
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

export const getSelectedExchangeJobId = createSelector(
  selectJobsCardState,
  fromJobsCardReducer.getSelectedExchangeJobId
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

export const getSmbLimitReached = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getSmbLimitReached
);

export const getCountryDataSetsLoaded = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getCountryDataSetsLoaded
);

export const getCountryDataSets = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getCountryDataSets
);

export const getExchangeDataSets = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getExchangeDataSets
);

export const getExchangeDataSetLoaded = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getExchangeDataSetLoaded
);

export const getActiveCountryDataSet = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getActiveCountryDataSet
);

export const getActiveExchangeDataSet = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getActiveExchangeDataSet
);

export const getWorkflowContext = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getWorkflowContext
);

export const getQuickPriceType = createSelector(
  getWorkflowContext,
  (context) => context.quickPriceType
);

export const getIsQuickPriceHistoryOpen = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getIsQuickPriceHistoryModalOpen
);

export const getFooterContext = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getFooterContext
);

export const getSelectedJobData = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getSelectedJobData
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

export const getLoadingMarketDataLocations = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getLoadingMarketDataLocations
);

export const getMarketDataLocations = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getMarketDataLocations
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

export const getMarketDataScopesLoading = createSelector(
  selectMarketsCardState,
  fromMarketsCardReducer.getLoadingMarketDataScopes
);

// Data Card
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

export const getForcePeerMapRefresh = createSelector(
  selectDataCardState,
  fromDataCardReducer.getForcePeerMapRefresh
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

export const getGlossaryOpen = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getGlossaryOpen
);

export const getMinPaymarketMinimumWage = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getMinPaymarketMinimumWage
);

export const getMaxPaymarketMinimumWage = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getMaxPaymarketMinimumWage
);

export const getRecalculatingJobData = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getRecalculatingJobData
);

export const getRecalculatingJobDataError = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getRecalculatingJobDataError
);

export const getShowJobPricedHistorySummary = createSelector(
  selectSummaryCardState,
  fromSummaryCardReducer.getShowJobPricedHistorySummary
);

// Job Grid
export const getJobGridResults = createSelector(
  selectJobGridState,
  fromJobGridReducer.getJobGridResults
);

export const getLoadingJobGridResults = createSelector(
  selectJobGridState,
  fromJobGridReducer.getLoadingJobGridResults
);

export const getLoadingJobGridResultsError = createSelector(
  selectJobGridState,
  fromJobGridReducer.getLoadingJobGridResultsError
);

// Quick Price History
export const getLoadingJobDataHistory = createSelector(
  selectQuickPriceHistoryState,
  fromQuickPriceHistoryReducer.getLoadingJobDataHistory
);

export const getLoadingJobDataHistoryErrorMessage = createSelector(
  selectQuickPriceHistoryState,
  fromQuickPriceHistoryReducer.getLoadingJobDataHistoryErrorMessage
);
