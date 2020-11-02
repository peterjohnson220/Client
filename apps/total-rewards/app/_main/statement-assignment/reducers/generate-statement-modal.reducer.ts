import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards/response';

import * as fromGenerateStatementModalActions from '../actions/generate-statement-modal.actions';

export interface State {
  loadingEmailTemplate: boolean;
  statementEmailTemplate: StatementEmailTemplate;
}

const initialState: State = {
  loadingEmailTemplate: false,
  statementEmailTemplate: null
};

export function reducer(state = initialState, action: fromGenerateStatementModalActions.Actions): State {
  switch (action.type) {
    case fromGenerateStatementModalActions.GET_STATEMENT_EMAIL_TEMPLATE: {
      return {
        ...state,
        loadingEmailTemplate: true
      };
    }
    case fromGenerateStatementModalActions.GET_STATEMENT_EMAIL_TEMPLATE_SUCCESS: {
      return {
        ...state,
        loadingEmailTemplate: false,
        statementEmailTemplate: action.payload
      };
    }
    case fromGenerateStatementModalActions.GET_STATEMENT_EMAIL_TEMPLATE_ERROR: {
      return {
        ...state,
        loadingEmailTemplate: false
      };
    }
    case fromGenerateStatementModalActions.SAVE_STATEMENT_EMAIL_TEMPLATE_SUCCESS: {
      return {
        ...state,
        statementEmailTemplate: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getStatementEmailTemplate = (state: State) => state.statementEmailTemplate;
