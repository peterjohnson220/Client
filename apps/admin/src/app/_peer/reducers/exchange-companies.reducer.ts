import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeCompany } from 'libs/models';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/common/core/reducers/grid.reducer';

import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';

// Extended entity state
export interface State extends EntityState<ExchangeCompany> {
  loading: boolean;
  loadingError: boolean;
  addModalOpen: boolean;
  adding: boolean;
  addingError: boolean;
  total: number;
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
  addingError: false,
  total: 0
});

// Reducer
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeCompanies,
    (featureState = initialState, featureAction: fromExchangeCompaniesActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES_SUCCESS: {
          const companies: ExchangeCompany[] = featureAction.payload.data;
          return {
            ...adapter.addAll(companies, featureState),
            loading: false,
            total: action.payload.total,
          };
        }
        case fromExchangeCompaniesActions.LOADING_EXCHANGE_COMPANIES_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromExchangeCompaniesActions.OPEN_ADD_EXCHANGE_COMPANIES_MODAL: {
          return {
            ...featureState,
            addModalOpen: true
          };
        }
        case fromExchangeCompaniesActions.CLOSE_ADD_EXCHANGE_COMPANIES_MODAL: {
          return {
            ...featureState,
            addModalOpen: false
          };
        }
        case fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES: {
          return {
            ...featureState,
            adding: true
          };
        }
        case fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES_SUCCESS: {
          return {
            ...featureState,
            adding: false,
            addModalOpen: false
          };
        }
        case fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES_ERROR: {
          return {
            ...featureState,
            adding: false,
            addingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    })(state, action);
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAddModalOpen = (state: State) => state.addModalOpen;
export const getAdding = (state: State) => state.adding;
export const getAddingError = (state: State) => state.addingError;
export const getTotal = (state: State) => state.total;
