import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';


import * as fromTrendsSummaryCardActions from '../actions/trends-summary-card.actions';
import { TrendsSummaryDetails, PayRateDate } from '../models';

export interface State {
  peerTrends: AsyncStateObj<PayRateDate[]>;
  exchangeJobIds: number[];
  companyJobIds: number[];
  minDate: Date;
  maxDate: Date;
  trendsSummaryDetails: TrendsSummaryDetails;
  displaySaveTrendModal: boolean;
  savingPeerTrend: AsyncStateObj<boolean>;
}

export const initialState: State = {
  peerTrends: generateDefaultAsyncStateObj<PayRateDate[]>([]),
  exchangeJobIds: [],
  companyJobIds: [],
  minDate: new Date(),
  maxDate: new Date(),
  trendsSummaryDetails: null,
  displaySaveTrendModal: false,
  savingPeerTrend: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state: State = initialState, action: fromTrendsSummaryCardActions.Actions): State {
  switch (action.type) {

    case fromTrendsSummaryCardActions.GET_PEER_TRENDS :
      return AsyncStateObjHelper.loading(state, 'peerTrends');

    case fromTrendsSummaryCardActions.GET_PEER_TRENDS_SUCCESS:
      return {
        ...AsyncStateObjHelper.loadingSuccess(state, 'peerTrends', action.payload.PricingHistory),
        exchangeJobIds: action.payload.ExchangeJobIds,
        companyJobIds: action.payload.CompanyJobIds
      };

    case fromTrendsSummaryCardActions.GET_PEER_TRENDS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'peerTrends');

    case fromTrendsSummaryCardActions.SET_TRENDS_DOMAIN:
      return {
        ...state,
        minDate: action.payload.minDate,
        maxDate: action.payload.maxDate
      };

    case fromTrendsSummaryCardActions.SET_TRENDS_PERCENT_CHANGE:
      return {
        ...state,
       trendsSummaryDetails: action.payload
      };

    case fromTrendsSummaryCardActions.TOGGLE_SAVE_TREND_MODAL:
      return {
        ...state,
        displaySaveTrendModal: action.payload.displayModal
      };

    case fromTrendsSummaryCardActions.SAVE_PEER_TREND:
      return AsyncStateObjHelper.saving(state, 'savingPeerTrend');

    case fromTrendsSummaryCardActions.SAVE_PEER_TREND_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'savingPeerTrend');

    case fromTrendsSummaryCardActions.SAVE_PEER_TREND_ERROR:
      return AsyncStateObjHelper.savingError(state, 'savingPeerTrend');

    case fromTrendsSummaryCardActions.RESET:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export const getPeerTrends = (state: State) => state.peerTrends;
export const getPeerTrendsSummaryDetails = (state: State) => state.trendsSummaryDetails;
export const getPeerTrendsDomain = (state: State) => ({ minDate: state.minDate, maxDate: state.maxDate });
export const getDisplaySavePeerTrendModal = (state: State) => state.displaySaveTrendModal;
export const getSavingPeerTrend = (state: State) => state.savingPeerTrend;
export const getPeerTrendsDomainMin = (state: State) => state.minDate;
export const getPeerTrendsDomainMax = (state: State) => state.maxDate;
export const getExchangeJobIds = (state: State) => state.exchangeJobIds;
export const getCompanyJobIds = (state: State) => state.companyJobIds;

