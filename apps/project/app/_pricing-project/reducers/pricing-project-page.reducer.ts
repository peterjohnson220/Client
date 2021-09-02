import * as fromPricingProjectPageActions from '../actions';

export interface State {
  projectContext: any;
}

export const initialState: State = {
  projectContext: null
};

export function reducer(state = initialState, action: fromPricingProjectPageActions.PricingProjectPageActions): State {
  switch (action.type) {
    case fromPricingProjectPageActions.GET_PRICING_PROJECT_CONTEXT_SUCCESS: {
      return {
        ...state,
        projectContext: action.payload
      };
    }
    case fromPricingProjectPageActions.UPDATE_PROJECT: {
      return {
        ...state,
        projectContext: {
          ...state.projectContext,
          Project: action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
}

export const getProjectContext =  (state: State) => state.projectContext;
