import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromActions from '../actions/statement-history.page.actions';

export interface State {
  statement: AsyncStateObj<Statement>;
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null)
};

export function reducer(state = initialState, action: fromActions.StatementHistoryPageActions): State {
  switch (action.type) {
    case fromActions.LOAD_STATEMENT: {
      const localState: State = cloneDeep(state);
      // get the statementId into the store asap so it can be passed to fetch the main grid without having to wait for the full statement to load
      localState.statement.obj = { StatementId: action.payload.statementId } as Statement;
      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromActions.LOAD_STATEMENT_SUCCESS: {
      const localState = cloneDeep(state);
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement', action.payload);
    }
    default: {
      return state;
    }
  }
}
