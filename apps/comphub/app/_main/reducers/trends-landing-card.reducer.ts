import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromTrendsLandingCardActions from '../actions/trends-landing-card.actions';

export interface State {
  newExchangeParticipantsAsync: AsyncStateObj<string[]>;
}

const initialState: State = {
  newExchangeParticipantsAsync: generateDefaultAsyncStateObj<string[]>([])
};

export function reducer(state: State = initialState, action: fromTrendsLandingCardActions.Actions): State {

  switch (action.type) {

    case fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS:
      return AsyncStateObjHelper.loading(state, 'newExchangeParticipantsAsync');

    case fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'newExchangeParticipantsAsync', action.payload);

    case fromTrendsLandingCardActions.GET_NEW_EXCHANGE_PARTICIPANTS_ERROR:
        return AsyncStateObjHelper.loadingError(state, 'newExchangeParticipantsAsync');

    default: {
      return state;
    }
  }
}

export const getNewExchangeParticipants = (state: State) => state.newExchangeParticipantsAsync;
