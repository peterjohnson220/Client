import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyJobToMapTo } from 'libs/models/peer';

import * as fromExchangeJobMappingInfoActions from '../actions/exchange-job-mapping-info.actions';
import { APPLY_MAPPING_ERROR } from '../actions/exchange-job-mapping-info.actions';

export interface State extends EntityState<CompanyJobToMapTo> {
  loading: boolean;
  loadingError: boolean;
  applyingMapping: boolean;
  applyingMappingError: boolean;
  selectedMappingCompanyJobId: number;
}

export const adapter: EntityAdapter<CompanyJobToMapTo> = createEntityAdapter<CompanyJobToMapTo>({
  selectId: (exchangeJobMapping: CompanyJobToMapTo) => exchangeJobMapping.CompanyJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  applyingMapping: false,
  applyingMappingError: false,
  selectedMappingCompanyJobId: null
});

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeJobMappingInfoActions.Actions
): State {
  switch (action.type) {
    case fromExchangeJobMappingInfoActions.LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeJobMappingInfoActions.LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeJobMappingInfoActions.LOAD_COMPANY_JOBS_TO_MAP_TO_BY_QUERY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeJobMappingInfoActions.APPLY_MAPPING: {
      return {
        ...state,
        applyingMapping: true,
        applyingMappingError: false,
        selectedMappingCompanyJobId: action.payload.companyJobId
      };
    }
    case fromExchangeJobMappingInfoActions.APPLY_MAPPING_SUCCESS: {
      return {
        ...state,
        applyingMapping: false,
        selectedMappingCompanyJobId: null
      };
    }
    case fromExchangeJobMappingInfoActions.APPLY_MAPPING_ERROR: {
      return {
        ...state,
        applyingMapping: false,
        applyingMappingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getApplyingMapping = (state: State) => state.applyingMapping;
export const getApplyingMappingError = (state: State) => state.applyingMappingError;
export const getSelectedMappingCompanyJobId = (state: State) => state.selectedMappingCompanyJobId;
