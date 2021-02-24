import { AsyncStateObjHelper } from 'libs/core/helpers';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { EmployeeBenefit } from 'libs/models/payfactors-api';

import * as fromEmployeeBenefitsActions from '../actions/employee-benefits.actions';

export interface State {
  employeeBenefitsAsync: AsyncStateObj<EmployeeBenefit[]>;
  saving: boolean;
  savingError: boolean;
}

const initialState: State = {
  employeeBenefitsAsync: generateDefaultAsyncStateObj<EmployeeBenefit[]>([]),
  saving: false,
  savingError: false
};

export function reducer(state = initialState, action: fromEmployeeBenefitsActions.Actions): State {
  switch (action.type) {
    case fromEmployeeBenefitsActions.LOAD_EMPLOYEE_BENEFITS: {
      return AsyncStateObjHelper.loading(state, 'employeeBenefitsAsync');
    }
    case fromEmployeeBenefitsActions.LOAD_EMPLOYEE_BENEFITS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'employeeBenefitsAsync', action.payload);
    }
    case fromEmployeeBenefitsActions.LOAD_EMPLOYEE_BENEFITS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'employeeBenefitsAsync');
    }
    case fromEmployeeBenefitsActions.SAVE_EMPLOYEE_BENEFITS: {
      return {
        ...state,
        saving: true,
        savingError: false
      };
    }
    case fromEmployeeBenefitsActions.SAVE_EMPLOYEE_BENEFITS_SUCCESS: {
      return {
        ...state,
        saving: false
      };
    }
    case fromEmployeeBenefitsActions.SAVE_EMPLOYEE_BENEFITS_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getEmployeeBenefitsAsync = (state: State) => state.employeeBenefitsAsync;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
