import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromQuickPriceHistoryReducer from './quick-price-history.reducer';

// Feature area state
export interface ComphubMainState {
  quickPriceHistory: fromQuickPriceHistoryReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  comphub_main: ComphubMainState;
}

// Feature area reducers
export const reducers = {
  quickPriceHistory: fromQuickPriceHistoryReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ComphubMainState>('comphub_main');

// Feature Selectors

export const selectQuickPriceHistoryState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.quickPriceHistory
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
