import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeDataCutsReducer from './exchange-data-cuts.reducer';

// Feature area state
export interface ExchangeDataCutsState {
  exchangeDataCuts: fromExchangeDataCutsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_exchangeDataCuts: ExchangeDataCutsState;
}

// Feature area reducers
export const reducers = {
  exchangeDataCuts: fromExchangeDataCutsReducer.reducer
};

// Select Feature Area
export const selectExchangeDataCutsFeature =
  createFeatureSelector<ExchangeDataCutsState>('feature_exchangeDataCuts');

// View Selectors
export const selectExchangeDataCutsState =
  createSelector(selectExchangeDataCutsFeature, (state: ExchangeDataCutsState) => state.exchangeDataCuts);

export const getExchangeDataCut = createSelector(selectExchangeDataCutsState, fromExchangeDataCutsReducer.getExchangeDataCut);
export const getLoading = createSelector(selectExchangeDataCutsState, fromExchangeDataCutsReducer.getLoading);
export const getHasError = createSelector(selectExchangeDataCutsState, fromExchangeDataCutsReducer.getHasError);
