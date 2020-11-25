import * as fromModifyPricingsActions from '../actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';


export interface State {
  deletingPricing: AsyncStateObj<boolean>;
  updatingPricing: AsyncStateObj<boolean>;
  deletingPricingMatch: AsyncStateObj<boolean>;
  updatingPricingMatch: AsyncStateObj<boolean>;
}

export const initialState: State = {
  deletingPricing: generateDefaultAsyncStateObj<boolean>(false),
  updatingPricing: generateDefaultAsyncStateObj<boolean>(false),
  deletingPricingMatch: generateDefaultAsyncStateObj<boolean>(false),
  updatingPricingMatch: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state = initialState, action: fromModifyPricingsActions.ModifyPricingsActions): State {
  switch (action.type) {
    case fromModifyPricingsActions.RESET_MODIFY_PRICINGS_MODALS: {
      let curState = AsyncStateObjHelper.resetErrors(state, 'deletingPricing');
      curState = AsyncStateObjHelper.resetErrors(curState, 'updatingPricing');
      curState = AsyncStateObjHelper.resetErrors(curState, 'deletingPricingMatch');
      curState = AsyncStateObjHelper.resetErrors(curState, 'updatingPricingMatch');
      return curState;
    }
    case fromModifyPricingsActions.DELETING_PRICING: {
      return AsyncStateObjHelper.saving(state, 'deletingPricing');
    }
    case fromModifyPricingsActions.DELETING_PRICING_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'deletingPricing');
    }
    case fromModifyPricingsActions.DELETING_PRICING_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'deletingPricing', action.error);
    }
    case fromModifyPricingsActions.UPDATING_PRICING: {
      return AsyncStateObjHelper.saving(state, 'updatingPricing');
    }
    case fromModifyPricingsActions.UPDATING_PRICING_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'updatingPricing');
    }
    case fromModifyPricingsActions.UPDATING_PRICING_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'updatingPricing', action.error);
    }
    case fromModifyPricingsActions.DELETING_PRICING_MATCH: {
      return AsyncStateObjHelper.saving(state, 'deletingPricingMatch');
    }
    case fromModifyPricingsActions.DELETING_PRICING_MATCH_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'deletingPricingMatch');
    }
    case fromModifyPricingsActions.DELETING_PRICING_MATCH_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'deletingPricingMatch', action.error);
    }
    case fromModifyPricingsActions.UPDATING_PRICING_MATCH: {
      return AsyncStateObjHelper.saving(state, 'updatingPricingMatch');
    }
    case fromModifyPricingsActions.UPDATING_PRICING_MATCH_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'updatingPricingMatch');
    }
    case fromModifyPricingsActions.UPDATING_PRICING_MATCH_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'updatingPricingMatch', action.error);
    }
    default: {
      return state;
    }
  }
}

export const getDeletingPricing = (state: State) => state.deletingPricing;
export const getUpdatingPricing = (state: State) => state.updatingPricing;
export const getDeletingPricingMatch = (state: State) => state.deletingPricingMatch;
export const getUpdatingPricingMatch = (state: State) => state.updatingPricingMatch;
export const getRecalculatingPricingInfo = (state: State) => (state.updatingPricingMatch.saving || state.updatingPricing.saving);

