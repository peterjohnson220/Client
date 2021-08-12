import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTrendsLandingCardReducer from './trends-landing-card.reducer';
import * as fromTrendsJobsCardReducer from './trends-jobs-card.reducer';
import * as fromTrendsSummaryCardReducer from './trends-summary-card.reducer';

// Feature area state
export interface ComphubPeerTrendsDataState {
  trendsLandingCard: fromTrendsLandingCardReducer.State;
  trendsJobsCard: fromTrendsJobsCardReducer.State;
  trendsSummaryCard: fromTrendsSummaryCardReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  comphub_peerTrendsData: ComphubPeerTrendsDataState;
}

// Feature area reducers
export const reducers = {
  trendsLandingCard: fromTrendsLandingCardReducer.reducer,
  trendsJobsCard: fromTrendsJobsCardReducer.reducer,
  trendsSummaryCard: fromTrendsSummaryCardReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ComphubPeerTrendsDataState>('comphub_peerTrendsData');

// Feature Selectors
export const selectTrendsLandingCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubPeerTrendsDataState) => state.trendsLandingCard
);

export const selectTrendsJobsCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubPeerTrendsDataState) => state.trendsJobsCard
);

export const selectTrendsSummaryCardState = createSelector(
  selectFeatureAreaState,
  (state: ComphubPeerTrendsDataState) => state.trendsSummaryCard
);

// Trends Landing Card
export const getNewExchangeParticipants = createSelector(
  selectTrendsLandingCardState,
  fromTrendsLandingCardReducer.getNewExchangeParticipants
);

export const getOrgIncCountHistory = createSelector(
  selectTrendsLandingCardState,
  fromTrendsLandingCardReducer.getOrgIncCountHistory
);

export const getSelectedTrendId = createSelector(
  selectTrendsLandingCardState,
  fromTrendsLandingCardReducer.getSelectedTrendId
);

// Trends Jobs
export const getSelectedExchangeJobs = createSelector(
  selectTrendsJobsCardState,
  fromTrendsJobsCardReducer.getSelectedExchangeJobs
);


// Trends Summary Card
export const getPeerTrends = createSelector(
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getPeerTrends
);

export const getPeerTrendsSummaryDetails = createSelector(
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getPeerTrendsSummaryDetails
);

export const getSmartCodeMaps = createSelector(
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getSmartCodeMaps
);

export const getPeerTrendsDomainMin = createSelector(
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getPeerTrendsDomainMin
);

export const getPeerTrendsDomainMax = createSelector(
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getPeerTrendsDomainMax
);

export const getPeerTrendsDomain = createSelector(
  getPeerTrendsDomainMin,
  getPeerTrendsDomainMax,
  (min, max) => ({ minDate: min, maxDate: max})
);

export const getDisplaySavePeerTrendModal = createSelector (
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getDisplaySavePeerTrendModal
);

export const getSavingPeerTrend = createSelector (
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getSavingPeerTrend
);

export const getExchangeJobIds = createSelector (
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getExchangeJobIds
);

export const getCompanyJobIds = createSelector (
  selectTrendsSummaryCardState,
  fromTrendsSummaryCardReducer.getCompanyJobIds
);

