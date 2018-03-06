import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableExchangeItem } from 'libs/models/peer/index';

import * as fromAvailableExchangesActions from '../../actions/exchange-access/available-exchanges.actions';

export interface State extends EntityState<AvailableExchangeItem> {
  loading: boolean;
  loadingError: boolean;
  selectedExchange: AvailableExchangeItem;
}

export const adapter: EntityAdapter<AvailableExchangeItem> = createEntityAdapter<AvailableExchangeItem>({
  selectId: (availableExchangeItem: AvailableExchangeItem) => availableExchangeItem.ExchangeId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  selectedExchange: null
});

// Reducer function
export function reducer(state = initialState,  action: fromAvailableExchangesActions.Actions): State {
  switch (action.type) {
    case fromAvailableExchangesActions.LOAD_AVAILABLE_EXCHANGES: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromAvailableExchangesActions.LOAD_AVAILABLE_EXCHANGES_SUCCESS: {
      const availableExchanges: AvailableExchangeItem[] = action.payload;
      const selectedExchange = state.selectedExchange;
      const containsSelection = selectedExchange != null &&
        availableExchanges.some(ae => ae.ExchangeId === selectedExchange.ExchangeId);
      return {
        ...adapter.addAll(availableExchanges, state),
        loading: false,
        selectedExchange: containsSelection ? selectedExchange : null
      };
    }
    case fromAvailableExchangesActions.LOAD_AVAILABLE_EXCHANGES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromAvailableExchangesActions.SELECT_AVAILABLE_EXCHANGE: {
      const newSelection: AvailableExchangeItem = action.payload;
      const currentSelection = state.selectedExchange;
      const newSelectionExchangeId = !!newSelection ? newSelection.ExchangeId : 0;
      const isExchangeSelected = !!currentSelection && currentSelection.ExchangeId === newSelectionExchangeId;
      return {
        ...state,
        selectedExchange: isExchangeSelected ? null : newSelection
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
export const getExchangeSelection = (state: State) => state.selectedExchange;
