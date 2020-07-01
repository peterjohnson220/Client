import { MatchedSurveyJob } from 'libs/models/payfactors-api/survey-search/response/index';

import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/index';
import { AsyncStateObjHelper } from 'libs/core/index';

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
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricingsToModify');
    }
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingsToModify')
    }
    default:
      return state;
  }
}

export const getPricingsToModify = (state: State) => state.pricingsToModify;
