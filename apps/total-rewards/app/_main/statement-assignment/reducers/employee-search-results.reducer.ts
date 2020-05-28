import { EmployeeSearchResult } from 'libs/models/payfactors-api/employee-search/response/employee-search-response.model';

import * as fromEmployeeSearchResultsActions from '../actions/employee-search-results.actions';

export interface State {
  employees: EmployeeSearchResult[];
}

export const initialState: State = {
  employees: []
};

export function reducer(state = initialState, action: fromEmployeeSearchResultsActions.EmployeeSearchResultsActions): State {
  switch (action.type) {
    case fromEmployeeSearchResultsActions.REPLACE_EMPLOYEE_RESULTS: {
      return {
        ...state,
        employees: action.payload
      };
    }
    case fromEmployeeSearchResultsActions.ADD_EMPLOYEE_RESULTS: {
      return {
        ...state,
        employees: state.employees.concat(action.payload)
      };
    }
    case fromEmployeeSearchResultsActions.CLEAR_EMPLOYEE_RESULTS: {
      return {
        ...state,
        employees: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getEmployees = (state: State) => state.employees;
