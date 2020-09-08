import cloneDeep from 'lodash/cloneDeep';

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
  isExporting: boolean;
  exportEventId: AsyncStateObj<string>;
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
  generateStatementEventId: null,
  isExporting: false,
  exportEventId: generateDefaultAsyncStateObj<string>(null),
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
        isGenerateStatementModalOpen: false,
        sendingGenerateStatementRequestError: false
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
      const statement = cloneDeep(state.statement);
      statement.obj.AssignedCompanyEmployeeIds = action.payload;
      return {
        ...state,
        isSingleEmployeeAction: false,
        UnassignEmployees: false,
        UnassignEmployeesSuccess: true,
        UnassignEmployeesError: false,
        statement: statement
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
    case fromActions.START_EXPORT_ASSIGNED_EMPLOYEES: {
      return {
        ...state,
        isExporting: true
      };
    }
    case fromActions.START_EXPORT_ASSIGNED_EMPLOYEES_SUCCESS: {
      const asyncClone = cloneDeep(state.exportEventId);
      asyncClone.obj = action.payload;
      return {
        ...state,
        exportEventId: asyncClone
      };
    }
    case fromActions.START_EXPORT_ASSIGNED_EMPLOYEES_ERROR: {
      return {
        ...state,
        isExporting: false
      };
    }
    case fromActions.EXPORT_ASSIGNED_EMPLOYEES_COMPLETE: {
      const asyncClone = cloneDeep(state.exportEventId);
      asyncClone.obj = null;
      return {
        ...state,
        isExporting: false,
        exportEventId: asyncClone
      };
    }
    case fromActions.GET_EXPORTING_ASSIGNED_EMPLOYEES: {
      const asyncClone = cloneDeep(state.exportEventId);
      asyncClone.loading = true;
      return {
        ...state,
        exportEventId: asyncClone
      };
    }
    case fromActions.GET_EXPORTING_ASSIGNED_EMPLOYEES_SUCCESS: {
      const asyncClone = cloneDeep(state.exportEventId);
      asyncClone.loading = false;
      asyncClone.obj = action.payload;
      return {
        ...state,
        exportEventId: asyncClone,
        isExporting: action.payload?.length > 0
      };
    }
    case fromActions.GET_EXPORTING_ASSIGNED_EMPLOYEES_ERROR: {
      const asyncClone = cloneDeep(state.exportEventId);
      asyncClone.loading = false;
      return {
        ...state,
        exportEventId: asyncClone
      };
    }
    case fromActions.UPDATE_STATEMENT_ASSIGNED_EMPLOYEES: {
      const statementClone = cloneDeep(state.statement);
      statementClone.obj.AssignedCompanyEmployeeIds = action.payload;
      return {
        ...state,
        statement: statementClone
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
export const getIsExporting = (state: State) => state.isExporting;
export const getExportEventAsync = (state: State) => state.exportEventId;
