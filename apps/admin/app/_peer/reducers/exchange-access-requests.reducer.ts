import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeAccessRequest } from 'libs/models';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromExchangeAccessRequestsActions from '../actions/exchange-access-requests.actions';

// Extended entity state
export interface State extends EntityState<ExchangeAccessRequest> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeAccessRequest> = createEntityAdapter<ExchangeAccessRequest>({
  selectId: (exchangeAccessRequestsInfo: ExchangeAccessRequest) => exchangeAccessRequestsInfo.CompanyId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0
});

// Reducer
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeAccessRequests,
    (featureState = initialState, featureAction: fromExchangeAccessRequestsActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeAccessRequestsActions.LOAD_EXCHANGE_ACCESS_REQUESTS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeAccessRequestsActions.LOAD_EXCHANGE_ACCESS_REQUESTS_SUCCESS: {
          const requests: ExchangeAccessRequest[] = featureAction.payload.data;
          return {
            ...adapter.setAll(requests, featureState),
            loading: false,
            total: action.payload.total
          };
        }
        case fromExchangeAccessRequestsActions.LOAD_EXCHANGE_ACCESS_REQUESTS_ERROR: {
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
    })(state, action);
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
