import orderBy from 'lodash/orderBy';

import { AsyncStateObjHelper } from 'libs/core/helpers';
import { PayMarket, PayMarketCut } from 'libs/models/paymarket';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromPayMarketDefaultSettingsActions from '../actions/paymarket-default-settings.actions';

export interface State {
  payMarkets: AsyncStateObj<PayMarket[]>;
  payMarketCuts: AsyncStateObj<PayMarketCut[]>;
}

const initialState: State = {
  payMarkets: generateDefaultAsyncStateObj<PayMarket[]>([]),
  payMarketCuts: generateDefaultAsyncStateObj<PayMarketCut[]>([])
};

export function reducer(state = initialState, action: fromPayMarketDefaultSettingsActions.Actions): State {
  switch (action.type) {
    case fromPayMarketDefaultSettingsActions.GET_PAY_MARKETS: {
      return AsyncStateObjHelper.loading(state, 'payMarkets');
    }
    case fromPayMarketDefaultSettingsActions.GET_PAY_MARKETS_SUCCESS: {
      const payMarkets = orderBy(action.payload, ['PayMarket']);
      return AsyncStateObjHelper.loadingSuccess(state, 'payMarkets', payMarkets);
    }
    case fromPayMarketDefaultSettingsActions.GET_PAY_MARKETS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'payMarkets');
    }
    case fromPayMarketDefaultSettingsActions.GET_PAY_MARKET_CUTS: {
      return AsyncStateObjHelper.loading(state, 'payMarketCuts');
    }
    case fromPayMarketDefaultSettingsActions.GET_PAY_MARKET_CUTS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'payMarketCuts', action.payload);
    }
    case fromPayMarketDefaultSettingsActions.GET_PAY_MARKET_CUTS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'payMarketCuts');
    }
    case fromPayMarketDefaultSettingsActions.CLEAR_PAY_MARKET_CUTS: {
      return {
        ...state,
        payMarketCuts: initialState.payMarketCuts
      };
    }
    case fromPayMarketDefaultSettingsActions.SAVE_PAY_MARKET_CUTS: {
      return AsyncStateObjHelper.saving(state, 'payMarketCuts');
    }
    case fromPayMarketDefaultSettingsActions.SAVE_PAY_MARKET_CUTS_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'payMarketCuts', action.payload);
    }
    case fromPayMarketDefaultSettingsActions.SAVE_PAY_MARKET_CUTS_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'payMarketCuts');
    }
    default: {
      return state;
    }
  }
}

export const getAccessiblePayMarkets = (state: State) => state.payMarkets;
export const getPayMarketCuts = (state: State) => state.payMarketCuts;

