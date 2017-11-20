import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeListItem } from '../../../../../../libs/models';

import * as fromExchangeListActions from '../actions/exchange-list.actions';

// Extended entity state
export interface State extends EntityState<ExchangeListItem> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeListItem> = createEntityAdapter<ExchangeListItem>({
  selectId: (exchangeListItem: ExchangeListItem) => exchangeListItem.ExchangeId
});


// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});


// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeListActions.Actions
): State {
  switch (action.type) {
    case fromExchangeListActions.LOADING_EXCHANGES: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeListActions.LOADING_EXCHANGES_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeListActions.LOADING_EXCHANGES_ERROR: {
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
