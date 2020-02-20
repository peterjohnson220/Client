import * as fromJobBasedRangePageActions from '../actions/page.actions';

export interface State {
  pageTitle: string;
}

const initialState: State = {
  pageTitle: ''
};

export function reducer(state = initialState, action: fromJobBasedRangePageActions.PageActions): State {
  switch (action.type) {
    case fromJobBasedRangePageActions.SET_PAGE_TITLE:
      return {
        ...state,
        pageTitle: action.payload.pageTitle
      };
    default:
      return state;
  }
}

export const getPageTitle = (state: State) => state.pageTitle;
