import { AsyncStateObjHelper } from 'libs/core';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { EmployeeModalStructuresResponse } from 'libs/models/payfactors-api';

import * as fromEmployeeSalaryRangeChartActions from '../actions/employee-salary-range-chart.actions';

export interface State {
  structures: AsyncStateObj<EmployeeModalStructuresResponse[]>;
}

const initialState: State = {
  structures: generateDefaultAsyncStateObj<EmployeeModalStructuresResponse[]>([])
};

export function reducer(state = initialState, action: fromEmployeeSalaryRangeChartActions.Actions): State {
  switch (action.type) {
    case fromEmployeeSalaryRangeChartActions.GET_EMPLOYEE_STRUCTURES: {
      return AsyncStateObjHelper.loading(state, 'structures');
    }
    case fromEmployeeSalaryRangeChartActions.GET_EMPLOYEE_STRUCTURES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'structures', action.payload);
    }
    case fromEmployeeSalaryRangeChartActions.GET_EMPLOYEE_STRUCTURES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'structures');
    }
    default: {
      return state;
    }
  }
}

export const getEmployeeStructures = (state: State) => state.structures;
