// Import all exports from our feature's actions
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromPeerExchangeJobsActions from '../actions/exchange-jobs.actions';
import { CompanyJob, ExchangeJob, ExchangeJobAssociation } from '../models/';

export interface State extends EntityState<ExchangeJob> {
  loading: boolean;
  loadingError: boolean;
  total: number;
  searchTerm: string;
  ExchangeJobAssociations: ExchangeJobAssociation[];
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
  searchTerm: '',
  ExchangeJobAssociations: []
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
        case fromPeerExchangeJobsActions.UPDATE_SEARCH_TERM: {
          return {
            ...featureState,
            searchTerm: featureAction.payload
          };
        }
        case fromPeerExchangeJobsActions.ADD_ASSOCIATION: {
          const exchangeJobAssociations = [...featureState.ExchangeJobAssociations];
          exchangeJobAssociations.push(featureAction.payload);
          return {
            ...featureState,
            ExchangeJobAssociations: exchangeJobAssociations
          };
        }
        case fromPeerExchangeJobsActions.REMOVE_ASSOCIATION: {
          const exchangeJobAssociations: ExchangeJobAssociation[] = [];
          featureState.ExchangeJobAssociations.forEach(exchangeJobAssociation => {
            let companyJobs: CompanyJob[] = exchangeJobAssociation.CompanyJobs;
            if (exchangeJobAssociation.ExchangeId === featureAction.exchangeId &&
                exchangeJobAssociation.ExchangeJobId === featureAction.exchangeJobId) {
              companyJobs = exchangeJobAssociation.CompanyJobs
                  .filter(cj => cj.CompanyJobId !== featureAction.companyJobId);
            }
            exchangeJobAssociations.push({
              ExchangeId: exchangeJobAssociation.ExchangeId,
              ExchangeJobId: exchangeJobAssociation.ExchangeJobId,
              CompanyJobs: companyJobs
            });
          });
          return {
            ...featureState,
            ExchangeJobAssociations: exchangeJobAssociations
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
