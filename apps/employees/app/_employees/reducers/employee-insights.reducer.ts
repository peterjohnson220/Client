// Import all exports from our feature's actions
import { EmployeeInsights } from 'libs/models/payfactors-api/employees/employee-insights.model';
import { AsyncStateObj, generateDefaultAsyncStateObj, GenericKeyValue } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromEmployeeInsightsActions from '../actions/employee-insights.actions';

// Define our feature state
export interface State {
  employeeInsights:  AsyncStateObj<EmployeeInsights>;
  udfFields: AsyncStateObj<GenericKeyValue<string, string>[]>;
}

// Define our initial state
const initialState: State = {
  employeeInsights:  generateDefaultAsyncStateObj<EmployeeInsights>(null),
  udfFields: generateDefaultAsyncStateObj<GenericKeyValue<string, string>[]>(null)
};


// Reducer function
export function reducer(state = initialState, action: fromEmployeeInsightsActions.Actions): State {
  switch (action.type) {
    case fromEmployeeInsightsActions.GET_EMPLOYEE_INSIGHTS: {
      return AsyncStateObjHelper.loading(state, 'employeeInsights');
    }
    case fromEmployeeInsightsActions.GET_EMPLOYEE_INSIGHTS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'employeeInsights', action.payload);
    }
    case fromEmployeeInsightsActions.GET_EMPLOYEE_INSIGHTS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'employeeInsights');
    }
    case fromEmployeeInsightsActions.LOAD_CUSTOM_EMPLOYEE_FIELDS: {
      return AsyncStateObjHelper.loading(state, 'udfFields');
    }
    case fromEmployeeInsightsActions.LOAD_CUSTOM_EMPLOYEE_FIELDS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'udfFields', action.payload);
    }
    case fromEmployeeInsightsActions.LOAD_CUSTOM_EMPLOYEE_FIELDS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'udfFields');
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getEmployeeInsights = (state: State) => state.employeeInsights;
export const getCustomEmployeeFields = (state: State) => state.udfFields;

