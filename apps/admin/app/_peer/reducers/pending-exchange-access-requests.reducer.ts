import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { PendingExchangeAccessRequestsInfo } from 'libs/models';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromPendingExchangeAccessRequestsActions from '../actions/pending-exchange-access-requests.actions';

// Extended entity state
export interface State extends EntityState<PendingExchangeAccessRequestsInfo> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<PendingExchangeAccessRequestsInfo> = createEntityAdapter<PendingExchangeAccessRequestsInfo>({
  selectId: (pendingExchangeAccessRequestsInfo: PendingExchangeAccessRequestsInfo) => pendingExchangeAccessRequestsInfo.CompanyId
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
    GridTypeEnum.PendingExchangeAccessRequests,
    (featureState = initialState, featureAction: fromPendingExchangeAccessRequestsActions.Actions): State => {
      switch (featureAction.type) {
        case fromPendingExchangeAccessRequestsActions.LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromPendingExchangeAccessRequestsActions.LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS_SUCCESS: {
          const requests: PendingExchangeAccessRequestsInfo[] = featureAction.payload.data;
          return {
            ...adapter.addAll(requests, featureState),
            loading: false,
            total: action.payload.total
          };
        }
        case fromPendingExchangeAccessRequestsActions.LOAD_PENDING_EXCHANGE_ACCESS_REQUESTS_ERROR: {
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
