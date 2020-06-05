import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { CompanyEmployee } from 'libs/models/company';

import * as fromActions from '../actions/statement-assignment.page.actions';
import { Statement } from '../../../shared/models';

export interface State {
  statement: AsyncStateObj<Statement>;
  assignedEmployees: CompanyEmployee[];
  assignedEmployeesLoading: boolean;
  assignedEmployeesLoadingError: boolean;
  isGenerateStatementModalOpen: boolean;
  sendingGenerateStatementRequest: boolean;
  sendingGenerateStatementRequestSuccess: boolean;
  sendingGenerateStatementRequestError: boolean;
  selectedCompanyEmployeeIds: number[];
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null),
  isGenerateStatementModalOpen: false,
  sendingGenerateStatementRequest: false,
  sendingGenerateStatementRequestSuccess: false,
  sendingGenerateStatementRequestError: false,
  assignedEmployees: [],
  assignedEmployeesLoading: false,
  assignedEmployeesLoadingError: false,
  selectedCompanyEmployeeIds: []
};

export function reducer(state = initialState, action: fromActions.StatementAssignmentPageActions): State {
  switch (action.type) {
    case fromActions.RESET_STATE: {
      return initialState;
    }
    case fromActions.LOAD_STATEMENT: {
      const localState: State = cloneDeep(state);
      // get the statementId into the store asap so it can be passed to fetch the main grid without having to wait for the full statement to load
      localState.statement.obj = { StatementId: action.payload.statementId } as Statement;
      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromActions.LOAD_STATEMENT_SUCCESS: {
      const localState = cloneDeep(state);
      localState.lastSavedDateTime = Date.now();
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement', action.payload);
    }
    case fromActions.OPEN_GENERATE_STATEMENT_MODAL: {
      return {
        ...state,
        isGenerateStatementModalOpen: true
      };
    }
    case fromActions.CLOSE_GENERATE_STATEMENT_MODAL: {
      return {
        ...state,
        isGenerateStatementModalOpen: false
      };
    }
    case fromActions.GENERATE_STATEMENTS: {
      return {
        ...state,
        sendingGenerateStatementRequest: true,
        sendingGenerateStatementRequestSuccess: false,
        sendingGenerateStatementRequestError: false,
      };
    }
    case fromActions.GENERATE_STATEMENTS_SUCCESS: {
      return {
        ...state,
        sendingGenerateStatementRequest: false,
        sendingGenerateStatementRequestSuccess: true,
        sendingGenerateStatementRequestError: false,
      };
    }
    case fromActions.GENERATE_STATEMENTS_ERROR: {
      return {
        ...state,
        sendingGenerateStatementRequest: false,
        sendingGenerateStatementRequestSuccess: false,
        sendingGenerateStatementRequestError: true,
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
    case fromActions.TOGGLE_SELECTED_EMPLOYEE: {
      let selectedCompanyEmployeeIds = cloneDeep(state.selectedCompanyEmployeeIds);

      if (selectedCompanyEmployeeIds.find((e: number) => e === action.payload.CompanyEmployeeId)) {
        selectedCompanyEmployeeIds = selectedCompanyEmployeeIds.filter((e: number) => e !== action.payload.CompanyEmployeeId);
      } else {
        selectedCompanyEmployeeIds.push(action.payload.CompanyEmployeeId);
      }

      return {
        ...state,
        selectedCompanyEmployeeIds
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

export const getIsGenerateStatementModalOpen = (state: State) => state.isGenerateStatementModalOpen;

export const getStatement = (state: State) => state.statement?.obj;
export const getStatementLoading = (state: State) => state.statement?.loading;
export const getStatementLoadingError = (state: State) => state.statement?.loadingError;

export const getSendingGenerateStatementRequest = (state: State) => state.sendingGenerateStatementRequest;
export const getSendingGenerateStatementRequestSuccess = (state: State) => state.sendingGenerateStatementRequestSuccess;
export const getSendingGenerateStatementRequestError = (state: State) => state.sendingGenerateStatementRequestError;

export const getAssignedEmployees = (state: State) => state.assignedEmployees;
export const getAssignedEmployeesLoading = (state: State) => state.assignedEmployeesLoading;
export const getAssignedEmployeesLoadingError = (state: State) => state.assignedEmployeesLoadingError;
export const getAssignedEmployeesCount = (state: State) => state.assignedEmployees.length;

export const getSelectedCompanyEmployeeIds = (state: State) => state.selectedCompanyEmployeeIds;
export const getSelectedCompanyEmployeeIdsCount = (state: State) => state.selectedCompanyEmployeeIds?.length;
