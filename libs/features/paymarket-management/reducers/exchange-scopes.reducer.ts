import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { ExchangeScopes } from 'libs/models/peer/exchange-scope';

import * as fromExchangeScopesActions from '../actions/exchange-scopes.actions';

export interface State {
  exchangeScopes: AsyncStateObj<ExchangeScopes[]>;
  selectedExchangeScopes: AsyncStateObj<ExchangeScopes[]>;
}

export const initialState: State = {
  exchangeScopes: generateDefaultAsyncStateObj<ExchangeScopes[]>([]),
  selectedExchangeScopes: generateDefaultAsyncStateObj<ExchangeScopes[]>([])
};

export function reducer(state = initialState, action: fromExchangeScopesActions.Actions): State {
  switch (action.type) {
    case fromExchangeScopesActions.LOAD_COMPANY_EXCHANGE_SCOPES: {
      const exchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.exchangeScopes);
      exchangeScopesClone.loading = true;
      exchangeScopesClone.loadingError = false;
      return {
        ...state,
        exchangeScopes: exchangeScopesClone
      };
    }
    case fromExchangeScopesActions.LOAD_COMPANY_EXCHANGE_SCOPES_SUCCESS: {
      const exchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.exchangeScopes);
      exchangeScopesClone.obj = orderBy(action.payload, 'ExchangeName');

      exchangeScopesClone.loading = false;
      return {
        ...state,
        exchangeScopes: exchangeScopesClone
      };
    }
    case fromExchangeScopesActions.LOAD_COMPANY_EXCHANGE_SCOPES_ERROR: {
      const exchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.exchangeScopes);
      exchangeScopesClone.loading = false;
      exchangeScopesClone.loadingError = true;
      return {
        ...state,
        exchangeScopes: exchangeScopesClone
      };
    }
    case fromExchangeScopesActions.ADD_EXCHANGE_SCOPE: {
      const selectedExchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.obj.push(action.payload);
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.REMOVE_EXCHANGE_SCOPE: {
      const selectedExchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.obj.splice(action.payload.exchangeScopeIndex, 1);
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.RESET_EXCHANGE_SCOPES: {
      const selectedExchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.loading = false;
      selectedExchangeScopesClone.loadingError = false;
      selectedExchangeScopesClone.obj = [];
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.LOAD_EXCHANGE_SCOPE_SELECTIONS: {
      const selectedExchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.loading = true;
      selectedExchangeScopesClone.loadingError = false;
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.LOAD_EXCHANGE_SCOPE_SELECTIONS_SUCCESS: {
      const selectedExchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.loading = false;
      selectedExchangeScopesClone.obj = action.payload;
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.LOAD_EXCHANGE_SCOPE_SELECTIONS_ERROR: {
      const selectedExchangeScopesClone: AsyncStateObj<ExchangeScopes[]> = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.loading = false;
      selectedExchangeScopesClone.loadingError = true;
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyExchangeScopes = (state: State) => state.exchangeScopes;
export const getSelectedExchanges = (state: State) => state.selectedExchangeScopes;
