import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableCompany } from 'libs/models/peer';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

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
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.AvailableCompanies,
    (featureState = initialState, featureAction: fromAvailableCompaniesActions.Actions): State => {
      switch (featureAction.type) {
        case fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES_SUCCESS: {
          const companies: AvailableCompany[] = featureAction.payload.data;
          return {
            ...adapter.setAll(companies, featureState),
            total: featureAction.payload.total,
            loading: false
          };
        }
        case fromAvailableCompaniesActions.LOADING_AVAILABLE_COMPANIES_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        default: {
          return featureState;
        }
      }
    }, {take: 8})(state, action);
}

// Selector Functions
export const getTotal = (state: State) => state.total;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
