import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Company } from 'libs/models/company/company.model';

import * as fromCompanySelectorActions from '../actions/company-selector.actions';

export interface State extends EntityState<Company> {
  loadingCompanies: boolean;
  loadingCompaniesError: boolean;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>({
  selectId: (x: Company) => x.CompanyId
});

const initialState: State = adapter.getInitialState({
  loadingCompanies: false,
  loadingCompaniesError: false
});

export function reducer(state = initialState, action: fromCompanySelectorActions.Actions): State {
  switch (action.type) {
    case fromCompanySelectorActions.LOADING_COMPANIES: {
      return {
        ...adapter.removeAll(state),
        loadingCompanies: true,
        loadingCompaniesError: false
      };
    }
    case fromCompanySelectorActions.LOADING_COMPANIES_ERROR: {
      return {
        ...state,
        loadingCompanies: false,
        loadingCompaniesError: true
      };
    }
    case fromCompanySelectorActions.LOADING_COMPANIES_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loadingCompanies: false,
        loadingCompaniesError: false,
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingCompanies = (state: State) => state.loadingCompanies;
export const getLoadingCompaniesError = (state: State) => state.loadingCompaniesError;
