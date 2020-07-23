import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { ListAreaColumn } from 'libs/models/common/list-area';

import * as fromActions from '../actions/statement-assignment.page.actions';
import { Statement } from '../../../shared/models';

export interface State {
  statement: AsyncStateObj<Statement>;
  listAreaColumns: AsyncStateObj<any[]>;
  isGenerateStatementModalOpen: boolean;
  sendingGenerateStatementRequest: boolean;
  sendingGenerateStatementRequestSuccess: boolean;
  sendingGenerateStatementRequestError: boolean;
  isFiltersPanelOpen: boolean;
  isUnassignModalOpen: boolean;
  isSingleEmployeeAction: boolean;
  UnassignEmployees: boolean;
  UnassignEmployeesSuccess: boolean;
  UnassignEmployeesError: boolean;
  generateStatementEventId: string;
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null),
  listAreaColumns: generateDefaultAsyncStateObj<ListAreaColumn[]>([]),
  isGenerateStatementModalOpen: false,
  sendingGenerateStatementRequest: false,
  sendingGenerateStatementRequestSuccess: false,
  sendingGenerateStatementRequestError: false,
  isFiltersPanelOpen: false,
  isUnassignModalOpen: false,
  isSingleEmployeeAction: false,
  UnassignEmployees: false,
  UnassignEmployeesSuccess: false,
  UnassignEmployeesError: false,
  generateStatementEventId: null
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
    case fromActions.LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS: {
      const localState: State = cloneDeep(state);
      return AsyncStateObjHelper.loading(localState, 'listAreaColumns');
    }
    case fromActions.LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS_SUCCESS: {
      const localState = cloneDeep(state);
      return AsyncStateObjHelper.loadingSuccess(state, 'listAreaColumns', action.payload);
    }
    case fromActions.LOAD_ASSIGNED_EMPLOYEES_LIST_AREA_COLUMNS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'listAreaColumns');
    }
    case fromActions.OPEN_GENERATE_STATEMENT_MODAL: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isGenerateStatementModalOpen: true
      };
    }
    case fromActions.CLOSE_GENERATE_STATEMENT_MODAL: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isGenerateStatementModalOpen: false
      };
    }
    case fromActions.GENERATE_STATEMENTS: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        sendingGenerateStatementRequest: true,
        sendingGenerateStatementRequestSuccess: false,
        sendingGenerateStatementRequestError: false,
      };
    }
    case fromActions.GENERATE_STATEMENTS_SUCCESS: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        sendingGenerateStatementRequest: false,
        sendingGenerateStatementRequestSuccess: true,
        sendingGenerateStatementRequestError: false,
        generateStatementEventId: action.payload.eventId
      };
    }
    case fromActions.GENERATE_STATEMENTS_ERROR: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        sendingGenerateStatementRequest: false,
        sendingGenerateStatementRequestSuccess: false,
        sendingGenerateStatementRequestError: true,
      };
    }
    case fromActions.TOGGLE_GRID_FILTERS: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isFiltersPanelOpen: !state.isFiltersPanelOpen
      };
    }
    case fromActions.OPEN_UNASSIGN_MODAL: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isUnassignModalOpen: true,
        isSingleEmployeeAction: false
      };
    }
    case fromActions.CLOSE_UNASSIGN_MODAL: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isUnassignModalOpen: false
      };
    }
    case fromActions.OPEN_SINGLE_EMPLOYEE_UNASSIGN_MODAL: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isUnassignModalOpen: true,
        isSingleEmployeeAction: true
      };
    }
    case fromActions.UNASSIGN_EMPLOYEES: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        UnassignEmployees: true,
        UnassignEmployeesSuccess: false,
        UnassignEmployeesError: false
      };
    }
    case fromActions.UNASSIGN_EMPLOYEES_SUCCESS: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        isSingleEmployeeAction: false,
        UnassignEmployees: false,
        UnassignEmployeesSuccess: true,
        UnassignEmployeesError: false
      };
    }
    case fromActions.UNASSIGN_EMPLOYEES_ERROR: {
      const localState = cloneDeep(state);
      return {
        ...localState,
        UnassignEmployees: false,
        UnassignEmployeesSuccess: false,
        UnassignEmployeesError: true
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

export const getListAreaColumns = (state: State) => state.listAreaColumns.obj.filter(lac =>
  lac.ColumnDatabaseName !== 'CompanyEmployeeId' && lac.ColumnDatabaseName !== 'AssignedStatementId');

export const getIsFiltersPanelOpen = (state: State) => state.isFiltersPanelOpen;

export const getIsUnassignModalOpen = (state: State) => state.isUnassignModalOpen;
export const getIsSingleEmployeeAction = (state: State) => state.isSingleEmployeeAction;
export const getUnassignEmployees = (state: State) => state.UnassignEmployees;
export const getUnassignEmployeesSuccess = (state: State) => state.UnassignEmployeesSuccess;
export const getUnassignEmployeesError = (state: State) => state.UnassignEmployeesError;
