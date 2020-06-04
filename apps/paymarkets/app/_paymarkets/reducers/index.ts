import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromPayMarketsPageReducer from './paymarkets-page.reducer';
import * as fromGridActionsBarReducer from './grid-actions-bar.reducer';

// Feature area state
export interface PayMarketsMainState {
  paymarketsPage: fromPayMarketsPageReducer.State;
  gridActionsBar: fromGridActionsBarReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  paymarkets_main: PayMarketsMainState;
}

// Feature area reducers
export const reducers = {
  paymarketsPage: fromPayMarketsPageReducer.reducer,
  gridActionsBar: fromGridActionsBarReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PayMarketsMainState>('paymarkets_main');

// Feature Selectors
export const selectPayMarketsPageState = createSelector(selectFeatureAreaState,
  (state: PayMarketsMainState) => state.paymarketsPage
);

export const selectGridActionsBarState = createSelector(selectFeatureAreaState,
  (state: PayMarketsMainState) => state.gridActionsBar);

// PayMarkets Page

// Grid Actions Bar
export const getCompanyScopeSizes = createSelector(selectGridActionsBarState, fromGridActionsBarReducer.getCompanyScopeSizes);
export const getSelectedSizes = createSelector(selectGridActionsBarState, fromGridActionsBarReducer.getSelectedSizes);
export const getCompanyIndustries = createSelector(selectGridActionsBarState, fromGridActionsBarReducer.getCompanyIndustries);
export const getSelectedIndustries = createSelector(selectGridActionsBarState, fromGridActionsBarReducer.getSelectedIndustries);
export const getLocations = createSelector(selectGridActionsBarState, fromGridActionsBarReducer.getLocations);
export const getSelectedLocations = createSelector(selectGridActionsBarState, fromGridActionsBarReducer.getSelectedLocations);
