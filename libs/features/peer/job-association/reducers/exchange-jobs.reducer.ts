// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';
import { ExchangeJob } from '../models/';

import * as fromPeerExchangeJobsActions from '../actions/exchange-jobs.actions';

export interface State extends EntityState<ExchangeJob> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

// Define our Adapter
export const adapter: EntityAdapter<ExchangeJob> = createEntityAdapter<ExchangeJob>({
  selectId: (exchangeJob: ExchangeJob) => exchangeJob.ExchangeJobId
});

// Define our initial state
const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
});

// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.JobAssociationModalPeerExchangeJobs,
    (featureState = initialState,  featureAction: fromPeerExchangeJobsActions.Actions): State => {
      switch (featureAction.type) {
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS_SUCCESS: {
          const payMarketList: ExchangeJob[] = featureAction.payload.data;
          return {
            ...adapter.addAll(payMarketList, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false
          };
        }
        case fromPeerExchangeJobsActions.LOAD_EXCHANGE_JOBS_ERROR: {
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
    }, {
      take: 50
    })(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
