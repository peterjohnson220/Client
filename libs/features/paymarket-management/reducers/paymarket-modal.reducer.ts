import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, PayMarketWithMdScope } from 'libs/models';

import * as fromPayMarketModalActions from '../actions/paymarket-modal.actions';

export interface State {
  payMarketModalOpen: boolean;
  deletePayMarketModalOpen: boolean;
  payMarketId: number;
  payMarket: AsyncStateObj<PayMarketWithMdScope>;
  payMarketErrorMessage: string;
  deletingPayMarket: boolean;
  deletingPayMarketError: boolean;
}

export const initialState: State = {
  payMarketModalOpen: false,
  deletePayMarketModalOpen: false,
  payMarketId: null,
  payMarket: generateDefaultAsyncStateObj<PayMarketWithMdScope>(null),
  payMarketErrorMessage: '',
  deletingPayMarket: false,
  deletingPayMarketError: false
};

export function reducer(state = initialState, action: fromPayMarketModalActions.Actions): State {
  switch (action.type) {
    case fromPayMarketModalActions.OPEN_PAY_MARKET_MODAL: {
      return {
        ...state,
        payMarketModalOpen: true,
        payMarketId: action?.payload?.payMarketId,
        payMarketErrorMessage: ''
      };
    }
    case fromPayMarketModalActions.CLOSE_PAY_MARKET_MODAL: {
      return {
        ...state,
        payMarketModalOpen: false,
        payMarketId: null,
        payMarket: generateDefaultAsyncStateObj<PayMarketWithMdScope>(null),
        payMarketErrorMessage: ''
      };
    }
    case fromPayMarketModalActions.OPEN_DELETE_PAY_MARKET_MODAL: {
      return {
        ...state,
        deletePayMarketModalOpen: true
      };
    }
    case fromPayMarketModalActions.CLOSE_DELETE_PAY_MARKET_MODAL: {
      return {
        ...state,
        deletePayMarketModalOpen: false
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
    case fromPayMarketModalActions.ADD_OR_UPDATE_PAY_MARKET_ERROR: {
      return {
        ...state,
        payMarketErrorMessage: action.payload
      };
    }
    case fromPayMarketModalActions.DELETE_PAY_MARKET: {
      return {
        ...state,
        deletingPayMarket: true,
        deletingPayMarketError: false
      };
    }
    case fromPayMarketModalActions.DELETE_PAY_MARKET_SUCCESS: {
      return {
        ...state,
        deletingPayMarket: false,
        deletingPayMarketError: false
      };
    }
    case fromPayMarketModalActions.DELETE_PAY_MARKET_ERROR: {
      return {
        ...state,
        deletingPayMarket: false,
        deletingPayMarketError: true
      };
    }

    default: {
      return state;
    }
  }
}

export const getPayMarketModalOpen = (state: State) => state.payMarketModalOpen;
export const getDeletePayMarketModalOpen = (state: State) => state.deletePayMarketModalOpen;
export const getPayMarket = (state: State) => state.payMarket;
export const getPayMarketId = (state: State) => state.payMarketId;
export const getPayMarketErrorMessage = (state: State) => state.payMarketErrorMessage;
export const getDeletingPayMarketStatus = (state: State) => state.deletingPayMarket;
export const getDeletingPayMarketErrorStatus = (state: State) => state.deletingPayMarketError;
