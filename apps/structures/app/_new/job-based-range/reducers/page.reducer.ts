import * as fromJobBasedRangePageActions from '../actions/page.actions';

export interface State {
  pageTitle: string;
  currency: string;
}

const initialState: State = {
  pageTitle: '',
  currency: ''
};

export function reducer(state = initialState, action: fromJobBasedRangePageActions.PageActions): State {
  switch (action.type) {
    case fromJobBasedRangePageActions.SET_PAGE_METADATA:
      return {
        ...state,
        pageTitle: action.payload.pageTitle,
        currency: action.payload.currency
      };
    default:
      return state;
  }
}

export const getPageTitle = (state: State) => state.pageTitle;
export const getCurrency = (state: State) => state.currency;
