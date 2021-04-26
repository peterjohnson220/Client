import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromTrendsSummaryCardActions from '../actions/trends-summary-card.actions';

export interface State {
  peerTrends: AsyncStateObj<any[]>;
}

export const initialState: State = {
  peerTrends: generateDefaultAsyncStateObj<any[]>([])
};

export function reducer(state: State = initialState, action: fromTrendsSummaryCardActions.Actions): State {
  switch (action.type) {

    case fromTrendsSummaryCardActions.GET_PEER_TRENDS :
      return AsyncStateObjHelper.loading(state, 'peerTrends');

    case fromTrendsSummaryCardActions.GET_PEER_TRENDS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'peerTrends', action.payload);

    case fromTrendsSummaryCardActions.GET_PEER_TRENDS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'peerTrends');

    default:
      return state;
  }
}

export const getPeerTrends = (state: State) => state.peerTrends;
