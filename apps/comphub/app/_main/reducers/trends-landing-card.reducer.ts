import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromTrendsLandingCardActions from '../actions/trends-landing-card.actions';
import { OrgIncCountData } from '../models';

export interface State {
  newExchangeParticipantsAsync: AsyncStateObj<string[]>;
  orgIncCountHistory: AsyncStateObj<OrgIncCountData[]>;
}

const initialState: State = {
  newExchangeParticipantsAsync: generateDefaultAsyncStateObj<string[]>([]),
  orgIncCountHistory: generateDefaultAsyncStateObj<OrgIncCountData[]>([])
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

    default: {
      return state;
    }
  }
}

export const getNewExchangeParticipants = (state: State) => state.newExchangeParticipantsAsync;
export const getOrgIncCountHistory = (state: State) => state.orgIncCountHistory;
