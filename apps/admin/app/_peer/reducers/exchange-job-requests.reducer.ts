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
  selectedJobRequest: ExchangeJobRequest;
  pageRowIndex: number;
  jobRequestDenyModalOpen: boolean;
  jobRequestApproveModalOpen: boolean;
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
  selectedJobRequest: null,
  pageRowIndex: null,
  jobRequestDenyModalOpen: false,
  jobRequestApproveModalOpen: false,
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
            ...initialState,
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobRequestsActions.LOAD_EXCHANGE_JOB_REQUESTS_SUCCESS: {
          const requests: ExchangeJobRequest[] = featureAction.payload.data;
          return {
            ...adapter.setAll(requests, featureState),
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
            jobRequestInfoOpen: false,
            selectedJobRequest: null,
            pageRowIndex: null,
            jobRequestApproveModalOpen: false
          };
        }
        case fromExchangeJobRequestsActions.APPROVE_EXCHANGE_JOB_REQUEST_ERROR: {
          return {
            ...featureState,
            approving: false,
            approvingError: true,
            jobRequestApproveModalOpen: false
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
            jobRequestInfoOpen: false,
            selectedJobRequest: null,
            pageRowIndex: null,
            jobRequestDenyModalOpen: false
          };
        }
        case fromExchangeJobRequestsActions.DENY_EXCHANGE_JOB_REQUEST_ERROR: {
          return {
            ...featureState,
            denying: false,
            denyingError: true,
            jobRequestDenyModalOpen: false
          };
        }
        case fromExchangeJobRequestsActions.OPEN_JOB_REQUEST_INFO: {
          return {
            ...featureState,
            jobRequestInfoOpen: true,
            approvingError: false,
            denyingError: false,
            selectedJobRequest: featureAction.payload.selectedJobRequest,
            pageRowIndex: featureAction.payload.pageRowIndex
          };
        }
        case fromExchangeJobRequestsActions.CLOSE_JOB_REQUEST_INFO: {
          return {
            ...featureState,
            jobRequestInfoOpen: false,
            approvingError: false,
            denyingError: false,
            selectedJobRequest: null,
            pageRowIndex: null
          };
        }
        case fromExchangeJobRequestsActions.OPEN_JOB_REQUEST_DENY_MODAL: {
          return {
            ...featureState,
            jobRequestDenyModalOpen: true
          };
        }
        case fromExchangeJobRequestsActions.CLOSE_JOB_REQUEST_DENY_MODAL: {
          return {
            ...featureState,
            jobRequestDenyModalOpen: false
          };
        }
        case fromExchangeJobRequestsActions.OPEN_JOB_REQUEST_APPROVE_MODAL: {
          return {
            ...featureState,
            jobRequestApproveModalOpen: true
          };
        }
        case fromExchangeJobRequestsActions.CLOSE_JOB_REQUEST_APPROVE_MODAL: {
          return {
            ...featureState,
            jobRequestApproveModalOpen: false
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
export const getSelectedJobRequest = (state: State) => state.selectedJobRequest;
export const getPageRowIndex = (state: State) => state.pageRowIndex;
export const getJobRequestDenyModalOpen = (state: State) => state.jobRequestDenyModalOpen;
export const getJobRequestApproveModalOpen = (state: State) => state.jobRequestApproveModalOpen;
