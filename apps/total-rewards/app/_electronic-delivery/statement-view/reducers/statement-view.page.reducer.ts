import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromActions from '../actions/statement-view.page.actions';

export interface State {
  employeeData: AsyncStateObj<EmployeeRewardsData>;
  statement: AsyncStateObj<Statement>;
}

export const initialState: State = {
  statement: generateDefaultAsyncStateObj<Statement>(null),
  employeeData: generateDefaultAsyncStateObj<EmployeeRewardsData>(null),
};

export function reducer(state = initialState, action: fromActions.StatementViewPageActions): State {
  switch (action.type) {
    case fromActions.LOAD_STATEMENT: {
      const localState: State = cloneDeep(state);

      return AsyncStateObjHelper.loading(localState, 'statement');
    }
    case fromActions.LOAD_STATEMENT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'statement', action.payload);
    }
    case fromActions.LOAD_STATEMENT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'statement');
    }
    case fromActions.GET_EMPLOYEE_REWARDS_DATA: {
      return AsyncStateObjHelper.loading(state, 'employeeData');
    }
    case fromActions.GET_EMPLOYEE_REWARDS_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'employeeData', action.payload);
    }
    case fromActions.GET_EMPLOYEE_REWARDS_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'employeeData');
    }
    default: {
      return state;
    }
  }
}
