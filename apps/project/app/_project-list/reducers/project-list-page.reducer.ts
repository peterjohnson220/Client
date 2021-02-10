import * as fromProjectListPageActions from '../actions';

export interface State {}

export const initialState: State = {};

export function reducer(state = initialState, action: fromProjectListPageActions.ProjectListPageActions): State {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
