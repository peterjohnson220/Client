import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromSaveExchangeScopeReducer from 'libs/features/peer/save-exchange-scope/reducers/save-exchange-scope.reducer';
import * as fromRoot from 'libs/state/state';

export interface SaveExchangeScopeState {
  saveExchangeScope: fromSaveExchangeScopeReducer.State;
}

export interface State extends fromRoot.State {
  save_exchange_scope: SaveExchangeScopeState;
}

export const reducers = {
  saveExchangeScope: fromSaveExchangeScopeReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<SaveExchangeScopeState>('save_exchange_scope');

// Feature Selectors
export const selectSaveExchangeScopeState = createSelector(
  selectFeatureAreaState,
  (state: SaveExchangeScopeState) => state.saveExchangeScope
);

export const getSaveExchangeScopeModalOpen = createSelector(
  selectSaveExchangeScopeState,
  fromSaveExchangeScopeReducer.getSaveModalOpen
);

export const getSaveExchangeScopeParentPayMarketOptions = createSelector(
  selectSaveExchangeScopeState,
  fromSaveExchangeScopeReducer.getParentPayMarketOptions
);

export const getSaveExchangeScopeParentPayMarketOptionsLoading = createSelector(
  selectSaveExchangeScopeState,
  fromSaveExchangeScopeReducer.getParentPayMarketOptionsLoading
);
