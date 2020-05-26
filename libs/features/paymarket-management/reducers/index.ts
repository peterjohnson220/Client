import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPayMarketModalReducer from './paymarket-modal.reducer';
import * as fromGeneralFormReducer from './general-form.reducer';

// Feature area state
export interface PayMarketManagementState {
  payMarketModal: fromPayMarketModalReducer.State;
  generalForm: fromGeneralFormReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_paymarket_management: PayMarketManagementState;
}

// Feature area reducers
export const reducers = {
  payMarketModal: fromPayMarketModalReducer.reducer,
  generalForm: fromGeneralFormReducer.reducer
};

// Select Feature Area
export const selectPayMarketManagementFeature =
  createFeatureSelector<PayMarketManagementState>('feature_paymarket_management');

// View Selectors
export const selectPayMarketModalState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.payMarketModal);
export const selectGeneralFormState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.generalForm);

// Pay Market Modal
export const getPayMarketModalOpen = createSelector(selectPayMarketModalState, fromPayMarketModalReducer.getPayMarketModalOpen);

// General Form
export const getCountries = createSelector(selectGeneralFormState, fromGeneralFormReducer.getCountries);
export const getCurrencies = createSelector(selectGeneralFormState, fromGeneralFormReducer.getCurrencies);
export const getLinkedPayMarkets = createSelector(selectGeneralFormState, fromGeneralFormReducer.getLinkedPayMarkets);
export const getSizes = createSelector(selectGeneralFormState, fromGeneralFormReducer.getSizes);
export const getDefaultPayMarket = createSelector(selectGeneralFormState, fromGeneralFormReducer.getDefaultPayMarket);
export const getAllIndustries = createSelector(selectGeneralFormState, fromGeneralFormReducer.getAllIndustries);
export const getLocations = createSelector(selectGeneralFormState, fromGeneralFormReducer.getLocations);
