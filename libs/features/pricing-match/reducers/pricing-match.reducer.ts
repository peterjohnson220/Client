import { AsyncStateObj } from '../../../models/state';
import { generateDefaultAsyncStateObj } from '../../../models';
import { AsyncStateObjHelper } from '../../../core/helpers';
import * as fromPricingMatchActions from '../actions/pricing-match.actions';

export interface State {
  pricingMatch: AsyncStateObj<any>;
}

export const initialState: State = {
  pricingMatch: generateDefaultAsyncStateObj<any>({})
};

export function reducer(state = initialState, action: fromPricingMatchActions.Actions): State {
  switch (action.type) {
    case fromPricingMatchActions.LOAD_PRICING_MATCH:
      return AsyncStateObjHelper.loading(state, 'pricingMatch');
    case fromPricingMatchActions.LOAD_PRICING_MATCH_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'pricingMatch', action.payload);
    case fromPricingMatchActions.CLEAR_STATE:
      return initialState;
    case fromPricingMatchActions.LOAD_PRICING_MATCH_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'pricingMatch');
    default:
      return state;
  }
}

export const getPricingMatch = (state: State) => state.pricingMatch;
export const getLoading = (state: State) => state.pricingMatch.loading;
export const getHasError = (state: State) => state.pricingMatch.loadingError;
