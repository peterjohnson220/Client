import * as fromPaymarketExchangeScopeActions from '../actions/paymarket-exchange-scope.actions';
import { GenericKeyValue } from 'libs/models/common';
import {ExchangeScopes} from 'libs/models/peer/exchange-scope';

// Extended entity state
export interface State {
  isLoading: boolean;
  loadingError: boolean;
  exchangeScopes: ExchangeScopes[];
  selectedExchangeScopes: GenericKeyValue<number, string>[];
}

// Initial State
export const initialState: State = {
  isLoading: false,
  loadingError: false,
  exchangeScopes: [],
  selectedExchangeScopes: [],
};

// Reducer
export function reducer(
    featureSate = initialState,
    featureAction: fromPaymarketExchangeScopeActions.Actions
): State {
  switch (featureAction.type) {

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES:
    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS: {
      return {
        ...featureSate,
        isLoading: true,
        loadingError: false
      };
    }

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES_SUCCESS: {
      return {
        ...featureSate,
        isLoading: false,
        loadingError: false,
        exchangeScopes: featureAction.payload
      };
    }

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES_ERROR:
    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS_ERROR: {
      return {
        ...featureSate,
        isLoading: false,
        loadingError: true
      };
    }

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS_SUCCESS: {
      return {
        ...featureSate,
        isLoading: false,
        loadingError: false,
        selectedExchangeScopes: featureAction.payload
      };
    }

    case fromPaymarketExchangeScopeActions.ADD_ROW: {
      const newSelectedExchangeScope: GenericKeyValue<number, string>[] = [];
      newSelectedExchangeScope.push({Key: 0, Value: null});
      newSelectedExchangeScope.push(...featureSate.selectedExchangeScopes);
      return {
        ...featureSate,
        selectedExchangeScopes: newSelectedExchangeScope
      };
    }

    case fromPaymarketExchangeScopeActions.DELETE_ROW: {
      const newSelectedExchangeScopes =
        featureSate.selectedExchangeScopes.filter((item, index) => index !== featureAction.row);
      return {
        ...featureSate,
        selectedExchangeScopes: newSelectedExchangeScopes
      };
    }

    case  fromPaymarketExchangeScopeActions.SELECT_EXCHANGE: {
      const selectedExchangeScopes = [...featureSate.selectedExchangeScopes];
      if (featureAction.payload.Row >= 0 && featureAction.payload.ExchangeId >= 0) {
        selectedExchangeScopes[featureAction.payload.Row] = {
          Key: featureAction.payload.ExchangeId,
          Value: featureAction.payload.ScopeId
        };
      }
      return {
        ...featureSate,
        selectedExchangeScopes: selectedExchangeScopes
      };
    }

    case fromPaymarketExchangeScopeActions.SELECT_SCOPE: {
      const selectedExchangeScopes = [...featureSate.selectedExchangeScopes];
      if (featureAction.payload.Row >= 0) {
        const exchangeId = selectedExchangeScopes[featureAction.payload.Row].Key;
        const scopeId = featureAction.payload.ScopeId;
        selectedExchangeScopes[featureAction.payload.Row] = {
          Key: exchangeId,
          Value: scopeId
        };
      }

      return {
        ...featureSate,
        selectedExchangeScopes: selectedExchangeScopes
      };
    }

    default: {
      return featureSate;
    }
  }
}

export const getExchangeScopesIsLoading = (state: State) => state.isLoading;
export const getExchangeScopeLoadingError = (state: State) => state.loadingError;
export const getExchangeScopes = (state: State) => state.exchangeScopes;
export const getSelectedExchangeScopes = (state: State) => state.selectedExchangeScopes;
