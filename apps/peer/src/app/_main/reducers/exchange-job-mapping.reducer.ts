import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobMapping } from 'libs/models/peer';
import { createGridReducer } from 'libs/common/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobMappingActions from '../actions/exchange-job-mapping.actions';

export interface State extends EntityState<ExchangeJobMapping> {
  loading: boolean;
  loadingError: boolean;
  total: number;
  query: string;
}

export const adapter: EntityAdapter<ExchangeJobMapping> = createEntityAdapter<ExchangeJobMapping>({
  selectId: (exchangeJobMapping: ExchangeJobMapping) => exchangeJobMapping.ExchangeJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
  query: ''
});


// Reducer function
export const reducer = createGridReducer(
  GridTypeEnum.ExchangeJobMapping,
  (state = initialState,  action: fromExchangeJobMappingActions.Actions): State => {
    switch (action.type) {
      case fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS: {
        return {
          ...adapter.removeAll(state),
          loading: true,
          loadingError: false
        };
      }
      case fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS_SUCCESS: {
        const exchangeJobMappings: ExchangeJobMapping[] = action.payload.data;
        return {
          ...adapter.addAll(exchangeJobMappings, state),
          total: action.payload.total,
          loading: false
        };
      }
      case fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS_ERROR: {
        return {
          ...state,
          loading: false,
          loadingError: true
        };
      }
      case fromExchangeJobMappingActions.UPDATE_EXCHANGE_JOB_MAPPINGS_QUERY: {
        return {
          ...state,
          query: action.payload
        };
      }
      default: {
        return state;
      }
  }
}, {take: 20});

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
export const getQuery = (state: State) => state.query;
