import * as fromStatementListPageActions from '../actions/statement-list.page.actions';

export interface State {
  FocusedTab: 'Statements' | 'Templates';
}

export const initialState: State = {
  FocusedTab: 'Statements'
};

export function reducer(state = initialState, action: fromStatementListPageActions.StatementListPageActions): State {
  switch (action.type) {
    case fromStatementListPageActions.TOGGLE_TAB: {
      if (state.FocusedTab === 'Templates') {
        return {
          ...state,
          FocusedTab: 'Statements',
        };
      } else {
        return {
          ...state,
          FocusedTab: 'Templates',
        };
      }
    }
    case fromStatementListPageActions.SET_TAB: {
      return {
        ...state,
        FocusedTab: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
