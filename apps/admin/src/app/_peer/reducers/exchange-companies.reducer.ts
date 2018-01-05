import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeCompany } from 'libs/models';

import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

// Extended entity state
export interface State extends EntityState<ExchangeCompany> {
  loading: boolean;
  loadingError: boolean;
  addModalOpen: boolean;
  adding: boolean;
  addingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeCompany> = createEntityAdapter<ExchangeCompany>({
  selectId: (exchangeCompany: ExchangeCompany) => exchangeCompany.CompanyId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  addModalOpen: false,
  adding: false,
  addingError: false
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
    case fromExchangeCompaniesActions.OPEN_ADD_EXCHANGE_COMPANIES_MODAL: {
      return {
        ...state,
        addModalOpen: true
      };
    }
    case fromExchangeCompaniesActions.CLOSE_ADD_EXCHANGE_COMPANIES_MODAL: {
      return {
        ...state,
        addModalOpen: false
      };
    }
    case fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES: {
      return {
        ...state,
        adding: true
      };
    }
    case fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES_SUCCESS: {
      return {
        ...state,
        adding: false,
        addModalOpen: false
      };
    }
    case fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES_ERROR: {
      return {
        ...state,
        adding: false,
        addingError: true
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
export const getAddModalOpen = (state: State) => state.addModalOpen;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
