import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CompanyJobToMapTo } from 'libs/models/peer';

import * as fromExchangeJobMappingInfoActions from '../../_manage/actions/exchange-job-mapping-info.actions';

export interface State extends EntityState<CompanyJobToMapTo> {
  loading: boolean;
  loadingError: boolean;
  applyingMapping: boolean;
  applyingMappingError: boolean;
  selectedMappingCompanyJobId: number;
  activeExchangeJobToCompanyJobId: number;
  addingMapping: boolean;
  deleteConfirmationModalOpen: boolean;
  deletingMapping: boolean;
  deletingError: boolean;
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
  activeExchangeJobToCompanyJobId: null,
  addingMapping: false,
  deleteConfirmationModalOpen: false,
  deletingMapping: false,
  deletingError: false
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
        selectedMappingCompanyJobId: null,
        activeExchangeJobToCompanyJobId: action.payload
      };
    }
    case fromExchangeJobMappingInfoActions.APPLY_MAPPING_ERROR: {
      return {
        ...state,
        applyingMapping: false,
        applyingMappingError: true
      };
    }
    case fromExchangeJobMappingInfoActions.ADD_MAPPING: {
      return {
        ...state,
        addingMapping: true
      };
    }
    case fromExchangeJobMappingInfoActions.CANCEL_ADD_MAPPING: {
      return {
        ...state,
        addingMapping: false
      };
    }
    case fromExchangeJobMappingInfoActions.OPEN_DELETE_CONFIRMATION_MODAL: {
      return {
        ...state,
        deleteConfirmationModalOpen: true
      };
    }
    case fromExchangeJobMappingInfoActions.CLOSE_DELETE_CONFIRMATION_MODAL: {
      return {
        ...state,
        deleteConfirmationModalOpen: false
      };
    }
    case fromExchangeJobMappingInfoActions.DELETE_MAPPING: {
      return {
        ...state,
        deletingMapping: true
      };
    }
    case fromExchangeJobMappingInfoActions.DELETE_MAPPING_SUCCESS: {
      return {
        ...state,
        deletingError: false,
        deletingMapping: false,
        deleteConfirmationModalOpen: false
      };
    }
    case fromExchangeJobMappingInfoActions.DELETE_MAPPING_ERROR: {
      return {
        ...state,
        deletingMapping: false,
        deletingError: true,
        deleteConfirmationModalOpen: false
      };
    }
    case fromExchangeJobMappingInfoActions.SET_ACTIVE_MAPPING: {
      return {
        ...state,
        activeExchangeJobToCompanyJobId: action.payload
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
export const getAddingMapping = (state: State) => state.addingMapping;
export const getDeleteConfirmationModalOpen = (state: State) => state.deleteConfirmationModalOpen;
export const getDeletingMapping = (state: State) => state.deletingMapping;
export const getDeletingError = (state: State) => state.deletingError;
export const getActiveExchangeJobToCompanyJobId = (state: State) => state.activeExchangeJobToCompanyJobId;
