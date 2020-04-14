import { MatchedSurveyJob } from 'libs/models/payfactors-api/survey-search/response';

import * as fromModifyPricingsActions from '../actions';

export interface State {
  pricingsToModify: MatchedSurveyJob[];
  isModifyingPricings: boolean;
}

export const initialState: State = {
  pricingsToModify: undefined,
  isModifyingPricings: false
};

export function reducer(state = initialState, action: fromModifyPricingsActions.ModifyPricingsActions): State {
  switch (action.type) {
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS:
      return {
        ...state,
        isModifyingPricings: true,
        pricingsToModify: action.payload
      };
    case fromModifyPricingsActions.MODIFY_PRICINGS_CANCEL:
      return {
        ...state,
        isModifyingPricings: false,
        pricingsToModify: undefined
      };
    default:
      return state;
  }
}

export const getPricingsToModify = (state: State) => state.pricingsToModify;
export const getIsModifyingPricings = (state: State) => state.isModifyingPricings;
