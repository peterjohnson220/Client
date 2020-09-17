import * as fromPaymarketExchangeScopeActions from '../actions/paymarket-exchange-scope.actions';
import { GenericKeyValue } from 'libs/models/common';
import {ExchangeScopes} from 'libs/models/peer/exchange-scope';

// Extended entity state
export interface State {
  isLoading: boolean;
  loadingError: boolean;
  exchangeScopes: ExchangeScopes[];
  selectedExchangeScopes: GenericKeyValue<number, number>[];
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
    featureState = initialState,
    featureAction: fromPaymarketExchangeScopeActions.Actions
): State {
  switch (featureAction.type) {

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES:
    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS: {
      return {
        ...featureState,
        isLoading: true,
        loadingError: false
      };
    }

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES_SUCCESS: {
      return {
        ...featureState,
        isLoading: false,
        loadingError: false,
        exchangeScopes: featureAction.payload
      };
    }

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPES_ERROR:
    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS_ERROR: {
      return {
        ...featureState,
        isLoading: false,
        loadingError: true
      };
    }

    case fromPaymarketExchangeScopeActions.LOAD_EXCHANGE_SCOPE_SELECTIONS_SUCCESS: {
      return {
        ...featureState,
        isLoading: false,
        loadingError: false,
        selectedExchangeScopes: featureAction.payload
      };
    }

    case fromPaymarketExchangeScopeActions.ADD_ROW: {
      const newSelectedExchangeScope: GenericKeyValue<number, number>[] = [];
      newSelectedExchangeScope.push({Key: 0, Value: null});
      newSelectedExchangeScope.push(...featureState.selectedExchangeScopes);
      return {
        ...featureState,
        selectedExchangeScopes: newSelectedExchangeScope
      };
    }

    case fromPaymarketExchangeScopeActions.DELETE_ROW: {
      const newSelectedExchangeScopes =
        featureState.selectedExchangeScopes.filter((item, index) => index !== featureAction.row);
      return {
        ...featureState,
        selectedExchangeScopes: newSelectedExchangeScopes
      };
    }

    case  fromPaymarketExchangeScopeActions.SELECT_EXCHANGE: {
      const selectedExchangeScopes = [...featureState.selectedExchangeScopes];
      if (featureAction.payload.Row >= 0 && featureAction.payload.ExchangeId >= 0) {
        selectedExchangeScopes[featureAction.payload.Row] = {
          Key: featureAction.payload.ExchangeId,
          Value: featureAction.payload.ScopeId
        };
      }
      return {
        ...featureState,
        selectedExchangeScopes: selectedExchangeScopes
      };
    }

    case fromPaymarketExchangeScopeActions.SELECT_SCOPE: {
      const selectedExchangeScopes = [...featureState.selectedExchangeScopes];
      if (featureAction.payload.Row >= 0) {
        const exchangeId = selectedExchangeScopes[featureAction.payload.Row].Key;
        const scopeId = featureAction.payload.ScopeId;
        selectedExchangeScopes[featureAction.payload.Row] = {
          Key: exchangeId,
          Value: scopeId
        };
      }

      return {
        ...featureState,
        selectedExchangeScopes: selectedExchangeScopes
      };
    }

    default: {
      return featureState;
    }
  }
}

export const getExchangeScopesIsLoading = (state: State) => state.isLoading;
export const getExchangeScopeLoadingError = (state: State) => state.loadingError;
export const getExchangeScopes = (state: State) => state.exchangeScopes;
export const getSelectedExchangeScopes = (state: State) => state.selectedExchangeScopes;
