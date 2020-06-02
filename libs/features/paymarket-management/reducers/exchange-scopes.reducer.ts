import { cloneDeep, orderBy } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { ExchangeScopes } from 'libs/models/peer/exchange-scope';

import * as fromExchangeScopesActions from '../actions/exchange-scopes.actions';

export interface State {
  exchangeScopes: AsyncStateObj<ExchangeScopes[]>;
  selectedExchangeScopes: ExchangeScopes[];
}

export const initialState: State = {
  exchangeScopes: generateDefaultAsyncStateObj<ExchangeScopes[]>([]),
  selectedExchangeScopes: []
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
      const selectedExchangeScopesClone: ExchangeScopes[] = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.push(action.payload);
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.REMOVE_EXCHANGE_SCOPE: {
      const selectedExchangeScopesClone: ExchangeScopes[] = cloneDeep(state.selectedExchangeScopes);
      selectedExchangeScopesClone.splice(action.payload.exchangeScopeIndex, 1);
      return {
        ...state,
        selectedExchangeScopes: selectedExchangeScopesClone
      };
    }
    case fromExchangeScopesActions.RESET_EXCHANGE_SCOPES: {
      return {
        ...state,
        selectedExchangeScopes: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyExchangeScopes = (state: State) => state.exchangeScopes;
export const getSelectedExchanges = (state: State) => state.selectedExchangeScopes;
