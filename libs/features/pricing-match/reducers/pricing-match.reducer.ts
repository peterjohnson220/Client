import * as fromPricingMatchActions from '../actions/pricing-match.actions';

export interface State {
  pricingMatch: any;
  loading: boolean;
  hasError: boolean;
}

export const initialState: State = {
  pricingMatch: null,
  loading: false,
  hasError: false
};

export function reducer(state = initialState, action: fromPricingMatchActions.Actions): State {
  switch (action.type) {
    case fromPricingMatchActions.LOAD_PEER_MATCH:
    case fromPricingMatchActions.LOAD_SLOTTED_COMPANY_JOB_MATCH:
    case fromPricingMatchActions.LOAD_MDJOB_MATCH:
    case fromPricingMatchActions.LOAD_SURVEY_MATCH:
      return {
        ...state,
        loading: true,
        hasError: false
      };
    case fromPricingMatchActions.LOAD_PRICING_MATCH_SUCCESS:
      return {
        ...state,
        loading: false,
        pricingMatch: action.payload
      };
    case fromPricingMatchActions.CLEAR_STATE:
      return {
        ...state,
        loading: false,
        pricingMatch: null
      };
    case fromPricingMatchActions.LOAD_PRICING_MATCH_ERROR:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    default:
      return state;
  }
}

export const getPricingMatch = (state: State) => state.pricingMatch;
export const getLoading = (state: State) => state.loading;
export const getHasError = (state: State) => state.hasError;
