import { CompanyEmployee } from 'libs/models/company';

import * as fromActions from '../actions/statement-assignment.page.actions';

export interface State {
  statementId: string;
  assignedEmployees: CompanyEmployee[];
  assignedEmployeesLoading: boolean;
  assignedEmployeesLoadingError: boolean;
}

export const initialState: State = {
  statementId: null,
  assignedEmployees: [],
  assignedEmployeesLoading: false,
  assignedEmployeesLoadingError: false
};

export function reducer(state = initialState, action: fromActions.StatementAssignmentPageActions): State {
  switch (action.type) {
    case fromActions.RESET_STATE: {
      return initialState;
    }
    case fromActions.SET_STATEMENT_ID: {
      return {
        ...state,
        statementId: action.payload
      };
    }
    case fromActions.GET_ASSIGNED_EMPLOYEES: {
      return {
        ...state,
        assignedEmployeesLoading: true
      };
    }
    case fromActions.GET_ASSIGNED_EMPLOYEES_SUCCESS: {
      return {
        ...state,
        assignedEmployeesLoading: false,
        assignedEmployeesLoadingError: false
      };
    }
    case fromActions.GET_ASSIGNED_EMPLOYEES_ERROR: {
      return {
        ...state,
        assignedEmployeesLoading: false,
        assignedEmployeesLoadingError: true
      };
    }
    case fromActions.REPLACE_ASSIGNED_EMPLOYEES: {
      return {
        ...state,
        assignedEmployees: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getStatementId = (state: State) => state.statementId;
export const getAssignedEmployees = (state: State) => state.assignedEmployees;
export const getAssignedEmployeesLoading = (state: State) => state.assignedEmployeesLoading;
export const getAssignedEmployeesLoadingError = (state: State) => state.assignedEmployeesLoadingError;
export const getAssignedEmployeesCount = (state: State) => state.assignedEmployees.length;
