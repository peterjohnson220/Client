import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { PricingForPayGraph } from 'libs/models/payfactors-api';
import { EmployeesBasePayModel } from 'libs/models/payfactors-api/company/response/employees-base-pay-model.model';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromBasePayGraphActions from '../actions/job-pricing-graph.actions';

export interface State {
  employeeBasePay: AsyncStateObj<EmployeesBasePayModel[]>;
  pricingForBasePayGraph: AsyncStateObj<PricingForPayGraph>;
}

export const initialState: State = {
  employeeBasePay: generateDefaultAsyncStateObj<EmployeesBasePayModel[]>([]),
  pricingForBasePayGraph: generateDefaultAsyncStateObj<PricingForPayGraph>(null)
};

export function reducer(state = initialState, action: fromBasePayGraphActions.Actions): State {
  switch (action.type) {
    case fromBasePayGraphActions.GET_PRICING_DATA: {
      return AsyncStateObjHelper.loading(state, 'pricingForBasePayGraph');
    }
    case fromBasePayGraphActions.GET_PRICING_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingForBasePayGraph', action.pricing);
    }
    case fromBasePayGraphActions.GET_PRICING_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricingForBasePayGraph');
    }
    case fromBasePayGraphActions.LOAD_BASE_PAY_DATA: {
      return AsyncStateObjHelper.loading(state, 'employeeBasePay');
    }
    case fromBasePayGraphActions.LOAD_BASE_PAY_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'employeeBasePay', action.basePay);
    }
    case fromBasePayGraphActions.LOAD_BASE_PAY_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'employeeBasePay');
    }
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getBasePay = (state: State) => state.employeeBasePay;
export const getPricing = (state: State) => state.pricingForBasePayGraph;

