import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromEmployeeAcknowledgementActions from '../actions/employee-acknowledgement.actions';
import { EmployeeAcknowledgement } from '../models';

export interface State {
  employeeAcknowledgementAsync: AsyncStateObj<EmployeeAcknowledgement>;
  errorMessage: string;
  acknowledging: boolean;
}

export const initialState: State = {
  employeeAcknowledgementAsync: generateDefaultAsyncStateObj<EmployeeAcknowledgement>(null),
  errorMessage: '',
  acknowledging: false
};

export function reducer(state = initialState, action: fromEmployeeAcknowledgementActions.Actions): State {
  switch (action.type) {
    case fromEmployeeAcknowledgementActions.LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO: {
      const employeeAcknowledgementAsyncClone = cloneDeep(state.employeeAcknowledgementAsync);
      employeeAcknowledgementAsyncClone.loading = true;
      return {
        ...state,
        employeeAcknowledgementAsync: employeeAcknowledgementAsyncClone
      };
    }
    case fromEmployeeAcknowledgementActions.LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO_ERROR: {
      const employeeAcknowledgementAsyncClone = cloneDeep(state.employeeAcknowledgementAsync);
      employeeAcknowledgementAsyncClone.loading = false;
      employeeAcknowledgementAsyncClone.loadingError = true;
      return {
        ...state,
        employeeAcknowledgementAsync: employeeAcknowledgementAsyncClone,
        errorMessage: 'There was an error loading the employee\'s signature. Please contact your services associate for assistance.'
    };
    }
    case fromEmployeeAcknowledgementActions.LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO_SUCCESS: {
      const employeeAcknowledgementAsyncClone = cloneDeep(state.employeeAcknowledgementAsync);
      employeeAcknowledgementAsyncClone.loading = false;
      employeeAcknowledgementAsyncClone.obj = action.payload;
      return {
        ...state,
        employeeAcknowledgementAsync: employeeAcknowledgementAsyncClone
      };
    }
    case fromEmployeeAcknowledgementActions.ACKNOWLEDGE: {
      return {
        ...state,
        acknowledging: true
      };
    }
    case fromEmployeeAcknowledgementActions.ACKNOWLEDGE_ERROR: {
      const employeeAcknowledgementAsyncClone = cloneDeep(state.employeeAcknowledgementAsync);
      employeeAcknowledgementAsyncClone.loadingError = true;
      return {
        ...state,
        employeeAcknowledgementAsync: employeeAcknowledgementAsyncClone,
        acknowledging: false
      };
    }
    case fromEmployeeAcknowledgementActions.ACKNOWLEDGE_SUCCESS: {
      const employeeAcknowledgementAsyncClone = cloneDeep(state.employeeAcknowledgementAsync);
      employeeAcknowledgementAsyncClone.obj = action.payload;
      return {
        ...state,
        employeeAcknowledgementAsync: employeeAcknowledgementAsyncClone,
        acknowledging: false
      };
    }
    default:
      return state;
  }
}

export const getEmployeeAcknowledgementAsync = (state: State) => state.employeeAcknowledgementAsync;
export const getEmployeeAcknowledgementError = (state: State) => state.employeeAcknowledgementAsync.loadingError;
export const getAcknowledging = (state: State) => state.acknowledging;
export const getEmployeeAcknowledgementErrorMessage = (state: State) => state.errorMessage;
