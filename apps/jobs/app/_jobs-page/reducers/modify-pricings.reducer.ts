import { MatchedSurveyJob } from 'libs/models/payfactors-api/survey-search/response';

import * as fromModifyPricingsActions from '../actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

export interface State {
  pricingsToModify: AsyncStateObj<MatchedSurveyJob[]>;
}

export const initialState: State = {
  pricingsToModify: generateDefaultAsyncStateObj<MatchedSurveyJob[]>([]),
};

export function reducer(state = initialState, action: fromModifyPricingsActions.ModifyPricingsActions): State {
  switch (action.type) {
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY: {
      return AsyncStateObjHelper.loading(state, 'pricingsToModify');
    }
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingsToModify', action.payload);
    }
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricingsToModify');
    }
    default:
      return state;
  }
}

export const getPricingsToModify = (state: State) => state.pricingsToModify;
