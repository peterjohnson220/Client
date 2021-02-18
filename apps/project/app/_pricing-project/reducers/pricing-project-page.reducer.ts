import * as fromPricingProjectPageActions from '../actions';

export interface State {
  project: any;
}

export const initialState: State = {
  project: null
};

export function reducer(state = initialState, action: fromPricingProjectPageActions.PricingProjectPageActions): State {
  switch (action.type) {
    case fromPricingProjectPageActions.GET_PRICING_PROJECT_SUCCESS: {
      return {
        ...state,
        project: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getPricingProject =  (state: State) => state.project;
