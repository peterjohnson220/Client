import * as fromProjectListPageActions from '../actions';

export interface State {
  SingleProjectShareId: number;
}

export const initialState: State = {
  SingleProjectShareId: null
};

export function reducer(state = initialState, action: fromProjectListPageActions.ProjectListPageActions): State {
  switch (action.type) {
    case fromProjectListPageActions.SAVE_SINGLE_PROJECT_SHARE_ID:
      return {
        ...state,
        SingleProjectShareId: action.payload
      };
    case fromProjectListPageActions.CLEAR_SINGLE_PROJECT_SHARE_ID:
    case fromProjectListPageActions.BULK_PROJECT_SHARE_ERROR:
      return {
        ...state,
        SingleProjectShareId: null
      };
    default: {
      return state;
    }
  }
}

export const getSingleProjectShareId = (state: State) => state.SingleProjectShareId;
