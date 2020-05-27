import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPayMarketModalReducer from './paymarket-modal.reducer';
import * as fromGeneralFormReducer from './general-form.reducer';
import * as fromMdScopeReducer from './market-data-scope.reducer';

// Feature area state
export interface PayMarketManagementState {
  payMarketModal: fromPayMarketModalReducer.State;
  generalForm: fromGeneralFormReducer.State;
  marketDataScope: fromMdScopeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_paymarket_management: PayMarketManagementState;
}

// Feature area reducers
export const reducers = {
  payMarketModal: fromPayMarketModalReducer.reducer,
  generalForm: fromGeneralFormReducer.reducer,
  marketDataScope: fromMdScopeReducer.reducer
};

// Select Feature Area
export const selectPayMarketManagementFeature =
  createFeatureSelector<PayMarketManagementState>('feature_paymarket_management');

// View Selectors
export const selectPayMarketModalState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.payMarketModal);
export const selectGeneralFormState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.generalForm);
export const selectMdScopeState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.marketDataScope);

// Pay Market Modal
export const getPayMarketModalOpen = createSelector(selectPayMarketModalState, fromPayMarketModalReducer.getPayMarketModalOpen);

// General Form
export const getCountries = createSelector(selectGeneralFormState, fromGeneralFormReducer.getCountries);
export const getCurrencies = createSelector(selectGeneralFormState, fromGeneralFormReducer.getCurrencies);
export const getLinkedPayMarkets = createSelector(selectGeneralFormState, fromGeneralFormReducer.getLinkedPayMarkets);
export const getDefaultPayMarket = createSelector(selectGeneralFormState, fromGeneralFormReducer.getDefaultPayMarket);

// Market Data Scope
export const getAllIndustries = createSelector(selectMdScopeState, fromMdScopeReducer.getAllIndustries);
export const getSizes = createSelector(selectMdScopeState, fromMdScopeReducer.getSizes);
export const getLocations = createSelector(selectMdScopeState, fromMdScopeReducer.getLocations);