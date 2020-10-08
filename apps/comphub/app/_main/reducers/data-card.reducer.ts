import { RateType } from 'libs/data/data-sets';

import * as fromDataCardActions from '../actions/data-card.actions';

export interface State {
  selectedRate: RateType;
  marketDataChange: boolean;
  peerBannerOpen: boolean;
  loadingPeerJobData: boolean;
  loadingPeerJobDataError: boolean;
  forceRefreshPeerMap: boolean;
}

const initialState: State = {
  selectedRate: RateType.Annual,
  marketDataChange: false,
  peerBannerOpen: false,
  loadingPeerJobData: false,
  loadingPeerJobDataError: false,
  forceRefreshPeerMap: false
};

// Reducer
export function reducer(state: State = initialState, action: fromDataCardActions.Actions) {
  switch (action.type) {
    case fromDataCardActions.SET_SELECTED_RATE: {
      return {
        ...state,
        selectedRate: action.payload
      };
    }
    case fromDataCardActions.SET_MARKET_DATA_CHANGE: {
      return {
        ...state,
        marketDataChange: action.payload
      };
    }
    case fromDataCardActions.SHOW_PEER_BANNER: {
      return {
        ...state,
        peerBannerOpen: true
      };
    }
    case fromDataCardActions.GET_PEER_QUICK_PRICE_DATA: {
      return {
        ...state,
        loadingPeerJobData: true,
        loadingPeerJobDataError: false
      };
    }
    case fromDataCardActions.GET_PEER_QUICK_PRICE_DATA_SUCCESS: {
      return {
        ...state,
        loadingPeerJobData: false,
        loadingPeerJobDataError: false
      };
    }
    case fromDataCardActions.GET_PEER_QUICK_PRICE_DATA_ERROR: {
      return {
        ...state,
        loadingPeerJobData: false,
        loadingPeerJobDataError: true
      };
    }
    case fromDataCardActions.SET_FORCE_REFRESH_PEER_MAP: {
      return{
        ...state,
        forceRefreshPeerMap: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getSelectedRate = (state: State) => state.selectedRate;
export const getMarketDataChange = (state: State) => state.marketDataChange;
export const getPeerBannerOpen = (state: State) => state.peerBannerOpen;
export const getForcePeerMapRefresh = (state: State) => state.forceRefreshPeerMap;
