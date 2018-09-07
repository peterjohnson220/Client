import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobRequest } from 'libs/models';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromExchangeJobRequestsActions from '../actions/exchange-job-requests.actions';

// Extend Entity State
export interface State extends EntityState<ExchangeJobRequest> {
  loading: boolean;
  loadingError: boolean;
  approving: boolean;
  approvingError: boolean;
  denying: boolean;
  denyingError: boolean;
  jobRequestInfoOpen: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeJobRequest> = createEntityAdapter<ExchangeJobRequest>({
  selectId: (exchangeJobRequest: ExchangeJobRequest) => exchangeJobRequest.DocumentId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  approving: false,
  approvingError: false,
  denying: false,
  denyingError: false,
  jobRequestInfoOpen: false,
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
        case fromExchangeJobRequestsActions.APPROVE_EXCHANGE_JOB_REQUEST: {
          return {
            ...featureState,
            approving: true,
            approvingError: false,
            denying: false,
            denyingError: false
          };
        }
        case fromExchangeJobRequestsActions.APPROVE_EXCHANGE_JOB_REQUEST_SUCCESS: {
          return {
            ...featureState,
            approving: false,
            approvingError: false,
            jobRequestInfoOpen: false
          };
        }
        case fromExchangeJobRequestsActions.APPROVE_EXCHANGE_JOB_REQUEST_ERROR: {
          return {
            ...featureState,
            approving: false,
            approvingError: true
          };
        }
        case fromExchangeJobRequestsActions.DENY_EXCHANGE_JOB_REQUEST: {
          return {
            ...featureState,
            denying: true,
            denyingError: false,
            approving: false,
            approvingError: false
          };
        }
        case fromExchangeJobRequestsActions.DENY_EXCHANGE_JOB_REQUEST_SUCCESS: {
          return {
            ...featureState,
            denying: false,
            denyingError: false,
            jobRequestInfoOpen: false
          };
        }
        case fromExchangeJobRequestsActions.DENY_EXCHANGE_JOB_REQUEST_ERROR: {
          return {
            ...featureState,
            denying: false,
            denyingError: true
          };
        }
        case fromExchangeJobRequestsActions.OPEN_JOB_REQUEST_INFO: {
          return {
            ...featureState,
            jobRequestInfoOpen: true,
            approvingError: false,
            denyingError: false
          };
        }
        case fromExchangeJobRequestsActions.CLOSE_JOB_REQUEST_INFO: {
          return {
            ...featureState,
            jobRequestInfoOpen: false,
            approvingError: false,
            denyingError: false
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
export const getApproving = (state: State) => state.approving;
export const getApprovingError = (state: State) => state.approvingError;
export const getDenying = (state: State) => state.denying;
export const getDenyingError = (state: State) => state.denyingError;
export const getJobRequestInfoOpen = (state: State) => state.jobRequestInfoOpen;
