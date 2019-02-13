import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { DataCutValidationInfo } from 'libs/models/peer/';

import * as fromDataCutValidationActions from '../actions/data-cut-validation.actions';

// Extend Entity State
export interface State extends EntityState<DataCutValidationInfo> {
  loading: boolean;
  loadingError: boolean;
  employeeCheckPassed: boolean;
}

// Create Entity Adapter
export const adapter: EntityAdapter<DataCutValidationInfo> = createEntityAdapter<DataCutValidationInfo>({
  selectId: (dataCutValidationInfo: DataCutValidationInfo) => dataCutValidationInfo.DataCutGuid
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  employeeCheckPassed: false
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
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        employeeCheckPassed: false
      };
    }
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadingError: false,
        employeeCheckPassed: action.payload
      };
    }
    case fromDataCutValidationActions.VALIDATE_DATA_CUT_EMPLOYEES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
        employeeCheckPassed: false
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
export const employeeCheckPassed = (state: State) => state.employeeCheckPassed;
