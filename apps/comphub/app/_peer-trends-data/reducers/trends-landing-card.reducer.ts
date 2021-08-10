import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromTrendsLandingCardActions from '../actions/trends-landing-card.actions';
import { OrgIncCountData } from '../models';

export interface State {
  newExchangeParticipantsAsync: AsyncStateObj<string[]>;
  orgIncCountHistory: AsyncStateObj<OrgIncCountData[]>;
  deleteSavedTrendModalOpen: boolean;
  deleteSavedTrendTitle: string;
  deletingSavedTrend: boolean;
  deletingSavedTrendSuccess: boolean;
  deletingSavedTrendError: boolean;
  selectedTrendId: number;
}

const initialState: State = {
  newExchangeParticipantsAsync: generateDefaultAsyncStateObj<string[]>([]),
  orgIncCountHistory: generateDefaultAsyncStateObj<OrgIncCountData[]>([]),
  deleteSavedTrendModalOpen: false,
  deleteSavedTrendTitle: '',
  deletingSavedTrend: false,
  deletingSavedTrendSuccess: false,
  deletingSavedTrendError: false,
  selectedTrendId: null
};

export function reducer(state: State = initialState, action: fromTrendsLandingCardActions.Actions): State {

  switch (action.type) {

    case fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS:
      return AsyncStateObjHelper.loading(state, 'newExchangeParticipantsAsync');

    case fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'newExchangeParticipantsAsync', action.payload);

    case fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS_ERROR:
        return AsyncStateObjHelper.loadingError(state, 'newExchangeParticipantsAsync');

    case fromTrendsLandingCardActions.GET_ORG_INC_COUNT_HISTORY:
      return AsyncStateObjHelper.loading(state, 'orgIncCountHistory');

    case fromTrendsLandingCardActions.GET_ORG_INC_COUNT_HISTORY_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'orgIncCountHistory', action.payload);

    case fromTrendsLandingCardActions.GET_ORG_INC_COUNT_HISTORY_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'orgIncCountHistory');

    case fromTrendsLandingCardActions.DELETE_SAVED_TREND:
      return {
        deletingSavedTrendSuccess: false,
        deletingSavedTrendError: false,
        deletingSavedTrend: true,
        ...state
      };

    case fromTrendsLandingCardActions.DELETE_SAVED_TREND_SUCCESS:
      return {
        deletingSavedTrend: false,
        deletingSavedTrendSuccess: true,
        ...state
      };

    case fromTrendsLandingCardActions.DELETE_SAVED_TREND_ERROR:
          return {
            deletingSavedTrend: false,
            deletingSavedTrendError: true,
            ...state
          };

    case fromTrendsLandingCardActions.SET_SELECTED_TREND_ID:
      return {
        ...state,
        selectedTrendId: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getNewExchangeParticipants = (state: State) => state.newExchangeParticipantsAsync;
export const getOrgIncCountHistory = (state: State) => state.orgIncCountHistory;
export const getDeleteTrendModalOpen = (state: State) => state.deleteSavedTrendModalOpen;
export const getDeleteTrendTitle = (state: State) => state.deleteSavedTrendTitle;
export const getSelectedTrendId = (state: State) => state.selectedTrendId;
