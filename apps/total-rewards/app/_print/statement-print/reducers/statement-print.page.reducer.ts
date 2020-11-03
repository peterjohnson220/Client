import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { StatementForPrint } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromActions from '../actions/statement-print.page.actions';

export interface State {
  pdfId: string;
  statement: AsyncStateObj<StatementForPrint>;
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<StatementForPrint>(null),
  pdfId: null
};

export function reducer(state = initialState, action: fromActions.StatementPrintPageActions): State {
  switch (action.type) {
    case fromActions.LOAD_STATEMENT: {
      const localState: State = cloneDeep(state);
      localState.pdfId = action.payload;
      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromActions.LOAD_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement');
    }
    default: {
      return state;
    }
  }
}
