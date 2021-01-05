import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, PayMarketAssociationsSummary } from 'libs/models';

import * as fromPayMarketAssociationActions from '../actions/paymarket-association.actions';

export interface State {
  payMarketAssociationSummary: AsyncStateObj<PayMarketAssociationsSummary>;
}

export const initialState: State = {
  payMarketAssociationSummary: generateDefaultAsyncStateObj<PayMarketAssociationsSummary>(null)
};

export function reducer(state = initialState, action: fromPayMarketAssociationActions.Actions): State {
  switch (action.type) {
    case fromPayMarketAssociationActions.LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY: {
      const payMarketClone: AsyncStateObj<PayMarketAssociationsSummary> = cloneDeep(state.payMarketAssociationSummary);
      payMarketClone.loading = true;
      payMarketClone.loadingError = false;
      payMarketClone.obj = null;
      return {
        ...state,
        payMarketAssociationSummary: payMarketClone
      };
    }
    case fromPayMarketAssociationActions.LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY_SUCCESS: {
      const payMarketClone: AsyncStateObj<PayMarketAssociationsSummary> = cloneDeep(state.payMarketAssociationSummary);
      payMarketClone.loading = false;
      payMarketClone.loadingError = false;
      payMarketClone.obj = action.payload;
      return {
        ...state,
        payMarketAssociationSummary: payMarketClone
      };
    }
    case fromPayMarketAssociationActions.LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY_ERROR: {
      const payMarketClone: AsyncStateObj<PayMarketAssociationsSummary> = cloneDeep(state.payMarketAssociationSummary);
      payMarketClone.loading = false;
      payMarketClone.loadingError = true;
      return {
        ...state,
        payMarketAssociationSummary: payMarketClone
      };
    }

    default: {
      return state;
    }
  }
}

export const getPayMarketAssociationSummary = (state: State) => state.payMarketAssociationSummary;

