import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromPayMarketsPageReducer from './paymarkets-page.reducer';

// Feature area state
export interface PayMarketsMainState {
  paymarketsPage: fromPayMarketsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  paymarkets_main: PayMarketsMainState;
}

// Feature area reducers
export const reducers = {
  paymarketsPage: fromPayMarketsPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PayMarketsMainState>('paymarkets_main');

// Feature Selectors
export const selectPayMarketsPageState = createSelector(selectFeatureAreaState,
  (state: PayMarketsMainState) => state.paymarketsPage
);

// PayMarkets Page
