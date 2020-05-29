import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeListItem } from 'libs/models/peer';

import * as fromExchangeSelectorActions from '../actions/exchange-selector.actions';

export interface State extends EntityState<ExchangeListItem> {
  loading: boolean;
  loadingError: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<ExchangeListItem> = createEntityAdapter<ExchangeListItem>({
  selectId: (exchangeListItem: ExchangeListItem) => exchangeListItem.ExchangeId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  loaded: true
});

// Reducer function
export function reducer(state = initialState, action: fromExchangeSelectorActions.Actions): State {
  switch (action.type) {
    case fromExchangeSelectorActions.LOAD_EXCHANGES: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false,
        loaded: false
      };
    }
    case fromExchangeSelectorActions.LOAD_EXCHANGES_SUCCESS: {
      const nonPendingExchanges = action.payload.filter(p => !p.PendingAccess);

      return {
        ...adapter.setAll(nonPendingExchanges, state),
        loading: false,
        loaded: true
      };
    }
    case fromExchangeSelectorActions.LOAD_EXCHANGES_ERROR: {
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
export const getLoaded = (state: State) => state.loaded;
