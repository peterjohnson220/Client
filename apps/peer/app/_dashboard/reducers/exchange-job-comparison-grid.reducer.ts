import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobComparison } from 'libs/models/peer';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobComparisonGridActions from '../actions/exchange-job-comparison-grid.actions';

export interface State extends EntityState<ExchangeJobComparison> {
  loading: boolean;
  loadingError: boolean;
  total: number;
  loadingExchangeJobOrgs: boolean;
  loadingExchangeJobOrgsError: boolean;
  exchangeJobOrgs: string[];
}

export const adapter: EntityAdapter<ExchangeJobComparison> = createEntityAdapter<ExchangeJobComparison>({
  selectId: (exchangeJobComparison: ExchangeJobComparison) => exchangeJobComparison.ExchangeJobToCompanyJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
  loadingExchangeJobOrgs: false,
  loadingExchangeJobOrgsError: false,
  exchangeJobOrgs: []
});


// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeJobComparison,
    (featureState = initialState,  featureAction: fromExchangeJobComparisonGridActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeJobComparisonGridActions.LOAD_EXCHANGE_JOB_COMPARISONS: {
          return {
            ...featureState,
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobComparisonGridActions.LOAD_EXCHANGE_JOB_COMPARISONS_SUCCESS: {
          const exchangeJobMappings: ExchangeJobComparison[] = featureAction.payload.data;
          return {
            ...adapter.removeAll(featureState),
            ...adapter.setAll(exchangeJobMappings, featureState),
            total: featureAction.payload.total,
            loading: false
          };
        }
        case fromExchangeJobComparisonGridActions.LOAD_EXCHANGE_JOB_COMPARISONS_ERROR: {
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
