import { cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj, PayMarketWithMdScope } from 'libs/models';

import * as fromPayMarketModalActions from '../actions/paymarket-modal.actions';

export interface State {
  payMarketModalOpen: boolean;
  payMarketId: number;
  payMarket: AsyncStateObj<PayMarketWithMdScope>;
}

export const initialState: State = {
  payMarketModalOpen: false,
  payMarketId: null,
  payMarket: generateDefaultAsyncStateObj<PayMarketWithMdScope>(null)
};

export function reducer(state = initialState, action: fromPayMarketModalActions.Actions): State {
  switch (action.type) {
    case fromPayMarketModalActions.OPEN_PAY_MARKET_MODAL: {
      return {
        ...state,
        payMarketModalOpen: true,
        payMarketId: action?.payload?.payMarketId
      };
    }
    case fromPayMarketModalActions.CLOSE_PAY_MARKET_MODAL: {
      return {
        ...state,
        payMarketModalOpen: false,
        payMarketId: null,
        payMarket: generateDefaultAsyncStateObj<PayMarketWithMdScope>(null)
      };
    }
    case fromPayMarketModalActions.LOAD_PAY_MARKET: {
      const payMarketClone: AsyncStateObj<PayMarketWithMdScope> = cloneDeep(state.payMarket);
      payMarketClone.loading = true;
      payMarketClone.loadingError = false;
      return {
        ...state,
        payMarket: payMarketClone
      };
    }
    case fromPayMarketModalActions.LOAD_PAY_MARKET_SUCCESS: {
      const payMarketClone: AsyncStateObj<PayMarketWithMdScope> = cloneDeep(state.payMarket);
      payMarketClone.loading = false;
      payMarketClone.obj = action.payload;
      return {
        ...state,
        payMarket: payMarketClone
      };
    }
    case fromPayMarketModalActions.LOAD_PAY_MARKET_ERROR: {
      const payMarketClone: AsyncStateObj<PayMarketWithMdScope> = cloneDeep(state.payMarket);
      payMarketClone.loading = false;
      payMarketClone.loadingError = true;
      return {
        ...state,
        payMarket: payMarketClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getPayMarketModalOpen = (state: State) => state.payMarketModalOpen;
export const getPayMarket = (state: State) => state.payMarket;
export const getPayMarketId = (state: State) => state.payMarketId;
