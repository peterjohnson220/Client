import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyJobToMapTo } from 'libs/models/peer';

import * as fromExchangeJobMappingInfoActions from '../../_manage/actions/exchange-job-mapping-info.actions';

export interface State extends EntityState<CompanyJobToMapTo> {
  loading: boolean;
  loadingError: boolean;
  applyingMapping: boolean;
  applyingMappingError: boolean;
  selectedMappingCompanyJobId: number;
  editingMapping: boolean;
}

export const adapter: EntityAdapter<CompanyJobToMapTo> = createEntityAdapter<CompanyJobToMapTo>({
  selectId: (exchangeJobMapping: CompanyJobToMapTo) => exchangeJobMapping.CompanyJobId
});

const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  applyingMapping: false,
  applyingMappingError: false,
  selectedMappingCompanyJobId: null,
  editingMapping: false
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
        selectedMappingCompanyJobId: action.payload.CompanyJobId
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
    case fromExchangeJobMappingInfoActions.EDIT_MAPPING: {
      return {
        ...state,
        editingMapping: true
      };
    }
    case fromExchangeJobMappingInfoActions.CANCEL_EDIT_MAPPING: {
      return {
        ...state,
        editingMapping: false
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
export const getEditingMapping = (state: State) => state.editingMapping;
