import * as fromActions from '../actions/statement-assignment.page.actions';

export interface State {
  statementId: string;
}

export const initialState: State = {
  statementId: null
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
    default: {
      return state;
    }
  }
}
