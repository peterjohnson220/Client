import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import {Statement} from '../../../shared/models';
import * as fromEditStatementActions from '../actions/statement-edit.page.actions';

export interface State {
  statementId: number;
  statementObject: AsyncStateObj<Statement>;
}

export const initialState: State = {
  statementId: 0,
  statementObject: generateDefaultAsyncStateObj<Statement>(null)
};

export function reducer(state = initialState, action: fromEditStatementActions.Actions): State {
  switch (action.type) {
    case fromEditStatementActions.LOAD_STATEMENT: {
      const localState = AsyncStateObjHelper.loading(state, 'statementObject');
      return {
        ...localState,
        statementId: action.payload
      };
    }
    case fromEditStatementActions.LOAD_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'statementObject', action.payload);
    }
    case fromEditStatementActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statementObject', action.payload);
    }
    case fromEditStatementActions.SAVE_STATEMENT: {
      console.log('SAVE TRIGGERED');
      return AsyncStateObjHelper.saving(state, 'statementObject');
    }
    case fromEditStatementActions.SAVE_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'statementObject');
    }
    case fromEditStatementActions.SAVE_STATEMENT_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'statementObject', action.payload);
    }
    default: {
      return state;
    }
  }
}
