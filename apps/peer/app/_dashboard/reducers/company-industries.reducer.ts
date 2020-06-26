import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromCompanyIndustriesActions from '../actions/company-industries.actions';

export interface State extends EntityState<string> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<string> = createEntityAdapter<string>({
  selectId: x => x,
  sortComparer: (a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer function
export function reducer(state = initialState, action: fromCompanyIndustriesActions.Actions): State {
  switch (action.type) {
    case fromCompanyIndustriesActions.LOAD_COMPANY_INDUSTRIES: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromCompanyIndustriesActions.LOAD_COMPANY_INDUSTRIES_SUCCESS: {
      const exchangeJobMappings: string[] = action.payload;
      return {
        ...adapter.setAll(exchangeJobMappings, state),
        loading: false
      };
    }
    case fromCompanyIndustriesActions.LOAD_COMPANY_INDUSTRIES_ERROR: {
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

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
