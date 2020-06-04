import * as fromPayMarketModalActions from '../actions/paymarket-modal.actions';

export interface State {
  payMarketModalOpen: boolean;
}

export const initialState: State = {
  payMarketModalOpen: false
};

export function reducer(state = initialState, action: fromPayMarketModalActions.Actions): State {
  switch (action.type) {
    case fromPayMarketModalActions.OPEN_PAY_MARKET_MODAL: {
      return {
        ...state,
        payMarketModalOpen: true
      };
    }
    case fromPayMarketModalActions.CLOSE_PAY_MARKET_MODAL: {
      return {
        ...state,
        payMarketModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getPayMarketModalOpen = (state: State) => state.payMarketModalOpen;
