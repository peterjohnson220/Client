import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { GenericKeyValue} from 'libs/models/common';

import * as fromExchangeOptionsActions from '../../actions/exchange-job-association-utility/exchange-options.actions';

// Extended entity state
export interface State extends EntityState<GenericKeyValue<number, string>> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<GenericKeyValue<number, string>> = createEntityAdapter<GenericKeyValue<number, string>>({
  selectId: (exchangeOption: GenericKeyValue<number, string>) => exchangeOption.Key
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeOptionsActions.Actions
): State {
  switch (action.type) {
    case fromExchangeOptionsActions.LOAD_EXCHANGE_OPTIONS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeOptionsActions.LOAD_EXCHANGE_OPTIONS_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeOptionsActions.LOAD_EXCHANGE_OPTIONS_ERROR: {
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
