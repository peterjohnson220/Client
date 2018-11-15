import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeCompanyJobActions from '../actions/exchange-company-job-grid.actions';
import { ExchangeCompanyJob } from '../models';

export interface State extends EntityState<ExchangeCompanyJob> {
  loading: boolean;
  loadingError: boolean;
  total: number;
}

export const adapter: EntityAdapter<ExchangeCompanyJob> = createEntityAdapter<ExchangeCompanyJob>({
  selectId: (exchangeCompanyJob: ExchangeCompanyJob) => exchangeCompanyJob.ExchangeJobToCompanyJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0
});


// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeCompanyJob,
    (featureState = initialState,  featureAction: fromExchangeCompanyJobActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeCompanyJobActions.LOAD_EXCHANGE_COMPANY_JOBS: {
          return {
            ...featureState,
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeCompanyJobActions.LOAD_EXCHANGE_COMPANY_JOBS_SUCCESS: {
          const exchangeJobMappings: ExchangeCompanyJob[] = featureAction.payload.data;
          const exchangeJobIdsInScope = featureAction.exchangeJobIds;
          const exchangeJobMappingsFinal = exchangeJobMappings.map(ejm => {
            return {
              ...ejm,
              IsInMapScope: exchangeJobIdsInScope.includes(ejm.ExchangeJobId)
            };
          });
          return {
            ...adapter.removeAll(featureState),
            ...adapter.addAll(exchangeJobMappingsFinal, featureState),
            total: featureAction.payload.total,
            loading: false
          };
        }
        case fromExchangeCompanyJobActions.LOAD_EXCHANGE_COMPANY_JOBS_ERROR: {
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
      take: 10
    })(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
