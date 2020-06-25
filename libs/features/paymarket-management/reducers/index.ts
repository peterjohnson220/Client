import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPayMarketModalReducer from './paymarket-modal.reducer';
import * as fromGeneralFormReducer from './general-form.reducer';
import * as fromMdScopeReducer from './market-data-scope.reducer';
import * as fromDefaultScopesReducer from './default-scopes.reducer';
import * as fromExchangeScopesReducer from './exchange-scopes.reducer';

// Feature area state
export interface PayMarketManagementState {
  payMarketModal: fromPayMarketModalReducer.State;
  generalForm: fromGeneralFormReducer.State;
  marketDataScope: fromMdScopeReducer.State;
  defaultScopes: fromDefaultScopesReducer.State;
  exchangeScopes: fromExchangeScopesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_paymarket_management: PayMarketManagementState;
}

// Feature area reducers
export const reducers = {
  payMarketModal: fromPayMarketModalReducer.reducer,
  generalForm: fromGeneralFormReducer.reducer,
  marketDataScope: fromMdScopeReducer.reducer,
  defaultScopes: fromDefaultScopesReducer.reducer,
  exchangeScopes: fromExchangeScopesReducer.reducer
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
export const selectDefaultScopesState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.defaultScopes);
export const selectExchangeScopesState =
  createSelector(selectPayMarketManagementFeature, (state: PayMarketManagementState) => state.exchangeScopes);

// Pay Market Modal
export const getPayMarketModalOpen = createSelector(selectPayMarketModalState, fromPayMarketModalReducer.getPayMarketModalOpen);
export const getPayMarketId = createSelector(selectPayMarketModalState, fromPayMarketModalReducer.getPayMarketId);
export const getPayMarket = createSelector(selectPayMarketModalState, fromPayMarketModalReducer.getPayMarket);
export const getPayMarketErrorMessage = createSelector(selectPayMarketModalState, fromPayMarketModalReducer.getPayMarketErrorMessage);

// General Form
export const getCountries = createSelector(selectGeneralFormState, fromGeneralFormReducer.getCountries);
export const getCurrencies = createSelector(selectGeneralFormState, fromGeneralFormReducer.getCurrencies);
export const getLinkedPayMarkets = createSelector(selectGeneralFormState, fromGeneralFormReducer.getLinkedPayMarkets);

// Market Data Scope
export const getAllIndustries = createSelector(selectMdScopeState, fromMdScopeReducer.getAllIndustries);
export const getSizes = createSelector(selectMdScopeState, fromMdScopeReducer.getSizes);
export const getLocations = createSelector(selectMdScopeState, fromMdScopeReducer.getLocations);

// Default Scopes
export const getCompanySurveys = createSelector(selectDefaultScopesState, fromDefaultScopesReducer.getCompanySurveys);
export const getHasMoreCompanySurveys = createSelector(selectDefaultScopesState, fromDefaultScopesReducer.getHasMoreCompanySurveys);
export const getCombinedScopes = createSelector(selectDefaultScopesState, fromDefaultScopesReducer.getCombinedScopes);
export const getDefaultScopes = createSelector(selectDefaultScopesState, fromDefaultScopesReducer.getDefaultScopes);
export const getDefaultScopesToDelete = createSelector(selectDefaultScopesState, fromDefaultScopesReducer.getDefaultScopesToDelete);
export const getDefaultScopesToAdd = createSelector(selectDefaultScopesState, fromDefaultScopesReducer.getDefaultScopesToAdd);

// Exchange Scopes
export const getCompanyExchangeScopes = createSelector(selectExchangeScopesState, fromExchangeScopesReducer.getCompanyExchangeScopes);
export const getSelectedExchanges = createSelector(selectExchangeScopesState, fromExchangeScopesReducer.getSelectedExchanges);
