import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeJobMapping } from 'libs/models/peer';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';
import { GridTypeEnum } from 'libs/models/common';

import * as fromExchangeJobMappingGridActions from '../../_manage/actions/exchange-job-mapping-grid.actions';

export interface State extends EntityState<ExchangeJobMapping> {
  loading: boolean;
  loadingError: boolean;
  total: number;
  selectedMapping: ExchangeJobMapping;
  pageRowIndexToScrollTo: number;
}

export const adapter: EntityAdapter<ExchangeJobMapping> = createEntityAdapter<ExchangeJobMapping>({
  selectId: (exchangeJobMapping: ExchangeJobMapping) => exchangeJobMapping.Id
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  total: 0,
  selectedMapping: null,
  pageRowIndexToScrollTo: null
});


// Reducer function
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.ExchangeJobMapping,
    (featureState = initialState, featureAction: fromExchangeJobMappingGridActions.Actions): State => {
      switch (featureAction.type) {
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_AFTER_MAP: {
          return {
            ...featureState,
            loading: true,
            loadingError: false
          };
        }
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_SUCCESS: {
          const exchangeJobMappings: ExchangeJobMapping[] = featureAction.payload.data;
          return {
            ...adapter.setAll(exchangeJobMappings, featureState),
            total: featureAction.payload.total,
            loading: false,
            loadingError: false
          };
        }
        case fromExchangeJobMappingGridActions.LOAD_EXCHANGE_JOB_MAPPINGS_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromExchangeJobMappingGridActions.SET_ACTIVE_EXCHANGE_JOB: {
          return {
            ...featureState,
            selectedMapping: featureAction.payload,
          };
        }
        case fromExchangeJobMappingGridActions.RESET_ACTIVE_EXCHANGE_JOB: {
          return {
            ...featureState,
            selectedMapping: findSelectedJobMapping(Object.values(featureState.entities), featureState.selectedMapping)
          };
        }
        case fromExchangeJobMappingGridActions.UPDATE_PAGE_ROW_INDEX_TO_SCROLL_TO: {
          return {
            ...featureState,
            pageRowIndexToScrollTo: featureAction.payload
          };
        }
        default: {
          return featureState;
        }
      }
    }, {
      take: 20
    })(state, action);
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
export const getSelectedMapping = (state: State) => state.selectedMapping;
export const getPageRowIndexToScrollTo = (state: State) => state.pageRowIndexToScrollTo;


// Helper functions
function findSelectedJobMapping(exchangeJobMappings: ExchangeJobMapping[], selectedJobMapping: ExchangeJobMapping) {
  if (!selectedJobMapping) { return null; }

  return exchangeJobMappings.find(ejm => ejm.Id === selectedJobMapping.Id);
}
