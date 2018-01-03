import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeCompany } from 'libs/models';

import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

// Extended entity state
export interface State extends EntityState<ExchangeCompany> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeCompany> = createEntityAdapter<ExchangeCompany>({
  selectId: (exchangeCompany: ExchangeCompany) => exchangeCompany.CompanyId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeCompaniesActions.Actions
): State {
  switch (action.type) {
    case fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
