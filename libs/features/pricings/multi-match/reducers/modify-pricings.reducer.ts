import { MatchedSurveyJob } from 'libs/models/payfactors-api/survey-search/response';

import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

export interface State {
  pricingsToModify: AsyncStateObj<MatchedSurveyJob[]>;
  saving: boolean;
  hasError: boolean;

}

export const initialState: State = {
  pricingsToModify: generateDefaultAsyncStateObj<MatchedSurveyJob[]>([]),
  saving: false,
  hasError: false
};

export function reducer(state = initialState, action: fromModifyPricingsActions.ModifyPricingsActions): State {
  switch (action.type) {
    case fromModifyPricingsActions.MODIFY_PRICINGS: {
        return {
          ...state,
          saving: true,
        };
    }
    case fromModifyPricingsActions.MODIFY_PRICINGS_SUCCESS: {
      return {
      ...state,
        saving: false,
      };
    }
    case fromModifyPricingsActions.MODIFY_PRICINGS_ERROR: {
      return {
        ...state,
        hasError: true,
        saving: false

      };
    }
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY: {
      return AsyncStateObjHelper.loading(state, 'pricingsToModify');
    }
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricingsToModify');
    }
    case fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingsToModify');
    }
    default:
      return state;
  }
}

export const getPricingsToModify = (state: State) => state.pricingsToModify;
export const getIsSaving = (state: State) => state.saving;
export const getHasError = (state: State) => state.hasError;
