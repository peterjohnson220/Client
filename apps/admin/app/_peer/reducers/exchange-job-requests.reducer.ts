import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobRequest } from 'libs/models';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromExchangeJobRequestsActions from '../actions/exchange-job-requests.actions';

// Extend Entity State
export interface State extends EntityState<ExchangeJobRequest> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeJobRequest> = createEntityAdapter<ExchangeJobRequest>({
  selectId: (exchangeJobRequest: ExchangeJobRequest) => exchangeJobRequest.JobTitle
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
    GridTypeEnum.ExchangeJobRequests,
    (featureState = initialState, featureAction: fromExchangeJobRequestsActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeJobRequestsActions.LOAD_EXCHANGE_JOB_REQUESTS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobRequestsActions.LOAD_EXCHANGE_JOB_REQUESTS_SUCCESS: {
          const requests: ExchangeJobRequest[] = featureAction.payload.data;
          return {
            ...adapter.addAll(requests, featureState),
            loading: false,
            total: action.payload.total
          };
        }
        case fromExchangeJobRequestsActions.LOAD_EXCHANGE_JOB_REQUESTS_ERROR: {
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
