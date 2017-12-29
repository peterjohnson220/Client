import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableCompany } from 'libs/models/peer';
import * as fromAvailableCompaniesActions from '../actions/available-companies.actions';

// Extended entity state
export interface State extends EntityState<AvailableCompany> {
  total: number;
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<AvailableCompany> = createEntityAdapter<AvailableCompany>({
  selectId: (availableCompany: AvailableCompany) => availableCompany.CompanyId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  total: 0,
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromAvailableCompaniesActions.Actions
): State {
  switch (action.type) {
    case fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES_SUCCESS: {
      const companies: AvailableCompany[] = action.payload.data;
      return {
        ...adapter.addAll(companies, state),
        total: action.payload.total,
        loading: false
      };
    }
    case fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES_ERROR: {
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
export const getTotal = (state: State) => state.total;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
