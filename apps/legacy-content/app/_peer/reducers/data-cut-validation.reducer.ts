import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { DataCutValidationInfo } from 'libs/models/peer/';

import * as fromDataCutValidationActions from '../actions/data-cut-validation.actions';

// Extend Entity State
export interface State extends EntityState<DataCutValidationInfo> {
  loading: boolean;
  loadingError: boolean;
  validatingEmployeeSimilarity: boolean;
  validatingEmployeeSimilarityError: boolean;
  employeeSimilarityPassed: boolean;
}

// Create Entity Adapter
export const adapter: EntityAdapter<DataCutValidationInfo> = createEntityAdapter<DataCutValidationInfo>({
  selectId: (dataCutValidationInfo: DataCutValidationInfo) => dataCutValidationInfo.DataCutGuid
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  validatingEmployeeSimilarity: false,
  validatingEmployeeSimilarityError: false,
  employeeSimilarityPassed: true
});

// Reducer
export function reducer(state = initialState, action: fromDataCutValidationActions.Actions): State {
  switch (action.type) {
    case fromDataCutValidationActions.LOAD_DATA_CUT_VALIDATION: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        loadingError: false
      };
    }
    case fromDataCutValidationActions.LOAD_DATA_CUT_VALIDATION_SUCCESS: {
      const info: DataCutValidationInfo[] = action.payload;
      return {
        ...adapter.addAll(info, state),
        loading: false,
        loadingError: false
      };
    }
    case fromDataCutValidationActions.LOAD_DATA_CUT_VALIDATION_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES:
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES_NEW: {
      return {
        ...state,
        validatingEmployeeSimilarity: true,
        validatingEmployeeSimilarityError: false
      };
    }
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES_SUCCESS: {
      return {
        ...state,
        validatingEmployeeSimilarity: false,
        validatingEmployeeSimilarityError: false,
        employeeSimilarityPassed: action.payload
      };
    }
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES_ERROR: {
      return {
        ...state,
        validatingEmployeeSimilarityError: true,
        validatingEmployeeSimilarity: false,
        employeeSimilarityPassed: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getValidatingEmployeeSimilarity = (state: State) => state.validatingEmployeeSimilarity;
export const getEmployeeSimilarityPassed = (state: State) => state.employeeSimilarityPassed;
export const getEmployeeSimilarityError = (state: State) => state.validatingEmployeeSimilarityError;
