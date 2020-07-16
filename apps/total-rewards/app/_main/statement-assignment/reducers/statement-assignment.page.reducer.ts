import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { CompanyEmployee } from 'libs/models/company';

import * as fromActions from '../actions/statement-assignment.page.actions';
import { Statement } from '../../../shared/models';

export interface State {
  statement: AsyncStateObj<Statement>;
  isGenerateStatementModalOpen: boolean;
  sendingGenerateStatementRequest: boolean;
  sendingGenerateStatementRequestSuccess: boolean;
  sendingGenerateStatementRequestError: boolean;
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null),
  isGenerateStatementModalOpen: false,
  sendingGenerateStatementRequest: false,
  sendingGenerateStatementRequestSuccess: false,
  sendingGenerateStatementRequestError: false,
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
