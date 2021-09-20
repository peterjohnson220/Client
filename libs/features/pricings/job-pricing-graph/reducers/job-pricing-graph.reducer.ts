import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { PricingForPayGraph } from 'libs/models/payfactors-api';
import { EmployeesPayModel } from 'libs/models/payfactors-api/company/response/employees-pay-model.model';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromJobPricingGraphActions from '../actions/job-pricing-graph.actions';

export interface State {
  employeePayData: AsyncStateObj<EmployeesPayModel[]>;
  pricingForBasePayGraph: AsyncStateObj<PricingForPayGraph>;
  pricingForTCCPayGraph: AsyncStateObj<PricingForPayGraph>;
}

export const initialState: State = {
  employeePayData: generateDefaultAsyncStateObj<EmployeesPayModel[]>([]),
  pricingForBasePayGraph: generateDefaultAsyncStateObj<PricingForPayGraph>(null),
  pricingForTCCPayGraph: generateDefaultAsyncStateObj<PricingForPayGraph>(null)
};

export function reducer(state = initialState, action: fromJobPricingGraphActions.Actions): State {
  switch (action.type) {
    case fromJobPricingGraphActions.GET_BASE_PRICING_DATA: {
      return AsyncStateObjHelper.loading(state, 'pricingForBasePayGraph');
    }
    case fromJobPricingGraphActions.GET_BASE_PRICING_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingForBasePayGraph', action.pricing);
    }
    case fromJobPricingGraphActions.GET_BASE_PRICING_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricingForBasePayGraph');
    }
    case fromJobPricingGraphActions.GET_TCC_PRICING_DATA: {
      return AsyncStateObjHelper.loading(state, 'pricingForTCCPayGraph');
    }
    case fromJobPricingGraphActions.GET_TCC_PRICING_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingForTCCPayGraph', action.pricing);
    }
    case fromJobPricingGraphActions.GET_TCC_PRICING_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricingForTCCPayGraph');
    }
    case fromJobPricingGraphActions.LOAD_GRAPH_PAY_DATA: {
      return AsyncStateObjHelper.loading(state, 'employeePayData');
    }
    case fromJobPricingGraphActions.LOAD_GRAPH_PAY_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'employeePayData', action.payData);
    }
    case fromJobPricingGraphActions.LOAD_GRAPH_PAY_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'employeePayData');
    }
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getEmployeePayData = (state: State) => state.employeePayData;
export const getBasePayPricing = (state: State) => state.pricingForBasePayGraph;
export const getTCCPricing = (state: State) => state.pricingForTCCPayGraph;

