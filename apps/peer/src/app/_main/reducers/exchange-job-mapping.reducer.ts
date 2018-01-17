import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobMapping } from 'libs/models/peer';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobMappingActions from '../actions/exchange-job-mapping.actions';
import { UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO } from '../actions/exchange-job-mapping.actions';

export interface State extends EntityState<ExchangeJobMapping> {
  loading: boolean;
  loadingError: boolean;
  total: number;
  query: string;
  selectedMapping: ExchangeJobMapping;
  pageRowIndexToScrollTo: number;
}

export const adapter: EntityAdapter<ExchangeJobMapping> = createEntityAdapter<ExchangeJobMapping>({
  selectId: (exchangeJobMapping: ExchangeJobMapping) => exchangeJobMapping.ExchangeJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
  query: '',
  selectedMapping: null,
  pageRowIndexToScrollTo: null
});


// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeJobMapping,
    (featureState = initialState,  featureAction: fromExchangeJobMappingActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS_SUCCESS: {
          const exchangeJobMappings: ExchangeJobMapping[] = featureAction.payload.data;
          return {
            ...adapter.addAll(exchangeJobMappings, featureState),
            total: featureAction.payload.total,
            loading: false
          };
        }
        case fromExchangeJobMappingActions.LOADING_EXCHANGE_JOB_MAPPINGS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromExchangeJobMappingActions.UPDATE_EXCHANGE_JOB_MAPPINGS_QUERY: {
          return {
            ...featureState,
            query: featureAction.payload
          };
        }
        case fromExchangeJobMappingActions.SELECT_EXCHANGE_JOB_MAPPING: {
          return {
            ...featureState,
            selectedMapping: featureAction.payload
          };
        }
        case fromExchangeJobMappingActions.UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO: {
          return {
            ...featureState,
            pageRowIndexToScrollTo: featureAction.payload
          };
        }
        default: {
          return featureState;
        }
      }
    }, {take: 20})(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
export const getQuery = (state: State) => state.query;
export const getSelectedMapping = (state: State) => state.selectedMapping;
export const getPageRowIndexToScrollTo = (state: State) => state.pageRowIndexToScrollTo;
