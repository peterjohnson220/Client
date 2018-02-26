import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { AvailableExchangeItem } from 'libs/models/peer/index';

import * as fromAvailableExchangesActions from '../../actions/exchange-access/available-exchanges.actions';

export interface State extends EntityState<AvailableExchangeItem> {
  loading: boolean;
  loadingError: boolean;
}

export const adapter: EntityAdapter<AvailableExchangeItem> = createEntityAdapter<AvailableExchangeItem>({
  selectId: (availableExchangeItem: AvailableExchangeItem) => availableExchangeItem.ExchangeId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
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
      const exchangeJobMappings: AvailableExchangeItem[] = action.payload;
      return {
        ...adapter.addAll(exchangeJobMappings, state),
        loading: false
      };
    }
    case fromAvailableExchangesActions.LOAD_AVAILABLE_EXCHANGES_ERROR: {
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
